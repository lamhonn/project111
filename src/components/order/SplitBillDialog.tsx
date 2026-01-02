import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Card,
  CardContent,
  Dialog,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { 
  totalOrderItemsAtom, 
  OrderItem, 
  saveBillSplitAtom,
  billSplitConfigurationAtom,
  SplitBill,
} from '../../context/orderStore';

interface SplitBillDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SplitBillDialog: React.FC<SplitBillDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const totalOrderItems = useAtomValue(totalOrderItemsAtom);
  const existingBillSplit = useAtomValue(billSplitConfigurationAtom);
  const saveBillSplit = useSetAtom(saveBillSplitAtom);

  // State for bills
  const [bills, setBills] = useState<SplitBill[]>([
    { id: '1', name: 'Bill 1', items: [] },
  ]);

  // State for items that haven't been assigned to any bill yet
  const [unassignedItems, setUnassignedItems] = useState<OrderItem[]>([]);

  // Initialize unassigned items when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      // If there's an existing split configuration, restore it
      if (existingBillSplit) {
        // Get all item IDs from the existing split (both in bills and unsplit)
        const existingItemIds = new Set<string>();
        existingBillSplit.bills.forEach(bill => {
          bill.items.forEach(item => existingItemIds.add(item.id));
        });
        existingBillSplit.unsplitItems.forEach(item => existingItemIds.add(item.id));

        // Find new items that weren't in the previous split
        const newItems = totalOrderItems.filter(item => !existingItemIds.has(item.id));

        // Restore bills and add new items to unassigned
        setBills(existingBillSplit.bills);
        setUnassignedItems([...existingBillSplit.unsplitItems, ...newItems]);
      } else {
        // Otherwise, initialize with all items unassigned
        setUnassignedItems([...totalOrderItems]);
        setBills([{ id: '1', name: 'Bill 1', items: [] }]);
      }
    }
  }, [isOpen, totalOrderItems, existingBillSplit]);

  // Drag and drop handlers
  const [draggedItem, setDraggedItem] = useState<OrderItem | null>(null);
  const [draggedFromBillId, setDraggedFromBillId] = useState<string | null>(null);

  const handleDragStart = (item: OrderItem, fromBillId?: string): void => {
    setDraggedItem(item);
    setDraggedFromBillId(fromBillId || null);
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
  };

  const handleDropToBill = (billId: string): void => {
    if (!draggedItem) return;

    // Remove from source
    if (draggedFromBillId) {
      // Remove from another bill
      setBills(prevBills =>
        prevBills.map(bill =>
          bill.id === draggedFromBillId
            ? { ...bill, items: bill.items.filter(item => item.id !== draggedItem.id) }
            : bill
        )
      );
    } else {
      // Remove from unassigned
      setUnassignedItems(prev => prev.filter(item => item.id !== draggedItem.id));
    }

    // Add to target bill
    setBills(prevBills =>
      prevBills.map(bill =>
        bill.id === billId
          ? { ...bill, items: [...bill.items, draggedItem] }
          : bill
      )
    );

    setDraggedItem(null);
    setDraggedFromBillId(null);
  };

  const handleDropToUnassigned = (): void => {
    if (!draggedItem || !draggedFromBillId) return;

    // Remove from bill
    setBills(prevBills =>
      prevBills.map(bill =>
        bill.id === draggedFromBillId
          ? { ...bill, items: bill.items.filter(item => item.id !== draggedItem.id) }
          : bill
      )
    );

    // Add back to unassigned
    setUnassignedItems(prev => [...prev, draggedItem]);

    setDraggedItem(null);
    setDraggedFromBillId(null);
  };

  const handleAddBill = (): void => {
    const newBillNumber = bills.length + 1;
    setBills(prev => [
      ...prev,
      { id: String(newBillNumber), name: `Bill ${newBillNumber}`, items: [] },
    ]);
  };

  const calculateBillTotal = (items: OrderItem[]): number => {
    return items.reduce((sum, item) => {
      const itemBasePrice = item.price * item.quantity;
      const toppingsPrice = item.toppings
        ? item.toppings.reduce((toppingSum, topping) => toppingSum + (topping.price * topping.quantity), 0)
        : 0;
      return sum + itemBasePrice + toppingsPrice;
    }, 0);
  };

  const handleSave = (): void => {
    // Save the bill split configuration to global state
    saveBillSplit({
      bills: bills,
      unsplitItems: unassignedItems,
    });
    onClose();
  };

  const handleCancel = (): void => {
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.xlarge,
          maxHeight: '90vh',
          minHeight: '70vh',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: theme.spacing.lg,
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Typography 
          variant="h6"
          fontWeight={theme.typography.fontWeights.bold}
        >
          {t('splitBillDialog.title')}
        </Typography>
        <IconButton 
          onClick={onClose}
          size="small"
          sx={{ 
            color: theme.colors.text,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Main Content - Two Column Layout */}
      <Box sx={{ 
        display: 'flex',
        height: 'calc(90vh - 180px)',
        minHeight: '400px',
      }}>
        {/* Left Side - All Items */}
        <Box sx={{ 
          flex: 1,
          p: theme.spacing.lg,
          borderRight: `1px solid ${theme.colors.border}`,
          overflowY: 'auto',
        }}>
          <Typography
            variant="body1"
            fontWeight={theme.typography.fontWeights.semibold}
            sx={{ mb: theme.spacing.md }}
          >
            {t('splitBillDialog.allItems')} ({unassignedItems.length})
          </Typography>

          <Box
            onDragOver={handleDragOver}
            onDrop={handleDropToUnassigned}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.md,
              minHeight: 200,
              p: theme.spacing.sm,
              borderRadius: theme.borderRadius.medium,
              backgroundColor: unassignedItems.length === 0 ? 'grey.50' : 'transparent',
            }}
          >
            {unassignedItems.length === 0 ? (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 150,
                color: 'text.secondary',
              }}>
                <Typography variant="body2" color="text.secondary">
                  {t('splitBillDialog.allItemsAssigned')}
                </Typography>
              </Box>
            ) : (
              unassignedItems.map((item) => {
                const itemBasePrice = item.price * item.quantity;
                const toppingsTotalPrice = item.toppings
                  ? item.toppings.reduce((sum, topping) => sum + (topping.price * topping.quantity), 0)
                  : 0;
                const itemTotalPrice = itemBasePrice + toppingsTotalPrice;

                return (
                  <Card
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    sx={{
                      cursor: 'grab',
                      borderRadius: theme.borderRadius.medium,
                      '&:active': {
                        cursor: 'grabbing',
                      },
                      '&:hover': {
                        boxShadow: 2,
                      },
                    }}
                  >
                    <CardContent sx={{ 
                      p: theme.spacing.md,
                      '&:last-child': { pb: theme.spacing.md },
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.md,
                    }}>
                      <Avatar
                        src={item.image}
                        alt={item.name}
                        variant="rounded"
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: theme.borderRadius.small,
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
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            {item.toppings.map(t => `+ ${t.name}`).join(', ')}
                          </Typography>
                        )}
                      </Box>
                      <Typography 
                        variant="body2"
                        fontWeight={theme.typography.fontWeights.medium}
                      >
                        €{itemTotalPrice.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </Box>
        </Box>

        {/* Right Side - Bills */}
        <Box sx={{ 
          flex: 1,
          p: theme.spacing.lg,
          overflowY: 'auto',
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: theme.spacing.md,
          }}>
            <Typography
              variant="body1"
              fontWeight={theme.typography.fontWeights.semibold}
            >
              {t('splitBillDialog.bills')}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddBill}
              sx={{
                borderRadius: theme.borderRadius.large,
                textTransform: 'none',
                fontSize: theme.typography.fontSizes.small,
                borderColor: theme.colors.border,
                color: theme.colors.text,
                '&:hover': {
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.primaryLight,
                },
              }}
            >
              {t('splitBillDialog.addBill')}
            </Button>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.lg,
          }}>
            {bills.map((bill) => {
              const total = calculateBillTotal(bill.items);

              return (
                <Box
                  key={bill.id}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropToBill(bill.id)}
                  sx={{
                    border: `2px dashed ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.medium,
                    p: theme.spacing.md,
                    backgroundColor: 'grey.50',
                    minHeight: 120,
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: theme.spacing.md,
                  }}>
                    <Typography
                      variant="body1"
                      fontWeight={theme.typography.fontWeights.semibold}
                      color="primary"
                    >
                      {bill.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={theme.typography.fontWeights.bold}
                      color="primary"
                    >
                      €{total.toFixed(2)}
                    </Typography>
                  </Box>

                  {bill.items.length === 0 ? (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 60,
                      color: 'text.secondary',
                    }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('splitBillDialog.dragItemsHere')}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: theme.spacing.sm,
                    }}>
                      {bill.items.map((item) => {
                        const itemBasePrice = item.price * item.quantity;
                        const toppingsTotalPrice = item.toppings
                          ? item.toppings.reduce((sum, topping) => sum + (topping.price * topping.quantity), 0)
                          : 0;
                        const itemTotalPrice = itemBasePrice + toppingsTotalPrice;

                        return (
                          <Card
                            key={item.id}
                            draggable
                            onDragStart={() => handleDragStart(item, bill.id)}
                            sx={{
                              cursor: 'grab',
                              borderRadius: theme.borderRadius.small,
                              backgroundColor: 'white',
                              '&:active': {
                                cursor: 'grabbing',
                              },
                            }}
                          >
                            <CardContent sx={{ 
                              p: theme.spacing.sm,
                              '&:last-child': { pb: theme.spacing.sm },
                              display: 'flex',
                              alignItems: 'center',
                              gap: theme.spacing.sm,
                            }}>
                              <Avatar
                                src={item.image}
                                alt={item.name}
                                variant="rounded"
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: theme.borderRadius.small,
                                }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography 
                                  variant="caption"
                                  fontWeight={theme.typography.fontWeights.medium}
                                >
                                  {item.quantity > 1 && `${item.quantity}x `}{item.name}
                                </Typography>
                              </Box>
                              <Typography 
                                variant="caption"
                                fontWeight={theme.typography.fontWeights.medium}
                              >
                                €{itemTotalPrice.toFixed(2)}
                              </Typography>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Footer Actions */}
      <Box sx={{ 
        p: theme.spacing.lg,
        borderTop: `1px solid ${theme.colors.border}`,
        display: 'flex',
        gap: theme.spacing.md,
        justifyContent: 'flex-end',
      }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          sx={{
            borderRadius: theme.borderRadius.large,
            textTransform: 'none',
            fontSize: theme.typography.fontSizes.medium,
            py: theme.spacing.md,
            px: theme.spacing.lg,
            borderColor: theme.colors.border,
            color: theme.colors.text,
            fontWeight: theme.typography.fontWeights.medium,
            '&:hover': {
              borderColor: theme.colors.text,
              backgroundColor: 'grey.50',
            },
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.brandWhite,
            borderRadius: theme.borderRadius.large,
            py: theme.spacing.md,
            px: theme.spacing.lg,
            textTransform: 'none',
            fontWeight: theme.typography.fontWeights.semibold,
            fontSize: theme.typography.fontSizes.medium,
            '&:hover': {
              backgroundColor: theme.colors.primaryHover,
            },
          }}
        >
          {t('splitBillDialog.save')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default SplitBillDialog;