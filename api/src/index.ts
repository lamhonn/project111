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
//TODO: Is input the correct naming convention to pass data to mutation?
const typeDefs = `#graphql
  type Item {
    id: ID!
    name: String!
    description: String
    price: Float!
    category: String!
    created_at: String
    updated_at: String
  }

  input CreateItem {
    name: String!
    description: String
    price: Float!
    category: String!
  }

  type Query {
    hello: String
  }

  type Mutation {
    addItem(input: CreateItem!): Item
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL API!',
  },

  //TODO: use correct TS typing here
  Mutation: {
    //GraphQL requires the parent argument even if unused
    addItem: async(parent, { input }, { db }) => {
      try {
        const { name, description, price, category } = input;

        const [result] = await db.execute(
          'INSERT INTO items (name, description, price, category) VALUES (?, ?, ?, ?)',
          [name, description, price, category]
        );

        const [rows] = await db.execute('SELECT * FROM items where id= ?', [result.insertId]);

        return rows[0];
      } catch(error) {
        throw new Error(`Failed to create item: ${error.message}`);
      }
    }
  },
};

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
//TODO: Is this error handling explicit enough?
const PORT = process.env.PORT || 4000;
await new Promise<void>((resolve, reject) => {
  httpServer.listen({ port: PORT }, (error?: Error) => {
    if(error) reject(error);
    else resolve();
  });
});
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
