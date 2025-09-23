import React from 'react';
import logo from './logo.svg';
import { graphqlClient } from './utils/graphqlClient';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>Check console for GraphQL test results</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

//TODO: move these graphql functions to a different file when layout requires it
function testGraphqlAPI() {
  const query = `
    query {
      hello
    }
  `;

  graphqlClient.query(query).then((data) => {
    console.log('GraphQL API response:', data);
  }).catch((error) => {
    console.error('Error calling GraphQL API:', error);
  });
}

async function queryItems() {
  const query = `
    query GetItems {
      items {
        id
        name
        description
        price
        categoryID
        created_at
        updated_at
      }
    }
  `;

  try {
    const queryResponse = await graphqlClient.query(query);
    console.log('Response: ', queryResponse);

    return queryResponse.data.items;

  } catch(error) {
    console.error('Failed to fetch items: ', error);
  }
}
//TODO: create input types for all mutations for client-side validations
async function testCreateItem() {
  const item = {
    name: "Paras Hanppari",
    description: "Kaupungin paras hanppari on nyt täällä!",
    price: 10.00,
    categoryID: 3
  };

  const query = `
    mutation CreateItem($input: CreateItem!) {
      createItem(input: $input) {
        code
        success
        message
        item {
          id
          name
          description
          price
          categoryID
          created_at
          updated_at
        }
      }
    }
  `;

  try {
    const newItem = await graphqlClient.query(query, { input: item });
    console.log('Created item:', newItem);
  } catch (error) {
    console.error('Error creating item:', error);
  }
}

//TODO: Do we need to check if item has changed before updating?
//TODO: Do we need to handle race conditions when multiple updates occur simultaneously?

async function testUpdateItem() {
  const itemUpdate = {
    id: 20,
    name: "Updated Hanppari 3",
    description: "Päivitetty kuvaus 3",
    price: 14.50,
    categoryID: 2
  };

  const query = `
    mutation UpdateItem($input: UpdateItem!) {
      updateItem(input: $input) {
        code
        success
        message
        item {
          id
          name
          description
          price
          categoryID
          created_at
          updated_at
        }
      }
    }
  `;

  try {
    const updatedItem = await graphqlClient.query(query, { input: itemUpdate });
    console.log('Updated item:', updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
  }
};


async function testDeleteItem() {
  const itemId = 23;

  const query = `
    mutation DeleteItem($id: ID!) {
      deleteItem(id: $id) {
        code
        success
        message
      }
    }
  `;

   try {
    const deletedItem = await graphqlClient.query(query, { id:  itemId});
    console.log('Deleted item successfully');
  } catch (error) {
    //TODO: security wise we don't want to disclose if ID exists in our database, so we shouldn't return an error here. Instead we want to only log it server side.
    console.error('Error deleting item:', error);
  }  
}
// Simple test without async function
queryItems()
  .then(items => {
    console.log('Fetched items:', items);
  })
  .catch(error => {
    console.error('Error fetching items:', error);
  });

testGraphqlAPI();
testCreateItem();
testUpdateItem();
testDeleteItem();
export default App;
