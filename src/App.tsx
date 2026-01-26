import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider, useAtomValue, useSetAtom } from 'jotai';
import MenuView from './views/menu/MenuView';
import WelcomeView from './views/welcome/WelcomeView';
import ErrorBoundary from './components/common/ErrorBoundary';
import AuthGuard from './components/auth/AuthGuard';
import { store } from './context/store';
import { sessionStateAtom, SessionState, startSessionAtom } from './context/orderStore';
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

// Main app content component - handles session state
const AppContent: React.FC = () => {
  const sessionState = useAtomValue(sessionStateAtom);
  const startSession = useSetAtom(startSessionAtom);

  const handleStartSession = () => {
    startSession();
  };

  // Show Welcome screen if session state is Welcome
  if (sessionState === SessionState.Welcome) {
    // TODO: Replace backgroundImage URL with an API call to fetch from settings
    return <WelcomeView onStartSession={handleStartSession} backgroundImage='https://images.pexels.com/photos/2130134/pexels-photo-2130134.jpeg'/>;
  }

  // Otherwise show the main menu view
  return <MenuView />;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ErrorBoundary>
          <AuthGuard>
            <AppContent />
          </AuthGuard>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default App;