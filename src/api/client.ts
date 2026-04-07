// src/api/client.ts
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { SetContextLink } from '@apollo/client/link/context';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { normalizeStoredAuthToken, revokeAuthorizationSession } from './utils/authSession';
import {
  getGraphqlErrorCodeFromExtensions,
  isUnauthorizedGraphqlCode,
} from './utils/authErrorPolicy';

const resolveGraphqlHttpEndpoint = (): string => {
  return import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
};

const resolveGraphqlWsEndpoint = (): string => {
  const configuredWsEndpoint = import.meta.env.VITE_GRAPHQL_WS_ENDPOINT;
  if (configuredWsEndpoint) {
    return configuredWsEndpoint;
  }

  const httpEndpoint = resolveGraphqlHttpEndpoint();
  if (httpEndpoint.startsWith('https://')) {
    return httpEndpoint.replace('https://', 'wss://');
  }

  if (httpEndpoint.startsWith('http://')) {
    return httpEndpoint.replace('http://', 'ws://');
  }

  return 'ws://localhost:4000/graphql';
};

const httpLink = new HttpLink({
  uri: resolveGraphqlHttpEndpoint(),
});

const UNAUTHORIZED_WS_CLOSE_CODE = 4401;

const getStatusCodeFromNetworkError = (error: unknown): number | null => {
  if (!error || typeof error !== 'object') {
    return null;
  }

  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode;
  }

  if (
    'cause' in error &&
    error.cause &&
    typeof error.cause === 'object' &&
    'statusCode' in error.cause &&
    typeof error.cause.statusCode === 'number'
  ) {
    return error.cause.statusCode;
  }

  return null;
};

const authLink = new SetContextLink(({ headers }) => {
  const token = normalizeStoredAuthToken(localStorage.getItem('authToken'));
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const errorLink = new ErrorLink(({ error, operation }) => {
  let shouldRevokeAuthorization = false;

  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path, extensions }) => {
      const errorCode = getGraphqlErrorCodeFromExtensions(extensions);

      if (isUnauthorizedGraphqlCode(errorCode)) {
        shouldRevokeAuthorization = true;
      }

      console.error(
        `[GraphQL error]: Message: ${message}, Code: ${errorCode ?? 'unknown'}, Location: ${locations}, Path: ${path}`
      );
    });
  } else {
    const statusCode = getStatusCodeFromNetworkError(error);
    if (statusCode === 401) {
      shouldRevokeAuthorization = true;
    }

    console.error(`[Network error]: ${error}`);
  }

  if (shouldRevokeAuthorization) {
    console.warn(`[Auth] Revoking authorization after failed operation: ${operation.operationName || 'unknown'}`);
    revokeAuthorizationSession();
  }
});

const wsLink = typeof window === 'undefined'
  ? null
  : new GraphQLWsLink(
      createClient({
        url: resolveGraphqlWsEndpoint(),
        connectionParams: () => {
          const token = normalizeStoredAuthToken(localStorage.getItem('authToken'));
          return token ? { authorization: `Bearer ${token}` } : {};
        },
        on: {
          closed: (event) => {
            const code = typeof event === 'object' && event !== null && 'code' in event
              ? event.code
              : undefined;

            if (code === UNAUTHORIZED_WS_CLOSE_CODE) {
              revokeAuthorizationSession();
            }
          },
        },
      })
    );

const operationLink = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      authLink.concat(httpLink),
    )
  : authLink.concat(httpLink);

export const apolloClient = new ApolloClient({
  link: errorLink.concat(operationLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});