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
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { useCreateOrder } from '../../api/hooks/order.hooks';
import {
  orderItemsAtom,
  orderCountAtom,
  tableNumberAtom,
  removeOrderItemAtom,
  updateOrderItemQuantityAtom,
  submitOrderToTotalAtom,
} from '../../context/orderStore';
import { openConfirmDialogAtom } from '../../context/confirmDialogStore';

interface OrderSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderSummaryDialog: React.FC<OrderSummaryDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  
  // Use Jotai atoms
  const orderItems = useAtomValue(orderItemsAtom);
  const orderCount = useAtomValue(orderCountAtom);
  const tableNumber = useAtomValue(tableNumberAtom);
  const removeItem = useSetAtom(removeOrderItemAtom);
  const updateQuantity = useSetAtom(updateOrderItemQuantityAtom);
  const openConfirmDialog = useSetAtom(openConfirmDialogAtom);
  const submitOrderToTotal = useSetAtom(submitOrderToTotalAtom);
  const [createOrder, { loading: isSubmittingOrder }] = useCreateOrder();
  const [mutationError, setMutationError] = React.useState<string>('');

  const organizationId = import.meta.env.VITE_ORGANIZATION_ID ?? '';
  const tabletId = import.meta.env.VITE_TABLET_ID ?? import.meta.env.VITE_TABLE_ID ?? '';

  const handleRemoveItem = (itemId: string): void => {
    removeItem(itemId);
  };

  const handleIncrementItem = (itemId: string, currentQuantity: number): void => {
    updateQuantity({ itemId, quantity: currentQuantity + 1 });
  };

  const handleDecrementItem = (itemId: string, currentQuantity: number): void => {
    if (currentQuantity > 1) {
      updateQuantity({ itemId, quantity: currentQuantity - 1 });
    } else {
      // Remove item if quantity becomes 0
      removeItem(itemId);
    }
  };

  const handlePlaceOrder = (): void => {
    openConfirmDialog({
        title: t('confirmDialog.placeOrder.title'),
        message: t('confirmDialog.placeOrder.message'),
        cancelText: t('common.cancel'),
        confirmText: t('common.confirm'),
        onConfirm: () => {
            const parsedTableNumber = Number(tableNumber);
            if (!organizationId || !tabletId || Number.isNaN(parsedTableNumber)) {
              setMutationError('Missing organization/tablet/table number configuration.');
              return;
            }

            const products = orderItems.map((item) => {
              const itemToppings = (item.toppings ?? []).map((topping) => ({
                toppingId: topping.id,
                amount: topping.quantity,
              }));
              const toppingsTotal = (item.toppings ?? []).reduce(
                (sum, topping) => sum + topping.price * topping.quantity,
                0,
              );

              return {
                productId: item.productId,
                totalPrice: (item.price * item.quantity) + toppingsTotal,
                toppings: itemToppings.length > 0 ? itemToppings : undefined,
              };
            });

            const totalPrice = orderItems.reduce((sum, item) => {
              const itemBasePrice = item.price * item.quantity;
              const toppingsPrice = item.toppings
                ? item.toppings.reduce((toppingSum, topping) => toppingSum + (topping.price * topping.quantity), 0)
                : 0;
              return sum + itemBasePrice + toppingsPrice;
            }, 0);

            void createOrder({
              variables: {
                input: {
                  organizationId,
                  tabletId,
                  tableNumber: parsedTableNumber,
                  totalPrice,
                  products,
                },
              },
            }).then((result) => {
              const response = result.data?.createOrder;
              if (!response?.success || !response.order) {
                setMutationError(response?.message || 'Failed to place order.');
                return;
              }

              setMutationError('');
              submitOrderToTotal();
              onClose();
            }).catch((error: unknown) => {
              const message = error instanceof Error ? error.message : 'Failed to place order.';
              setMutationError(message);
            });
        },
    });
  };

  // Calculate payment summary including toppings
  const subtotal = orderItems.reduce((sum, item) => {
    const itemBasePrice = item.price * item.quantity;
    const toppingsPrice = item.toppings
      ? item.toppings.reduce((toppingSum, topping) => toppingSum + (topping.price * topping.quantity), 0)
      : 0;
    return sum + itemBasePrice + toppingsPrice;
  }, 0);
  const taxes = subtotal * 0.14; // 14% tax - TODO: alcohol tax rate is different
  const beforeTaxes = subtotal - taxes;
//   const discount = 10; // TODO:
//   const total = subtotal; // TODO: apply discount

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
            {t('orderSummaryDialog.title')}
          </Typography>
          <Typography 
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {t('common.table')} {tableNumber}
          </Typography>
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
        <Typography 
          variant="body1"
          fontWeight={theme.typography.fontWeights.semibold}
          sx={{ mb: theme.spacing.md }}
        >
          {t('orderSummaryDialog.totalItems')} ({orderCount})
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          {orderItems.map((item) => {
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
                  
                  {/* Show excludables if present */}
                  {item.excludables && item.excludables.length > 0 && (
                    <Box sx={{ mt: 0.5 }}>
                      {item.excludables.map((excludable, index) => (
                        <Typography
                          key={index}
                          variant="caption"
                          sx={{ display: 'block', lineHeight: 1.4, color: '#dc2626' }}
                        >
                          − {excludable}
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
                
                {/* Quantity Controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleDecrementItem(item.id, item.quantity)}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 24,
                      textAlign: 'center',
                      fontWeight: 'medium',
                    }}
                  >
                    {item.quantity}
                  </Typography>
                  
                  <IconButton
                    size="small"
                    onClick={() => handleIncrementItem(item.id, item.quantity)}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  
                  <IconButton
                    onClick={() => handleRemoveItem(item.id)}
                    sx={{
                      color: 'error.main',
                      ml: 0.5,
                      '&:hover': {
                        color: 'error.dark',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
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
            {t('orderSummaryDialog.paymentSummary')}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('orderSummaryDialog.priceBeforeVat')}
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
                {t('orderSummaryDialog.vat')}
              </Typography>
              <Typography 
                variant="body2"
                fontWeight={theme.typography.fontWeights.medium}
              >
                €{taxes.toFixed(2)}
              </Typography>
            </Box>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant={theme.typography.summaryLabel.variant} color="text.secondary">
                Discount
              </Typography>
              <Typography 
                variant={theme.typography.summaryValue.variant}
                fontWeight={theme.typography.summaryValue.fontWeight}
              >
                €{discount.toFixed(2)}
              </Typography>
            </Box> */}
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
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ 
        p: theme.spacing.lg,
        borderTop: `1px solid ${theme.colors.border}`,
      }}>
        {mutationError && (
          <Typography variant="body2" color="error" sx={{ width: '100%', mb: 1 }}>
            {mutationError}
          </Typography>
        )}
        <Button
          onClick={handlePlaceOrder}
          variant="contained"
          fullWidth
          disabled={orderCount === 0 || isSubmittingOrder}
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
          {isSubmittingOrder ? 'Placing order...' : t('orderSummaryDialog.placeOrder')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderSummaryDialog;