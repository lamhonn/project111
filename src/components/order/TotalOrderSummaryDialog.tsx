import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import {
  totalOrderItemsAtom,
  totalOrderCountAtom,
  orderNumberAtom,
  billRequestedAtom,
} from '../../context/orderStore';
import { openConfirmDialogAtom } from '../../context/confirmDialogStore';

interface TotalOrderSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TotalOrderSummaryDialog: React.FC<TotalOrderSummaryDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  
  // Use Jotai atoms
  const totalOrderItems = useAtomValue(totalOrderItemsAtom);
  const totalOrderCount = useAtomValue(totalOrderCountAtom);
  const orderNumber = useAtomValue(orderNumberAtom);
  const openConfirmDialog = useSetAtom(openConfirmDialogAtom);
  const setBillRequested = useSetAtom(billRequestedAtom);

  const handleAskForBill = (): void => {
    openConfirmDialog({
      title: t('confirmDialog.askForBill.title'),
      message: t('confirmDialog.askForBill.message'),
      cancelText: t('common.cancel'),
      confirmText: t('common.confirm'),
      onConfirm: () => {
        setBillRequested(true);
        onClose();
      },
    });
  };

  // Calculate payment summary including toppings
  const subtotal = totalOrderItems.reduce((sum, item) => {
    const itemBasePrice = item.price * item.quantity;
    const toppingsPrice = item.toppings
      ? item.toppings.reduce((toppingSum, topping) => toppingSum + (topping.price * topping.quantity), 0)
      : 0;
    return sum + itemBasePrice + toppingsPrice;
  }, 0);
  const taxes = subtotal * 0.14; // 14% tax - TODO: alcohol tax rate is different
  const beforeTaxes = subtotal - taxes;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.xlarge,
          maxHeight: '90vh',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: theme.spacing.lg,
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <Box>
          <Typography 
            variant="h6"
            fontWeight={theme.typography.fontWeights.bold}
          >
            {t('totalOrderSummaryDialog.title')}
          </Typography>
          {/* <Typography 
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {orderNumber}
          </Typography> */}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.colors.text,
            '&:hover': {
              color: theme.colors.brandGrey,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Order Items */}
      <DialogContent sx={{ p: theme.spacing.lg }}>
        {totalOrderItems.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
              color: 'text.secondary',
            }}
          >
            <ReceiptLongIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6" color="text.secondary">
              {t('totalOrderSummaryDialog.noOrders')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('totalOrderSummaryDialog.placeFirstOrder')}
            </Typography>
          </Box>
        ) : (
          <>
            <Typography 
              variant="body1"
              fontWeight={theme.typography.fontWeights.semibold}
              sx={{ mb: theme.spacing.md }}
            >
              {t('totalOrderSummaryDialog.allItems')} ({totalOrderCount})
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              {totalOrderItems.map((item) => {
                // Calculate total price for this item including toppings
                const itemBasePrice = item.price * item.quantity;
                const toppingsTotalPrice = item.toppings
                  ? item.toppings.reduce((sum, topping) => sum + (topping.price * topping.quantity), 0)
                  : 0;
                const itemTotalPrice = itemBasePrice + toppingsTotalPrice;

                return (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: theme.spacing.sm,
                      pb: theme.spacing.md,
                      borderBottom: '1px solid #f3f4f6',
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <Avatar
                      src={item.image}
                      alt={item.name}
                      variant="rounded"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: theme.borderRadius.medium,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="body1"
                        fontWeight={theme.typography.fontWeights.semibold}
                      >
                        {item.quantity > 1 && `${item.quantity}x `}{item.name}
                      </Typography>
                      
                      {/* Show toppings if present */}
                      {item.toppings && item.toppings.length > 0 && (
                        <Box sx={{ mt: 0.5 }}>
                          {item.toppings.map((topping) => (
                            <Typography
                              key={topping.id}
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block', lineHeight: 1.4 }}
                            >
                              + {topping.quantity > 1 && `${topping.quantity}x `}{topping.name} (€{topping.price.toFixed(2)})
                            </Typography>
                          ))}
                        </Box>
                      )}
                      
                      <Typography 
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        €{itemTotalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Payment Summary */}
            <Box sx={{ 
              mt: theme.spacing.lg,
              pt: theme.spacing.lg,
              borderTop: `1px solid ${theme.colors.border}`,
            }}>
              <Typography 
                variant="body1"
                fontWeight={theme.typography.fontWeights.semibold}
                sx={{ mb: theme.spacing.md }}
              >
                {t('totalOrderSummaryDialog.paymentSummary')}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('totalOrderSummaryDialog.priceBeforeVat')}
                  </Typography>
                  <Typography 
                    variant="body2"
                    fontWeight={theme.typography.fontWeights.medium}
                  >
                    €{beforeTaxes.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('totalOrderSummaryDialog.vat')}
                  </Typography>
                  <Typography 
                    variant="body2"
                    fontWeight={theme.typography.fontWeights.medium}
                  >
                    €{taxes.toFixed(2)}
                  </Typography>
                </Box>
                <Divider sx={{ my: theme.spacing.sm }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography 
                    variant="body1"
                    fontWeight={theme.typography.fontWeights.semibold}
                  >
                    {t('common.total')}
                  </Typography>
                  <Typography 
                    variant="h6"
                    fontWeight={theme.typography.fontWeights.bold}
                    color="primary"
                  >
                    €{subtotal.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ 
        p: theme.spacing.lg,
        borderTop: `1px solid ${theme.colors.border}`,
      }}>
        <Button
          onClick={handleAskForBill}
          variant="contained"
          fullWidth
          disabled={totalOrderCount === 0}
          sx={{
            backgroundColor: theme.colors.primary,
            color: 'white',
            fontWeight: theme.typography.fontWeights.semibold,
            textTransform: 'none',
            py: theme.spacing.md,
            borderRadius: theme.borderRadius.xlarge,
            '&:hover': {
              backgroundColor: theme.colors.primaryHover,
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(0, 0, 0, 0.12)',
              color: 'rgba(0, 0, 0, 0.26)',
            },
          }}
        >
          {t('totalOrderSummaryDialog.askForBill')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TotalOrderSummaryDialog;
