// src/api/client.ts
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { SetContextLink } from '@apollo/client/link/context';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

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

const authLink = new SetContextLink(({ headers }) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  } else {
    console.error(`[Network error]: ${error}`);
  }
});

const wsLink = typeof window === 'undefined'
  ? null
  : new GraphQLWsLink(
      createClient({
        url: resolveGraphqlWsEndpoint(),
        connectionParams: () => {
          const token = localStorage.getItem('authToken');
          return token ? { authorization: `Bearer ${token}` } : {};
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