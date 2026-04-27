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
import BillRequestOptionsDialog from './BillRequestOptionsDialog';
import StatusPill from '../common/StatusPill';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import {
  totalOrderItemsAtom,
  totalOrderCountAtom,
  tableNumberAtom,
  billRequestedAtom,
  billSplitConfigurationAtom,
  OrderItem,
  markBillsAsRequestedAtom,
  BillStatus,
  submittedOrdersAtom,
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
  const [isBillRequestOptionsOpen, setIsBillRequestOptionsOpen] = useState(false);
  
  // Use Jotai atoms
  const totalOrderItems = useAtomValue(totalOrderItemsAtom);
  const submittedOrders = useAtomValue(submittedOrdersAtom);
  const totalOrderCount = useAtomValue(totalOrderCountAtom);
  const tableNumber = useAtomValue(tableNumberAtom);
  const openConfirmDialog = useSetAtom(openConfirmDialogAtom);
  const setBillRequested = useSetAtom(billRequestedAtom);
  const billSplitConfig = useAtomValue(billSplitConfigurationAtom);
  const markBillsAsRequested = useSetAtom(markBillsAsRequestedAtom);

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

  // Filter active bills for checking if we should show split bill options
  const activeBills = billSplitConfig ? billSplitConfig.bills.filter(bill => bill.status === BillStatus.Active) : [];

  // Check if there are active split bills
  const hasSplitBills = activeBills.length > 0;

  // Handle ask for bill - show options dialog if there are split bills
  const handleAskForBill = (): void => {
    if (hasSplitBills) {
      setIsBillRequestOptionsOpen(true);
    } else {
      // No split bills, proceed with normal confirmation
      openConfirmDialog({
        title: t('confirmDialog.askForBill.title'),
        message: t('confirmDialog.askForBill.message'),
        cancelText: t('common.cancel'),
        confirmText: t('common.confirm'),
        onConfirm: () => {
          console.warn('[NOT IMPLEMENTED] requestBill mutation not called — staff will not receive bill request (WF-07)');
          setBillRequested(true);
          onClose();
        },
      });
    }
  };

  // Handle requesting all bills
  const handleRequestAllBills = (): void => {
    // TODO: Implement API call to request all bills
    // Mark all active bills as requested (don't re-request already requested ones)
    markBillsAsRequested(activeBills.map(bill => bill.id));
    // End session - request all remaining bills
    console.warn('[NOT IMPLEMENTED] requestBill mutation not called — staff will not receive bill request (WF-07)');
    setBillRequested(true);
    onClose();
  };

  // Handle requesting selected bills
  const handleRequestSelectedBills = (selectedBillIds: string[], includePrimary: boolean): void => {
    // TODO: Implement API call to request specific bills
    // selectedBillIds contains the IDs of bills to request
    // includePrimary indicates if the primary bill should be included
    console.log('Requesting bills:', { selectedBillIds, includePrimary });
    
    // Mark selected bills as requested
    markBillsAsRequested(selectedBillIds);
    
    // Check if this was the final bill request
    // Final bill = all active bills are requested AND (primary bill included OR no primary items exist)
    const remainingActiveBills = activeBills.filter(bill => !selectedBillIds.includes(bill.id));
    const noPrimaryItemsLeft = primaryBillItems.length === 0 || includePrimary;
    const isFinalBill = remainingActiveBills.length === 0 && noPrimaryItemsLeft;
    
    if (isFinalBill) {
      // This was the final bill - end session
      console.warn('[NOT IMPLEMENTED] requestBill mutation not called — staff will not receive bill request (WF-07)');
      setBillRequested(true);
    }
    
    // Session continues if there are still active bills or primary items remaining
    onClose();
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
        {totalOrderItems.length === 0 && submittedOrders.length === 0 ? (
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
            {/* Show submitted orders in boxes */}
            {submittedOrders.map((order) => {
              const orderTotal = calculateItemsTotal(order.items);
              const statusLabel = order.status === 'received' 
                ? t('orderStatus.received')
                : order.status === 'preparing'
                ? t('orderStatus.preparing')
                : 'Ready';

              return (
                <Box
                  key={order.id}
                  sx={{
                    mb: theme.spacing.lg,
                    border: `2px solid ${order.status === 'received' ? '#22c55e' : '#eab308'}`,
                    borderRadius: theme.borderRadius.medium,
                    p: theme.spacing.md,
                    backgroundColor: order.status === 'received' ? '#f0fdf4' : '#fefce8',
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: theme.spacing.md,
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StatusPill status={order.status} label={statusLabel} />
                      <Chip
                        label={`${order.items.length} ${order.items.length === 1 ? t('splitBillDialog.item') : t('splitBillDialog.items')}`}
                        size="small"
                        sx={{
                          bgcolor: 'white',
                          color: 'text.secondary',
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
                      €{orderTotal.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                    {order.items.map((item) => {
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
                            borderBottom: '1px solid #e5e7eb',
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
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
            
            {/* Show bill splits if they exist */}
            {billSplitConfig ? (
              <>
                {/* Show all split bills, gray out requested ones */}
                {billSplitConfig.bills.map((bill, index) => {
                  if (bill.items.length === 0) return null;
                  const isRequested = bill.status === BillStatus.Requested;
                  const billTotal = calculateItemsTotal(bill.items);

                  return (
                    <Box key={bill.id} sx={{ mb: theme.spacing.lg, opacity: isRequested ? 0.6 : 1 }}>
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
                            color={isRequested ? 'text.secondary' : 'text.primary'}
                          >
                            {t('splitBillDialog.bill')} {bill.id}
                          </Typography>
                          {isRequested && (
                            <Chip 
                              label={t('splitBillDialog.requested')} 
                              size="small"
                              sx={{
                                backgroundColor: 'grey.400',
                                color: 'white',
                                fontWeight: theme.typography.fontWeights.semibold,
                                fontSize: '0.7rem',
                              }}
                            />
                          )}
                          <Chip
                            label={`${bill.items.length} ${bill.items.length === 1 ? t('splitBillDialog.item') : t('splitBillDialog.items')}`}
                            size="small"
                            sx={{
                              bgcolor: isRequested ? 'grey.200' : theme.colors.primaryLight,
                              color: isRequested ? 'text.secondary' : theme.colors.primary,
                              fontWeight: theme.typography.fontWeights.medium,
                              fontSize: theme.typography.fontSizes.small,
                            }}
                          />
                        </Box>
                        <Typography 
                          variant="body1"
                          fontWeight={theme.typography.fontWeights.bold}
                          color={isRequested ? 'text.secondary' : 'primary'}
                        >
                          €{billTotal.toFixed(2)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                        {/* Group items by order status */}
                        {(() => {
                          // Separate items that are still being prepared from ready items
                          const preparingItems = bill.items.filter(item => 
                            item.orderStatus === 'received' || item.orderStatus === 'preparing'
                          );
                          const readyItems = bill.items.filter(item => 
                            !item.orderStatus || item.orderStatus === 'ready'
                          );
                          
                          // Group preparing items by orderId to show them in separate boxes
                          const itemsByOrder = new Map<string, OrderItem[]>();
                          preparingItems.forEach(item => {
                            const orderId = item.orderId || 'unknown';
                            if (!itemsByOrder.has(orderId)) {
                              itemsByOrder.set(orderId, []);
                            }
                            itemsByOrder.get(orderId)!.push(item);
                          });

                          return (
                            <>
                              {/* Show ready items first */}
                              {readyItems.map((item) => {
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
                                  </Box>
                                );
                              })}

                              {/* Show preparing items grouped by order in boxes */}
                              {Array.from(itemsByOrder.entries()).map(([orderId, items]) => {
                                const orderStatus = items[0]?.orderStatus || 'received';
                                const statusLabel = orderStatus === 'received' 
                                  ? t('orderStatus.received')
                                  : t('orderStatus.preparing');

                                return (
                                  <Box
                                    key={orderId}
                                    sx={{
                                      border: `2px solid ${orderStatus === 'received' ? '#22c55e' : '#eab308'}`,
                                      borderRadius: theme.borderRadius.medium,
                                      p: theme.spacing.sm,
                                      backgroundColor: orderStatus === 'received' ? '#f0fdf4' : '#fefce8',
                                    }}
                                  >
                                    <Box sx={{ mb: theme.spacing.sm }}>
                                      <StatusPill status={orderStatus} label={statusLabel} />
                                    </Box>
                                    {items.map((item) => {
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
                                            pb: theme.spacing.sm,
                                            mb: theme.spacing.sm,
                                            borderBottom: '1px solid #e5e7eb',
                                            '&:last-child': {
                                              borderBottom: 'none',
                                              mb: 0,
                                              pb: 0,
                                            },
                                          }}
                                        >
                                          <Avatar
                                            src={item.image}
                                            alt={item.name}
                                            variant="rounded"
                                            sx={{
                                              width: 48,
                                              height: 48,
                                              borderRadius: theme.borderRadius.medium,
                                            }}
                                          />
                                          <Box sx={{ flex: 1 }}>
                                            <Typography 
                                              variant="body2"
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
                                              variant="caption"
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
                                );
                              })}
                            </>
                          );
                        })()}
                      </Box>

                      {index < billSplitConfig.bills.filter(b => b.items.length > 0).length - 1 + (primaryBillItems.length > 0 ? 1 : 0) && (
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
                {/* Show header only if there are ready items to display */}
                {totalOrderItems.length > 0 && (
                  <Typography 
                    variant="body1"
                    fontWeight={theme.typography.fontWeights.semibold}
                    sx={{ mb: theme.spacing.md }}
                  >
                    {t('totalOrderSummaryDialog.allItems')} ({totalOrderItems.length})
                  </Typography>
                )}

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

      {/* Bill Request Options Dialog */}
      <BillRequestOptionsDialog
        isOpen={isBillRequestOptionsOpen}
        onClose={() => setIsBillRequestOptionsOpen(false)}
        bills={billSplitConfig?.bills || []}
        primaryBillItems={primaryBillItems}
        onRequestAll={handleRequestAllBills}
        onRequestSelected={handleRequestSelectedBills}
      />
    </Dialog>
  );
};

export default TotalOrderSummaryDialog;
