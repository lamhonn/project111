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
import { openConfirmDialogAtom } from '../../state/confirmDialogStore';
import { billsAtom, sessionOrdersAtom, setBillsRequestedAtom } from '../../state/sessionStore';
import { tabletNumberAtom } from '../../state/uiStore';
import { calculateTotalOrderProductsPrice } from '../../utils/orderUtils';
import { OrderStatus } from '../../types/enums/orderStatus';
import { getTranslation } from '../../utils/multilingualNameUtils';
import { OrderProductViewModel } from '../../types/viewModels/orderProductViewModel';
import { BillStatus } from '../../types/enums/billStatus';

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

interface TotalOrderSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const BillSummaryDialog: React.FC<TotalOrderSummaryDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [isBillRequestOptionsOpen, setIsBillRequestOptionsOpen] = useState(false);
  
  const orders = useAtomValue(sessionOrdersAtom);
  const orderProducts = orders.flatMap(order =>  order.OrderProducts); // Consider moving this logic into state instead of running it on every render
  const totalOrderCount = orders.length;
  const totalOrderProductsCount = orderProducts.length;
  const tableNumber = useAtomValue(tabletNumberAtom);
  const openConfirmDialog = useSetAtom(openConfirmDialogAtom);
  const bills = useAtomValue(billsAtom); 
  const defaultBill = bills.find(bill => bill.Id === EMPTY_GUID);
  const defaultBillProducts = orderProducts.filter(orderProduct => defaultBill?.OrderProducts.includes(orderProduct.Id)); // Consider moving this logic into state instead of running it on every render
  const setBillsRequested = useSetAtom(setBillsRequestedAtom);

  const activeBills = bills.filter(bill => bill.Status === BillStatus.PENDING );

  const hasSplitBills = activeBills.length > 1;

  const getOrderProductsForBill = (orderProductIds: string[]): OrderProductViewModel[] => {
    return orderProducts.filter(orderProduct => orderProductIds.includes(orderProduct.Id));
  }

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
          setBillsRequested(activeBills.map(bill => bill.Id));
          onClose();
        },
      });
    }
  };

  // Handle requesting all bills
  const handleRequestAllBills = (): void => {
    setBillsRequested(activeBills.map(bill => bill.Id));
    onClose();
  };

  // Handle requesting selected bills
  const handleRequestSelectedBills = (selectedBillIds: string[]): void => {
    // TODO: Implement API call to request specific bills
    
    // Mark selected bills as requested
    setBillsRequested(selectedBillIds);
    
    // Session continues if there are still active bills or primary items remaining
    onClose();
  };

  // Calculate payment summary including toppings
  const subtotal = calculateTotalOrderProductsPrice(orderProducts);
  const taxes = subtotal * 0.135; // 13.5% tax - TODO: alcohol tax rate is different; set tax rate dynamic
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
        {orderProducts.length === 0 ? (
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
            {orders.map((order) => {
              return (
                <Box
                  key={order.Id}
                  sx={{
                    mb: theme.spacing.lg,
                    border: `2px solid ${(order.OrderStatus === OrderStatus.RECEIVED || order.OrderStatus === OrderStatus.PENDING) ? '#22c55e' : '#eab308'}`,
                    borderRadius: theme.borderRadius.medium,
                    p: theme.spacing.md,
                    backgroundColor: (order.OrderStatus === OrderStatus.RECEIVED || order.OrderStatus === OrderStatus.PENDING) ? '#f0fdf4' : '#fefce8',
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: theme.spacing.md,
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StatusPill status={order.OrderStatus} />
                      <Chip
                        label={`${order.OrderProducts.length} ${order.OrderProducts.length === 1 ? t('splitBillDialog.item') : t('splitBillDialog.items')}`}
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
                      {order.TotalPrice}€
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                    {order.OrderProducts.map((product) => (
                      // TODO: we need a way to merge duplicate products for cleaner appearance. Otherwise show the same products as individuals
                        <Box
                          key={product.Id}
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
                              {getTranslation(product.Name, i18n.language)}
                            </Typography>
                            
                            {product.ProductToppings.length > 0 && (
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
                            
                            {product.ProductExcludables.length > 0 && (
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
                        </Box>
                      )
                    )}
                  </Box>
                </Box>
              );
            })}
            
            {/* Show bill splits if they exist */}
            {(bills && hasSplitBills)  ? (
              <>
                {/* Show all split bills, gray out requested ones */}
                {bills.map((bill, index) => {
                  if (bill.OrderProducts.length === 0) return null;
                  const billTotal = calculateTotalOrderProductsPrice(getOrderProductsForBill(bill.OrderProducts));
                  const billProducts = getOrderProductsForBill(bill.OrderProducts);

                  return (
                    <Box key={bill.Id} sx={{ mb: theme.spacing.lg, opacity: bill.Status === BillStatus.PENDING ? 1 : 0.6 }}>
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
                            color={bill.Status === BillStatus.PENDING ? 'text.primary' : 'text.secondary'}
                          >
                            {t('splitBillDialog.bill')} {bill.Id}
                          </Typography>
                          {(bill.Status === BillStatus.REQUESTED || bill.Status === BillStatus.COMPLETED) && (
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
                            label={`${bill.OrderProducts.length} ${bill.OrderProducts.length === 1 ? t('splitBillDialog.item') : t('splitBillDialog.items')}`}
                            size="small"
                            sx={{
                              bgcolor: bill.Status === BillStatus.PENDING ? theme.colors.primaryLight : 'grey.200',
                              color: bill.Status === BillStatus.PENDING ? theme.colors.primary : 'text.secondary',
                              fontWeight: theme.typography.fontWeights.medium,
                              fontSize: theme.typography.fontSizes.small,
                            }}
                          />
                        </Box>
                        <Typography 
                          variant="body1"
                          fontWeight={theme.typography.fontWeights.bold}
                          color={bill.Status === BillStatus.PENDING ? 'primary' : 'text.secondary'}
                        >
                          {billTotal}€
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                        {billProducts.map((product) => {
                          return (
                            <Box
                              key={product.Id}
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: theme.spacing.sm,
                                pb: theme.spacing.md,
                                borderBottom: '1px solid #f3f4f6',
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
                                  {getTranslation(product.Name, i18n.language)}
                                </Typography>
                                
                                {product.ProductToppings.length > 0 && (
                                  <Box sx={{ mt: 0.5 }}>
                                    {product.ProductToppings.map((topping) => (
                                      <Typography
                                        key={topping.Id}
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: 'block', lineHeight: 1.4 }}
                                      >
                                        + {getTranslation(product.Name, i18n.language)}
                                      </Typography>
                                    ))}
                                  </Box>
                                )}
                                
                                {product.ProductExcludables.length > 0 && (
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
                            </Box>
                          )}
                        )}
                      </Box>

                      {index < bills.filter(b => b.OrderProducts.length > 0).length - 1 + (defaultBillProducts.length > 0 ? 1 : 0) && (
                        <Divider sx={{ mt: theme.spacing.lg }} />
                      )}
                    </Box>
                  );
                })}

                {/* Show unsplit items as "Default Bill" */}
                {defaultBillProducts.length > 0 && (
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
                          label={`${defaultBillProducts.length} ${defaultBillProducts.length === 1 ? t('splitBillDialog.item') : t('splitBillDialog.items')}`}
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
                        {calculateTotalOrderProductsPrice(defaultBillProducts)}€
                      </Typography>
                    </Box>

                    {/* Individual products under default bill */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                      {defaultBillProducts.map((product) => {
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
                                {getTranslation(product.Name, i18n.language)}
                              </Typography>
                              
                              {product.ProductToppings.length > 0 && (
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
                              
                              {product.ProductExcludables.length > 0 && (
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
                {totalOrderProductsCount > 0 && (
                  <Typography 
                    variant="body1"
                    fontWeight={theme.typography.fontWeights.semibold}
                    sx={{ mb: theme.spacing.md }}
                  >
                    {t('totalOrderSummaryDialog.allItems')} ({totalOrderProductsCount})
                  </Typography>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                  {orderProducts.map((product) => {
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
                            {getTranslation(product.Name, i18n.language)}
                          </Typography>
                          
                          {/* Show toppings if present */}
                          {product.ProductToppings.length > 0 && (
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
                          {product.ProductExcludables.length > 0 && (
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
                            {calculateTotalOrderProductsPrice(orderProducts)}€
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
                    {subtotal}€
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
        onRequestAll={handleRequestAllBills}
        onRequestSelected={handleRequestSelectedBills}
      />
    </Dialog>
  );
};

export default BillSummaryDialog;
