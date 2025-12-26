import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'jotai';
import MenuView from './views/menu/MenuView';
import ErrorBoundary from './components/common/ErrorBoundary';
import { store } from './context/store';
// import './App.css';

// Create a MUI theme with brand colors
const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#4D80E6', // Indigo flower
      dark: '#3D70D6',
      light: 'rgba(77, 128, 230, 0.1)',
    },
    success: {
      main: '#4D80E6', // Indigo flower
      dark: '#3D70D6',
      light: 'rgba(77, 128, 230, 0.1)',
    },
    error: {
      main: '#ef4444',
      dark: '#dc2626',
    },
    background: {
      default: '#F8FBF8', // White porcelain
      paper: '#FFFFFF',
    },
    text: {
      primary: '#47585C', // Rust grey
      secondary: 'rgba(71, 88, 92, 0.7)',
    },
    grey: {
      100: '#f1f3f4',
      300: '#d0d0d0',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ErrorBoundary>
          <MenuView />
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default App;