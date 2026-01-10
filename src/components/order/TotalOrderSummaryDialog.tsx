import React, { useState } from 'react';
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
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SplitBillDialog from './SplitBillDialog';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import {
  totalOrderItemsAtom,
  totalOrderCountAtom,
  orderNumberAtom,
  billRequestedAtom,
  billSplitConfigurationAtom,
  OrderItem,
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
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  
  // Use Jotai atoms
  const totalOrderItems = useAtomValue(totalOrderItemsAtom);
  const totalOrderCount = useAtomValue(totalOrderCountAtom);
  const orderNumber = useAtomValue(orderNumberAtom);
  const openConfirmDialog = useSetAtom(openConfirmDialogAtom);
  const setBillRequested = useSetAtom(billRequestedAtom);
  const billSplitConfig = useAtomValue(billSplitConfigurationAtom);

  // Calculate new items that weren't in the original split
  const getNewItems = (): OrderItem[] => {
    if (!billSplitConfig) return [];
    
    const existingItemIds = new Set<string>();
    billSplitConfig.bills.forEach(bill => {
      bill.items.forEach(item => existingItemIds.add(item.id));
    });
    billSplitConfig.unsplitItems.forEach(item => existingItemIds.add(item.id));
    
    return totalOrderItems.filter(item => !existingItemIds.has(item.id));
  };

  const newItems = getNewItems();
  const primaryBillItems = billSplitConfig ? [...billSplitConfig.unsplitItems, ...newItems] : [];

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

  // Helper function to calculate total for items
  const calculateItemsTotal = (items: OrderItem[]): number => {
    return items.reduce((sum, item) => {
      const itemBasePrice = item.price * item.quantity;
      const toppingsPrice = item.toppings
        ? item.toppings.reduce((toppingSum, topping) => toppingSum + (topping.price * topping.quantity), 0)
        : 0;
      return sum + itemBasePrice + toppingsPrice;
    }, 0);
  };

  // Calculate payment summary including toppings
  const subtotal = calculateItemsTotal(totalOrderItems);
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
            {/* Show bill splits if they exist */}
            {billSplitConfig ? (
              <>
                {/* Show each split bill */}
                {billSplitConfig.bills.map((bill, index) => {
                  if (bill.items.length === 0) return null;
                  const billTotal = calculateItemsTotal(bill.items);

                  return (
                    <Box key={bill.id} sx={{ mb: theme.spacing.lg }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: theme.spacing.md,
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body1"
                            fontWeight={theme.typography.fontWeights.semibold}
                          >
                            {t('splitBillDialog.bill')} {bill.id}
                          </Typography>
                          <Chip
                            label={`${bill.items.length} ${bill.items.length === 1 ? t('splitBillDialog.item') : t('splitBillDialog.items')}`}
                            size="small"
                            sx={{
                              bgcolor: theme.colors.primaryLight,
                              color: theme.colors.primary,
                              fontWeight: theme.typography.fontWeights.medium,
                              fontSize: theme.typography.fontSizes.small,
                            }}
                          />
                        </Box>
                        <Typography 
                          variant="body1"
                          fontWeight={theme.typography.fontWeights.bold}
                          color="primary"
                        >
                          €{billTotal.toFixed(2)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                        {bill.items.map((item) => {
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

                      {index < billSplitConfig.bills.filter(b => b.items.length > 0).length - 1 + (billSplitConfig.unsplitItems.length > 0 ? 1 : 0) && (
                        <Divider sx={{ mt: theme.spacing.lg }} />
                      )}
                    </Box>
                  );
                })}

                {/* Show unsplit items as "Primary Bill" */}
                {primaryBillItems.length > 0 && (
                  <Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: theme.spacing.md,
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body1"
                          fontWeight={theme.typography.fontWeights.semibold}
                        >
                          {t('splitBillDialog.primaryBill')}
                        </Typography>
                        <Chip
                          label={`${primaryBillItems.length} ${primaryBillItems.length === 1 ? t('splitBillDialog.item') : t('splitBillDialog.items')}`}
                          size="small"
                          sx={{
                            bgcolor: 'grey.100',
                            color: 'text.secondary',
                            fontWeight: theme.typography.fontWeights.medium,
                            fontSize: theme.typography.fontSizes.small,
                          }}
                        />
                      </Box>
                      <Typography 
                        variant="body1"
                        fontWeight={theme.typography.fontWeights.bold}
                        color="text.secondary"
                      >
                        €{calculateItemsTotal(primaryBillItems).toFixed(2)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                      {primaryBillItems.map((item) => {
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
                  </Box>
                )}
              </>
            ) : (
              /* No split - show all items together */
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
              </>
            )}

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
        flexDirection: 'column',
        gap: theme.spacing.md,
      }}>
        <Button
          onClick={() => setIsSplitBillOpen(true)}
          variant="outlined"
          fullWidth
          disabled={totalOrderCount === 0}
          sx={{
            borderColor: theme.colors.primary,
            color: theme.colors.primary,
            fontWeight: theme.typography.fontWeights.semibold,
            textTransform: 'none',
            py: theme.spacing.md,
            borderRadius: theme.borderRadius.xlarge,
            '&:hover': {
              borderColor: theme.colors.primaryHover,
              backgroundColor: theme.colors.primaryLight,
            },
            '&.Mui-disabled': {
              borderColor: 'rgba(0, 0, 0, 0.12)',
              color: 'rgba(0, 0, 0, 0.26)',
            },
          }}
        >
          {t('splitBillDialog.title')}
        </Button>
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

      {/* Split Bill Dialog */}
      <SplitBillDialog 
        isOpen={isSplitBillOpen} 
        onClose={() => setIsSplitBillOpen(false)} 
      />
    </Dialog>
  );
};

export default TotalOrderSummaryDialog;
