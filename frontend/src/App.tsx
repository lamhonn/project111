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

//TODO: create query for API to create new items
//TODO: create an input type for new items
async function testCreateItem() {
  const item = {
    name: "Paras Hanppari",
    description: "Kaupungin paras hanppari on nyt täällä!",
    price: 10.00,
    categoryID: 3
  };

  const query = `
    mutation NewItem($input: CreateItem!) {
      addItem(input: $input) {
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
    const newItem = await graphqlClient.query(query, { input: item });
    console.log('Created item:', newItem);
  } catch (error) {
    console.error('Error creating item:', error);
  }
}

testGraphqlAPI();
testCreateItem(); 
export default App;
