const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

export const graphqlClient = {
  async query(query: string, variables?: any) {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/graphql-response+json, application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    //TODO: sanitize requests
    //TODO: authentication before sending requests

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }
    
    return response.json();
  }
};