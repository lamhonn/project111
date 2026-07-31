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
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { openConfirmDialogAtom } from '../../state/confirmDialogStore';
import { showToasterAtom } from '../../state/toasterStore';
import { getTranslation } from '../../utils/multilingualNameUtils';
import { createOrderAtom, orderProductsAtom } from '../../state/orderStore';
import { OrderProductViewModel } from '../../types/viewModels/orderProductViewModel';
import { calculateTotalOrderPrice } from '../../utils/orderUtils';
import { tabletNumberAtom } from '../../state/uiStore';

interface OrderSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderSummaryDialog: React.FC<OrderSummaryDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  
  const [orderProducts, setOrderProducts] = useAtom(orderProductsAtom);
  const createOrder = useSetAtom(createOrderAtom);

  const tableNumber = useAtomValue(tabletNumberAtom);
  const openConfirmDialog = useSetAtom(openConfirmDialogAtom);
  const showToaster = useSetAtom(showToasterAtom);

  // Order confirmation hook
  // const { confirmOrder } = useOrderConfirmation();
  // const addOrderItem = useSetAtom(addOrderItemAtom);

  // TODO: add "Forgot something" products

  const handleRemoveItem = (itemId: string): void => {
    const updatedArray = orderProducts.filter(product => product.Id !== itemId);
    setOrderProducts(updatedArray);
  };

  const handleIncrementItem = (itemId: string): void => {
    const item = orderProducts.find(product => product.Id === itemId);
    if (item) {
      const newItem: OrderProductViewModel = {
        ...item,
        Id: crypto.randomUUID(),
      }
      const updatedArray = [...orderProducts, newItem];
      setOrderProducts(updatedArray);
    }
  };

  const handlePlaceOrder = (): void => {
    openConfirmDialog({
        title: t('confirmDialog.placeOrder.title'),
        message: t('confirmDialog.placeOrder.message'),
        cancelText: t('common.cancel'),
        confirmText: t('common.confirm'),
        onConfirm: async () => {
          createOrder();
          
          onClose();

          showToaster({
            message: t('toaster.orderPreparing'),
            severity: 'warning', // Yellow color for in-progress status
            duration: 3000,
          });

          console.debug("Order placed");
      
          // TODO:
          // if (isConfirmed) {
          //     // Show success toaster for initial confirmation
          //     showToaster({
          //         message: t('toaster.orderReceived'),
          //         severity: 'success',
          //         duration: 3000,
          //     });
          // }
        },
    });
  };

  // Calculate payment summary including toppings
  const subtotal = calculateTotalOrderPrice(orderProducts);
  const taxes = subtotal * 0.135; // 13.5% tax - TODO: alcohol tax rate is different; maybe add custom tax rate?
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
          
          {/* TODO: uncomment when we have a proper "forgot something" product functionality */}
          {/* <Box sx={{ 
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
          </Box> */}
        </Box>

        <Typography 
          variant="body1"
          fontWeight={theme.typography.fontWeights.semibold}
          sx={{ mb: theme.spacing.md }}
        >
          {t('orderSummaryDialog.totalItems')} ({orderProducts.length})
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          {orderProducts.map((product) => {
            const count = orderProducts.filter(orderProduct => orderProduct === product).length;

            return (
              <Box
                key={product.Id}
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
                  src={product.ImgUrl}
                  alt={getTranslation(product.Name, i18n.language)}
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
                    {count > 1 && `${count}x `}{getTranslation(product.Name, i18n.language)}
                  </Typography>
                  
                  {/* Show toppings if present */}
                  {product.ProductToppings && product.ProductToppings.length > 0 && (
                    <Box sx={{ mt: 0.5 }}>
                      {product.ProductToppings.map((topping) => (
                        <Typography
                          key={topping.Id}
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', lineHeight: 1.4 }}
                        >
                          + {getTranslation(topping.Name, i18n.language)}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  
                  {/* Show excludables if present */}
                  {product.ProductExcludables && product.ProductExcludables.length > 0 && (
                    <Box sx={{ mt: 0.5 }}>
                      {product.ProductExcludables.map((excludable, index) => (
                        <Typography
                          key={index}
                          variant="caption"
                          sx={{ display: 'block', lineHeight: 1.4, color: '#dc2626' }}
                        >
                          − {getTranslation(excludable.Name, i18n.language)}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  
                  <Typography 
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {product.Price}€
                  </Typography>
                </Box>
                
                {/* Quantity Controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveItem(product.Id)}
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
                    {count}
                  </Typography>
                  
                  <IconButton
                    size="small"
                    onClick={() => handleIncrementItem(product.Id)}
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
                    onClick={() => handleRemoveItem(product.Id)}
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
          disabled={orderProducts.length === 0}
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