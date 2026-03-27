import React, { useState, useRef, useEffect } from 'react';
import { Box, CircularProgress, Container, Paper, Typography, TextField } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { theme } from '../../theme/theme';
import { useAuthorization, useVerifyTabletPin } from '../../api/hooks/auth.hooks';
import { useSetAtom } from 'jotai';
import { tableNumberAtom } from '../../context/orderStore';

/**
 * PIN Entry View
 * 
 * Shown when user is not authorized to access the app.
 * User must enter an 8-digit PIN to gain access.
 */
const UnauthorizedView: React.FC = () => {
  const [pin, setPin] = useState<string[]>(Array(8).fill(''));
  const [error, setError] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { authorizeToken } = useAuthorization();
  const setTableNumber = useSetAtom(tableNumberAtom);
  const [verifyTabletPin, { loading }] = useVerifyTabletPin();

  const tabletId = import.meta.env.VITE_TABLET_ID ?? import.meta.env.VITE_TABLE_ID ?? '';

  const handleUnauthorizedError = (message: string) => {
    setError(message);
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setPin(Array(8).fill(''));
      inputRefs.current[0]?.focus();
    }, 500);
  };

  const submitPin = async (pinValue: string) => {
    if (!tabletId) {
      handleUnauthorizedError('Tablet ID is missing. Set VITE_TABLET_ID or VITE_TABLE_ID.');
      return;
    }

    try {
      const result = await verifyTabletPin({
        variables: {
          input: {
            tabletId,
            pin: pinValue,
          },
        },
      });

      const response = result.data?.verifyTabletPin;
      if (!response?.success || !response.token) {
        handleUnauthorizedError(response?.message || 'Invalid PIN');
        return;
      }

      if (response.tablet?.tableNumber !== undefined) {
        setTableNumber(response.tablet.tableNumber);
      }

      const authResult = authorizeToken(response.token);
      if (!authResult.success) {
        handleUnauthorizedError(authResult.error || 'Authentication failed');
      }
    } catch (mutationError) {
      const message = mutationError instanceof Error ? mutationError.message : 'Authentication failed';
      handleUnauthorizedError(message);
    }
  };

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = async (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto-focus next input
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 8 digits are entered
    if (value && index === 7 && newPin.every(digit => digit !== '')) {
      const pinString = newPin.join('');
      await submitPin(pinString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length === 8) {
      const newPin = pastedData.split('');
      setPin(newPin);
      inputRefs.current[7]?.focus();
      
      // Auto-submit
      await submitPin(pastedData);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.100',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: theme.borderRadius.large,
            textAlign: 'center',
            animation: isShaking ? 'shake 0.5s' : 'none',
            '@keyframes shake': {
              '0%, 100%': { transform: 'translateX(0)' },
              '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
              '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
            },
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 3,
            }}
          >
            <LockIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>

          <Typography
            variant="h4"
            fontWeight={theme.typography.fontWeights.bold}
            gutterBottom
          >
            Enter PIN
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please enter your 8-digit PIN to login. 
          </Typography>

          {/* PIN Input Grid */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              justifyContent: 'center',
              mb: 3,
            }}
            onPaste={handlePaste}
          >
            {pin.map((digit, index) => (
              <TextField
                key={index}
                inputRef={el => inputRefs.current[index] = el}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                disabled={loading}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: 'center',
                    fontSize: '2rem',
                    fontWeight: theme.typography.fontWeights.bold,
                    padding: '16px 0',
                  },
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
                sx={{
                  width: 56,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: theme.borderRadius.medium,
                    '& fieldset': {
                      borderWidth: 2,
                      borderColor: error ? 'error.main' : 'grey.300',
                    },
                    '&:hover fieldset': {
                      borderColor: error ? 'error.main' : 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: error ? 'error.main' : 'primary.main',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            ))}
          </Box>

          {error && (
            <Typography 
              variant="body2" 
              color="error.main" 
              sx={{ 
                mb: 2,
                fontWeight: theme.typography.fontWeights.medium,
              }}
            >
              {error}
            </Typography>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CircularProgress size={20} />
            </Box>
          )}

          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Authorization required
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UnauthorizedView;
