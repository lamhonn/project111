import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MenuView from './views/menu/MenuView';
// import './App.css';

// Create a MUI theme
const muiTheme = createTheme({
  palette: {
    success: {
      main: '#22c55e',
      dark: '#16a34a',
      light: 'rgba(34, 197, 94, 0.1)',
    },
    error: {
      main: '#ef4444',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <MenuView />
    </ThemeProvider>
  );
}

export default App;