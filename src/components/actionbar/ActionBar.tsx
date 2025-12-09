import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Badge,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { actionBarTheme } from '../../theme';
import ConfirmDialog from '../common/ConfirmDialog';
import Toaster from '../common/Toaster';

interface ActionBarProps {
  orderCount?: number;
  totalPrice?: number;
}

const ActionBar: React.FC<ActionBarProps> = ({ orderCount = 0, totalPrice = 0 }) => {
  const theme = actionBarTheme;
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showToaster, setShowToaster] = useState(false);

  const handleShowOrder = (): void => {
    console.log('Show order clicked');
    // Add your show order logic here
  };

  const handleCallService = (): void => {
    setShowServiceDialog(true);
  };

  const handleConfirmService = (): void => {
    console.log('Service called');
    // Add your call service logic here
    setShowServiceDialog(false);
    setShowToaster(true);
  };

  const handleCloseToaster = (): void => {
    setShowToaster(false);
  };

  const handleCancelService = (): void => {
    setShowServiceDialog(false);
  };

  const hasOrder: boolean = orderCount > 0;

  return (
    <>
      {/* Floating Action Bar */}
      <Box
        sx={{
          position: theme.container.position,
          bottom: theme.container.bottom,
          left: theme.container.left,
          right: theme.container.right,
          backgroundColor: theme.container.backgroundColor,
          p: theme.container.padding,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: theme.container.gap,
          boxShadow: theme.container.boxShadow,
          zIndex: theme.container.zIndex,
        }}
      >
        {/* Call for Service Button */}
        <Button
          onClick={handleCallService}
          startIcon={<PersonIcon />}
          sx={{
            flex: 1,
            backgroundColor: theme.buttons.service.backgroundColor,
            color: theme.buttons.service.color,
            fontWeight: theme.buttons.service.fontWeight,
            fontSize: theme.buttons.service.fontSize,
            px: theme.buttons.service.paddingX,
            py: theme.buttons.service.paddingY,
            borderRadius: theme.buttons.service.borderRadius,
            textTransform: theme.buttons.service.textTransform,
            boxShadow: theme.buttons.service.boxShadow,
            gap: theme.buttons.service.gap,
            '&:hover': {
              backgroundColor: 'grey.100',
            },
          }}
        >
          Call for service
        </Button>

        {/* Show Order Button */}
        <Button
          onClick={handleShowOrder}
          disabled={!hasOrder}
          sx={{
            flex: 1,
            backgroundColor: theme.buttons.order.backgroundColor,
            color: theme.buttons.order.color,
            fontWeight: theme.buttons.order.fontWeight,
            fontSize: theme.buttons.order.fontSize,
            px: theme.buttons.order.paddingX,
            py: theme.buttons.order.paddingY,
            borderRadius: theme.buttons.order.borderRadius,
            textTransform: theme.buttons.order.textTransform,
            boxShadow: theme.buttons.order.boxShadow,
            gap: theme.buttons.order.gap,
            '&:hover': {
              backgroundColor: hasOrder ? 'grey.100' : undefined,
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              color: 'rgba(34, 197, 94, 0.5)',
            },
          }}
        >
          <Typography component="span">Show order</Typography>
          <Badge
            badgeContent={orderCount}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: theme.badge.backgroundColor,
                color: theme.badge.color,
                fontSize: theme.badge.fontSize,
                fontWeight: theme.badge.fontWeight,
                minWidth: theme.badge.minWidth,
                height: theme.badge.height,
              },
            }}
          >
            <ShoppingCartIcon />
          </Badge>
          {hasOrder && (
            <Typography component="span" fontWeight="bold" sx={{ ml: 0.5 }}>
              {totalPrice.toFixed(2)} €
            </Typography>
          )}
        </Button>
      </Box>

      {/* Service Call Confirmation Dialog */}
      <ConfirmDialog
        open={showServiceDialog}
        onClose={handleCancelService}
        onConfirm={handleConfirmService}
        title="Call for service?"
        message="A waiter will be notified and come to assist you shortly."
        cancelText="Cancel"
        confirmText="Confirm"
      />

      <Toaster
        open={showToaster}
        onClose={handleCloseToaster}
        message="Service called successfully! A waiter will assist you shortly."
        severity="success"
      />
    </>
  );
};

export default ActionBar;