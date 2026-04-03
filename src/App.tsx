import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography } from '@mui/material';
import { Provider, useAtomValue, useSetAtom } from 'jotai';
import MenuView from './views/menu/MenuView';
import WelcomeView from './views/welcome/WelcomeView';
import ErrorBoundary from './components/common/ErrorBoundary';
import AuthGuard from './components/auth/AuthGuard';
import { store } from './context/store';
import {
  sessionStateAtom,
  SessionState,
  startSessionAtom,
  setActiveSessionIdAtom,
  tableNumberAtom,
} from './context/orderStore';
import { useStartDiningSession } from './api/hooks/session.hooks';
import { normalizeStoredAuthToken } from './api/utils/authSession';
// import './App.css';

type TabletTokenClaims = {
  organizationId?: string;
  tabletId?: string;
  tableNumber?: number;
  role?: string;
};

const decodeTokenClaims = (token: string | null): TabletTokenClaims | null => {
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded) as TabletTokenClaims;
    return parsed;
  } catch {
    return null;
  }
};

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
  const setSessionId = useSetAtom(setActiveSessionIdAtom);
  const tableNumberValue = useAtomValue(tableNumberAtom);
  const [startDiningSession, { loading, error }] = useStartDiningSession();

  const token = normalizeStoredAuthToken(localStorage.getItem('authToken'));
  const tokenClaims = decodeTokenClaims(token);
  const organizationId = typeof tokenClaims?.organizationId === 'string' ? tokenClaims.organizationId : '';
  const tabletId = typeof tokenClaims?.tabletId === 'string' ? tokenClaims.tabletId : '';

  const handleStartSession = async () => {
    const parsedTableNumber = Number(tableNumberValue);

    if (!organizationId || !tabletId || Number.isNaN(parsedTableNumber)) {
      return;
    }

    try {
      const result = await startDiningSession({
        variables: {
          input: {
            organizationId,
            tabletId,
            tableNumber: parsedTableNumber,
          },
        },
      });

      const response = result.data?.startDiningSession;
      if (!response?.success || !response.session) {
        return;
      }

      setSessionId(response.session.sessionId);
      startSession();
    } catch {
      // Surface mutation errors via the error state below.
    }
  };

  // Show Welcome screen if session state is Welcome
  if (sessionState === SessionState.Welcome) {
    const hasSessionPrerequisites = Boolean(organizationId && tabletId && !Number.isNaN(Number(tableNumberValue)));

    // TODO: Replace backgroundImage URL with an API call to fetch from settings
    return (
      <>
        <WelcomeView
          onStartSession={() => {
            void handleStartSession();
          }}
          backgroundImage='https://images.pexels.com/photos/2130134/pexels-photo-2130134.jpeg'
          isStarting={loading}
          disabled={!hasSessionPrerequisites || loading}
        />
        {!hasSessionPrerequisites && (
          <Box sx={{ position: 'fixed', bottom: 16, left: 16, right: 16 }}>
            <Typography color='error' variant='body2' align='center'>
              Session prerequisites are missing. Ensure the auth token contains organizationId and tabletId, and table number is valid.
            </Typography>
          </Box>
        )}
        {error && (
          <Box sx={{ position: 'fixed', bottom: 16, left: 16, right: 16 }}>
            <Typography color='error' variant='body2' align='center'>
              {error.message}
            </Typography>
          </Box>
        )}
      </>
    );
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