import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'example',
  database: process.env.DB_NAME || 'projectdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Define your GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
    # Add your queries here
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL API!',
    // Add your resolvers here
  },
};

const app = express();

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
await server.start();

// Apply middleware
app.use(
  '/graphql',
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      db: pool
    }),
  }),
);

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
