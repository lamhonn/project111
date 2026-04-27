// src/api/client.ts
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { ErrorLink } from '@apollo/client/link/error';
import { SetContextLink } from '@apollo/client/link/context';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { createClient } from 'graphql-ws';

const GRAPHQL_URL =
  (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL ||
  'http://localhost:4000/graphql';

const toWebSocketUrl = (httpUrl: string): string => {
  const parsed = new URL(httpUrl);
  parsed.protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
  return parsed.toString();
};

const WS_URL =
  (import.meta as unknown as { env: Record<string, string> }).env?.VITE_WEBSOCKET_URL ||
  toWebSocketUrl(GRAPHQL_URL);

const httpLink = new HttpLink({ uri: GRAPHQL_URL });

const authLink = new SetContextLink(({ headers }) => {
  const token = localStorage.getItem('tablet_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// [NOT IMPLEMENTED] WF-06: subscriptions will not deliver data until
// verifyTabletPin (WF-02) stores a JWT in localStorage under 'tablet_token'.
const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL,
    connectionParams: () => {
      const token = localStorage.getItem('tablet_token');
      return token ? { authorization: `Bearer ${token}` } : {};
    },
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });
  } else {
    console.error(`[Network error on ${operation.operationName}]:`, error);
  }
});

export const apolloClient = new ApolloClient({
  link: errorLink.concat(splitLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});