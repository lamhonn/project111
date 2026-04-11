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
import { authTokenClaimsAtom } from './context/authStore';
import { useStartDiningSession } from './api/hooks/session.hooks';
import { revokeAuthorizationSession } from './api/utils/authSession';
import { isUnauthorizedMutationResponse } from './api/utils/authErrorPolicy';
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
  const setSessionId = useSetAtom(setActiveSessionIdAtom);
  const setTableNumber = useSetAtom(tableNumberAtom);
  const tableNumberValue = useAtomValue(tableNumberAtom);
  const tokenClaims = useAtomValue(authTokenClaimsAtom);
  const [startDiningSession, { loading, error }] = useStartDiningSession();
  const organizationId = typeof tokenClaims?.organizationId === 'string' ? tokenClaims.organizationId : '';
  const tabletId = typeof tokenClaims?.tabletId === 'string' ? tokenClaims.tabletId : '';
  const tokenTableNumber =
    typeof tokenClaims?.tableNumber === 'number' && Number.isFinite(tokenClaims.tableNumber)
      ? tokenClaims.tableNumber
      : null;

  React.useEffect(() => {
    if (sessionState !== SessionState.Welcome || tokenTableNumber === null) {
      return;
    }

    const parsedTableNumber = Number(tableNumberValue);
    if (parsedTableNumber !== tokenTableNumber) {
      setTableNumber(tokenTableNumber);
    }
  }, [sessionState, setTableNumber, tableNumberValue, tokenTableNumber]);

  const isForbiddenStartResponse = (response: { code?: string; message?: string | null } | null | undefined): boolean => {
    if (!response) {
      return false;
    }

    if (response.code === '403') {
      return true;
    }

    const message = typeof response.message === 'string' ? response.message : '';
    return /forbidden|insufficient permissions/i.test(message);
  };

  const runStartDiningSession = (tableNumber: number) => {
    return startDiningSession({
      variables: {
        input: {
          organizationId,
          tabletId,
          tableNumber,
        },
      },
    });
  };

  const handleStartSession = async () => {
    const parsedTableNumber = Number(tableNumberValue);
    const resolvedTableNumber = Number.isNaN(parsedTableNumber) ? tokenTableNumber : parsedTableNumber;

    if (!organizationId || !tabletId || resolvedTableNumber === null || Number.isNaN(resolvedTableNumber)) {
      return;
    }

    try {
      const result = await runStartDiningSession(resolvedTableNumber);

      let response = result.data?.startDiningSession;
      if (!response?.success || !response.session) {
        if (isUnauthorizedMutationResponse(response)) {
          revokeAuthorizationSession();
          return;
        }

        if (
          tokenTableNumber !== null
          && resolvedTableNumber !== tokenTableNumber
          && isForbiddenStartResponse(response)
        ) {
          setTableNumber(tokenTableNumber);

          const retryResult = await runStartDiningSession(tokenTableNumber);
          response = retryResult.data?.startDiningSession;

          if (!response?.success || !response.session) {
            if (isUnauthorizedMutationResponse(response)) {
              revokeAuthorizationSession();
            }

            return;
          }

          setSessionId(response.session.sessionId);
          startSession();
          return;
        }

        return;
      }

      setSessionId(response.session.sessionId);
      startSession();
    } catch (mutationError) {
      if (
        tokenTableNumber !== null
        && resolvedTableNumber !== tokenTableNumber
        && mutationError instanceof Error
        && /forbidden|insufficient permissions/i.test(mutationError.message)
      ) {
        setTableNumber(tokenTableNumber);
      }

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