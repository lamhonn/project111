import React from 'react';
import { Chip, keyframes } from '@mui/material';
import { theme } from '../../theme/theme';
import { OrderStatus } from '../../types/enums/orderStatus';
import { t } from 'i18next';
import { getOrderStatusLabel } from '../../utils/orderUtils';

interface StatusPillProps {
  status: OrderStatus;
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

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {

  const getStatusColor = () => {
    switch (status) {
      case OrderStatus.RECEIVED:
        return {
          backgroundColor: '#22c55e', // Green
          color: 'white',
        };
      case OrderStatus.PENDING:
      case OrderStatus.PREPARING:
        return {
          backgroundColor: '#eab308', // Yellow/Warning
          color: 'white',
        };
      case OrderStatus.COMPLETED:
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
  const label = getOrderStatusLabel(status);
  const shouldPulse = status === OrderStatus.PENDING || status === OrderStatus.RECEIVED || status === OrderStatus.PREPARING;

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
