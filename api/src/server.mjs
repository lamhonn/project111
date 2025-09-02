import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import http from 'http';

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

//TODO: create query to add data to DB

const app = express();
const httpServer = http.createServer(app);

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
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

//TODO: Add error handling middleware
//TODO: Add authentication to server

// Start the Express server
const PORT = process.env.PORT || 4000;
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
