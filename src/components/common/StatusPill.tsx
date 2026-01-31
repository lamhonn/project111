import React from 'react';
import { Chip, keyframes } from '@mui/material';
import { theme } from '../../theme/theme';

interface StatusPillProps {
  status: 'received' | 'preparing' | 'ready';
  label: string;
}

// Pulsing animation for active statuses
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

const StatusPill: React.FC<StatusPillProps> = ({ status, label }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'received':
        return {
          backgroundColor: '#22c55e', // Green
          color: 'white',
        };
      case 'preparing':
        return {
          backgroundColor: '#eab308', // Yellow/Warning
          color: 'white',
        };
      case 'ready':
        return {
          backgroundColor: '#22c55e', // Green
          color: 'white',
        };
      default:
        return {
          backgroundColor: 'grey.400',
          color: 'white',
        };
    }
  };

  const colors = getStatusColor();
  const shouldPulse = status === 'received' || status === 'preparing';

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: colors.backgroundColor,
        color: colors.color,
        fontWeight: theme.typography.fontWeights.semibold,
        fontSize: '0.75rem',
        animation: shouldPulse ? `${pulse} 2s ease-in-out infinite` : 'none',
        textTransform: 'capitalize',
      }}
    />
  );
};

export default StatusPill;
