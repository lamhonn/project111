import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Paper, Typography, TextField } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { theme } from '../../theme/theme';
import { useAuthorization } from '../../api/hooks/auth.hooks';

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
  const { authorizeWithPin } = useAuthorization();

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
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
      const result = authorizeWithPin(pinString);
      
      if (!result.success) {
        setError(result.error || 'Invalid PIN');
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
          setPin(Array(8).fill(''));
          inputRefs.current[0]?.focus();
        }, 500);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length === 8) {
      const newPin = pastedData.split('');
      setPin(newPin);
      inputRefs.current[7]?.focus();
      
      // Auto-submit
      const result = authorizeWithPin(pastedData);
      if (!result.success) {
        setError(result.error || 'Invalid PIN');
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
          setPin(Array(8).fill(''));
          inputRefs.current[0]?.focus();
        }, 500);
      }
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
