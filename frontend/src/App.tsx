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

//TODO: move this to a different file when layout requires it
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

testGraphqlAPI();
export default App;
