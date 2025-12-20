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
import { orderSummaryDialogTheme } from '../../theme/componentThemes';
import {
  orderItemsAtom,
  orderCountAtom,
  orderNumberAtom,
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
  const theme = orderSummaryDialogTheme;
  
  // Use Jotai atoms
  const orderItems = useAtomValue(orderItemsAtom);
  const orderCount = useAtomValue(orderCountAtom);
  const orderNumber = useAtomValue(orderNumberAtom);
  const removeItem = useSetAtom(removeOrderItemAtom);
  const updateQuantity = useSetAtom(updateOrderItemQuantityAtom);
  const openConfirmDialog = useSetAtom(openConfirmDialogAtom);
  const submitOrderToTotal = useSetAtom(submitOrderToTotalAtom);

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
        title: 'Place order?',
        message: 'Your order will be processed and prepared shortly.',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        onConfirm: () => {
            submitOrderToTotal();
            onClose();
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
          borderRadius: theme.dialog.borderRadius,
          maxHeight: theme.dialog.maxHeight,
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: theme.spacing.header.padding,
        borderBottom: theme.dialog.border,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <Box>
          <Typography 
            variant={theme.typography.title.variant}
            fontWeight={theme.typography.title.fontWeight}
          >
            Order's Summary
          </Typography>
          <Typography 
            variant={theme.typography.orderNumber.variant}
            color="text.secondary"
            sx={{ mt: theme.spacing.orderNumber.marginTop }}
          >
            {orderNumber}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.colors.closeButton,
            '&:hover': {
              color: theme.colors.closeButtonHover,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Order Items */}
      <DialogContent sx={{ p: theme.spacing.content.padding }}>
        <Typography 
          variant={theme.typography.sectionHeader.variant}
          fontWeight={theme.typography.sectionHeader.fontWeight}
          sx={{ mb: theme.spacing.sectionHeader.marginBottom }}
        >
          Total Items ({orderCount})
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.items.gap }}>
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
                  gap: theme.spacing.item.gap,
                  pb: theme.spacing.item.paddingBottom,
                  borderBottom: theme.dialog.borderLight,
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
                    width: theme.itemImage.size,
                    height: theme.itemImage.size,
                    borderRadius: theme.itemImage.borderRadius,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant={theme.typography.itemName.variant}
                    fontWeight={theme.typography.itemName.fontWeight}
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
                    variant={theme.typography.itemPrice.variant}
                    color="text.secondary"
                    sx={{ mt: theme.spacing.itemPrice.marginTop }}
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
                      color: theme.colors.deleteButton,
                      ml: 0.5,
                      '&:hover': {
                        color: theme.colors.deleteButtonHover,
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
          mt: theme.spacing.paymentSummary.marginTop,
          pt: theme.spacing.paymentSummary.paddingTop,
          borderTop: theme.dialog.border,
        }}>
          <Typography 
            variant={theme.typography.sectionHeader.variant}
            fontWeight={theme.typography.sectionHeader.fontWeight}
            sx={{ mb: theme.spacing.sectionHeader.marginBottom }}
          >
            Payment Summary
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.summary.gap }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant={theme.typography.summaryLabel.variant} color="text.secondary">
                Price before VAT
              </Typography>
              <Typography 
                variant={theme.typography.summaryValue.variant}
                fontWeight={theme.typography.summaryValue.fontWeight}
              >
                €{beforeTaxes.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant={theme.typography.summaryLabel.variant} color="text.secondary">
                VAT
              </Typography>
              <Typography 
                variant={theme.typography.summaryValue.variant}
                fontWeight={theme.typography.summaryValue.fontWeight}
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
            <Divider sx={{ my: theme.spacing.divider.marginY }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography 
                variant={theme.typography.total.variant}
                fontWeight={theme.typography.total.fontWeight}
              >
                Total
              </Typography>
              <Typography 
                variant={theme.typography.totalValue.variant}
                fontWeight={theme.typography.totalValue.fontWeight}
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
        p: theme.spacing.footer.padding,
        borderTop: theme.dialog.border,
      }}>
        <Button
          onClick={handlePlaceOrder}
          variant="contained"
          fullWidth
          disabled={orderCount === 0}
          sx={{
            backgroundColor: theme.buttons.placeOrder.backgroundColor,
            color: theme.buttons.placeOrder.color,
            fontWeight: theme.buttons.placeOrder.fontWeight,
            textTransform: theme.buttons.placeOrder.textTransform,
            py: theme.buttons.placeOrder.paddingY,
            borderRadius: theme.buttons.placeOrder.borderRadius,
            '&:hover': {
              backgroundColor: theme.buttons.placeOrder.backgroundColorHover,
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(0, 0, 0, 0.12)',
              color: 'rgba(0, 0, 0, 0.26)',
            },
          }}
        >
          Place Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderSummaryDialog;