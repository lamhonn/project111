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
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
// import {
//   orderItemsAtom,
//   orderCountAtom,
//   tableNumberAtom,
//   removeOrderItemAtom,
//   updateOrderItemQuantityAtom,
//   submitOrderToTotalAtom,
//   updateOrderStatusAtom,
//   addOrderItemAtom,
// } from '../../state/orderStore';
import { openConfirmDialogAtom } from '../../state/confirmDialogStore';
import { showToasterAtom } from '../../state/toasterStore';
import { getTranslation } from '../../utils/multilingualNameUtils';

interface OrderSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderSummaryDialog: React.FC<OrderSummaryDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  
  // Use Jotai atoms
  // const orderItems = useAtomValue(orderItemsAtom);
  // const orderCount = useAtomValue(orderCountAtom);
  // const tableNumber = useAtomValue(tableNumberAtom);
  // const removeItem = useSetAtom(removeOrderItemAtom);
  // const updateQuantity = useSetAtom(updateOrderItemQuantityAtom);
  // const openConfirmDialog = useSetAtom(openConfirmDialogAtom);
  // const submitOrderToTotal = useSetAtom(submitOrderToTotalAtom);
  // const updateOrderStatus = useSetAtom(updateOrderStatusAtom);
  const showToaster = useSetAtom(showToasterAtom);

  // Order confirmation hook
  // const { confirmOrder } = useOrderConfirmation();
  // const addOrderItem = useSetAtom(addOrderItemAtom);

  // Filter products for quick add: Sides (Category 2) and non-alcoholic Drinks (Category 3)
  const quickAddProducts: ProductWithCategory[] = MOCK_PRODUCTS.filter(
    (product) => 
      (product.Category === 2 || product.Category === 3) && // Sides or Drinks
      !product.AgeRestrictied && // Non-alcoholic
      product.Enabled
  ).slice(0, 6); // Limit to 6 products for display

  const handleQuickAddProduct = (product: ProductWithCategory): void => {
    const productName = getTranslation(product.Name, i18n.language);
    addOrderItem({
      id: product.Id,
      productId: product.Id,
      name: productName,
      image: product.ImgUrl || '',
      price: product.Price,
      quantity: 1,
    });
  };

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
        onConfirm: async () => {
            // Submit order and get the order ID
            const orderId = submitOrderToTotal();
            onClose();
            
            // Confirm order via API (currently returns true immediately)
            // When webhooks are implemented, this will wait for actual confirmation
            const isConfirmed = await confirmOrder(orderId, (status) => {
                // Handle status changes from the order system
                if (status === 'preparing' && orderId) {
                    // Update order status in store
                    updateOrderStatus({ orderId, status: 'preparing' });
                    showToaster({
                        message: t('toaster.orderPreparing'),
                        severity: 'warning', // Yellow color for in-progress status
                        duration: 3000,
                    });
                } else if (status === 'ready' && orderId) {
                    // Update order status to ready - this will move items to final bill
                    updateOrderStatus({ orderId, status: 'ready' });
                }
            });
            
            if (isConfirmed) {
                // Show success toaster for initial confirmation
                showToaster({
                    message: t('toaster.orderReceived'),
                    severity: 'success',
                    duration: 3000,
                });
            }
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
        {/* "Forgot something?" Section */}
        <Box sx={{ mb: theme.spacing.xl }}>
          <Typography 
            variant="body1"
            fontWeight={theme.typography.fontWeights.semibold}
            sx={{ mb: theme.spacing.md }}
          >
            {t('orderSummaryDialog.forgotSomething')}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: theme.spacing.md,
            overflowX: 'auto',
            pb: theme.spacing.sm,
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.colors.border,
              borderRadius: theme.borderRadius.small,
            },
          }}>
            {quickAddProducts.map((product) => {
              const productName = getTranslation(product.Name, i18n.language);
              
              return (
                <Box
                  key={product.Id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    minWidth: 100,
                  }}
                >
                  <Box
                    onClick={() => handleQuickAddProduct(product)}
                    sx={{
                      width: 100,
                      height: 100,
                      cursor: 'pointer',
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.medium,
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundImage: product.ImgUrl ? `url(${product.ImgUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: theme.colors.border,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: theme.shadows.md,
                        borderColor: theme.colors.primary,
                      },
                      '&:active': {
                        transform: 'scale(0.98)',
                      },
                    }}
                  >
                    {!product.ImgUrl && (
                      <FastfoodIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                    )}
                  </Box>
                  <Box sx={{ textAlign: 'center', maxWidth: 100 }}>
                    <Typography 
                      variant="caption"
                      sx={{ 
                        fontSize: '0.7rem',
                        lineHeight: 1.2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {productName}
                    </Typography>
                    <Typography 
                      variant="caption"
                      color="primary"
                      sx={{ 
                        fontSize: '0.75rem',
                        fontWeight: theme.typography.fontWeights.semibold,
                        display: 'block',
                        mt: 0.25,
                      }}
                    >
                      €{product.Price.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

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
        <Button
          onClick={handlePlaceOrder}
          variant="contained"
          fullWidth
          disabled={orderCount === 0}
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
          {t('orderSummaryDialog.placeOrder')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderSummaryDialog;