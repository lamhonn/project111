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
//TODO: When CRUD is finished use proper mutation responses: https://www.apollographql.com/docs/apollo-server/schema/schema
const typeDefs = `#graphql
  type Item {
    id: ID!
    name: String!
    description: String
    price: Float!
    categoryID: ID!
    created_at: String
    updated_at: String
  }

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  input CreateItem {
    name: String!
    description: String
    price: Float!
    categoryID: ID!
  }

  input UpdateItem {
    id: ID!
    name: String!
    description: String
    price: Float!
    categoryID: ID!
  }

  type DeleteItemMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type Query {
    hello: String
    items: [Item!] # Nullable array,non-nullable items
  }

  type Mutation {
    addItem(input: CreateItem!): Item
    updateItem(input: UpdateItem!): Item
    deleteItem(id: ID!): DeleteItemMutationResponse
  }

`;

// Define your resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL API!',
    //GraphQL requires the parent and args even if unused
    //TODO: Should we implement some kind of pagination logic?
    items: async(parent, args, { db }) => {
      try {
        const [rows] = await db.execute('SELECT * FROM items');

        return rows;
      } catch(error) {
        throw new Error(`Failed to fetch items ${error.message}`);
      }
    }
  },

  //TODO: use correct TS typing here
  Mutation: {
    //GraphQL requires the parent argument even if unused
    addItem: async(parent, { input }, { db }) => {
      try {
        const { name, description, price, categoryID } = input;

        const [result] = await db.execute(
          'INSERT INTO items (name, description, price, categoryID) VALUES (?, ?, ?, ?)',
          [name, description, price, categoryID]
        );

        const [rows] = await db.execute('SELECT * FROM items where id = ?', [result.insertId]);

        return rows[0];
      } catch(error) {
        throw new Error(`Failed to create item: ${error.message}`);
      }
    },
    updateItem: async(parent, { input }, { db }) => {
      try {
        const { id, name, description, price, categoryID } = input;

        const [result] = await db.execute('UPDATE items SET name = ?, description = ?, price = ?, categoryID = ? WHERE id = ?;', [name, description, price, categoryID, id]);

        const [rows] = await db.execute('SELECT * FROM items where id = ?;', [id]);

        return rows[0];
      } catch (error) {
        throw new Error(`Failed to update item: ${error.message}`);
      }
    },
    deleteItem: async(parent, { id }, { db }) => {
      try {
        const [selectResult] = await db.execute(
          'SELECT * FROM items where id = ?;', [id]);
        
      
        if(!selectResult.length) return {code: "200", success: true, message: "Item deleted"};
        
        //TODO: what to do with this result?
        const [deleteResult] = await db.execute(
        'DELETE FROM items where id = ?;', [id]);
        
        return {code: "200", success: true, message: "Item deleted"};
      } catch(error) {
        //TODO: log error here
        throw new Error(`Failed to delete item: ${error.message}`);
      }
    },
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
