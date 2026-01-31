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
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { 
  totalOrderItemsAtom, 
  OrderItem, 
  saveBillSplitAtom,
  billSplitConfigurationAtom,
  SplitBill,
  BillStatus,
  submittedOrdersAtom,
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
  const submittedOrders = useAtomValue(submittedOrdersAtom);
  const existingBillSplit = useAtomValue(billSplitConfigurationAtom);
  const saveBillSplit = useSetAtom(saveBillSplitAtom);

  // Combine ready items and items from submitted orders (all available items for splitting)
  const allAvailableItems = React.useMemo(() => {
    const readyItems = [...totalOrderItems];
    const preparingItems = submittedOrders.flatMap(order => order.items);
    return [...readyItems, ...preparingItems];
  }, [totalOrderItems, submittedOrders]);

  // State for bills
  const [bills, setBills] = useState<SplitBill[]>([]);

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
        const newItems = allAvailableItems.filter(item => !existingItemIds.has(item.id));

        // Restore bills and add new items to unassigned
        setBills(existingBillSplit.bills);
        setUnassignedItems([...existingBillSplit.unsplitItems, ...newItems]);
      } else {
        // Otherwise, initialize with all items unassigned and no bills
        setUnassignedItems([...allAvailableItems]);
        setBills([]);
      }
    }
  }, [isOpen, allAvailableItems, existingBillSplit]);

  // Drag and drop handlers
  const [draggedItem, setDraggedItem] = useState<OrderItem | null>(null);
  const [draggedFromBillId, setDraggedFromBillId] = useState<string | null>(null);

  // Click-based selection (fallback for drag-and-drop)
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [selectedFromBillId, setSelectedFromBillId] = useState<string | null>(null);

  // Quantity selection dialog
  const [showQuantityDialog, setShowQuantityDialog] = useState<boolean>(false);
  const [pendingMove, setPendingMove] = useState<{
    item: OrderItem;
    fromBillId: string | null;
    toBillId: string | null; // null means moving to unassigned
  } | null>(null);
  const [moveQuantity, setMoveQuantity] = useState<number>(1);

  const handleDragStart = (item: OrderItem, fromBillId?: string): void => {
    setDraggedItem(item);
    setDraggedFromBillId(fromBillId || null);
  };

  const handleItemClick = (item: OrderItem, fromBillId?: string): void => {
    // Toggle selection
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
      setSelectedFromBillId(null);
    } else {
      setSelectedItem(item);
      setSelectedFromBillId(fromBillId || null);
    }
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
  };

  const handleDropToBill = (billId: string): void => {
    if (!draggedItem) return;

    // Check if dropping to instruction box (billId === 'new')
    if (billId === 'new') {
      // Create a new bill with this item
      const newBillNumber = bills.length + 1;
      const newBill: SplitBill = {
        id: String(newBillNumber),
        items: [draggedItem],
        status: BillStatus.Active,
      };

      // Remove from source
      if (draggedFromBillId) {
        setBills(prevBills => {
          const filtered = prevBills
            .map(bill =>
              bill.id === draggedFromBillId
                ? { ...bill, items: bill.items.filter(item => item.id !== draggedItem.id) }
                : bill
            )
            .filter(bill => bill.items.length > 0); // Auto-delete empty bills
          
          // Renumber remaining bills
          const renumbered = filtered.map((bill, index) => ({
            ...bill,
            id: String(index + 1),
          }));
          
          return [...renumbered, newBill];
        });
      } else {
        setUnassignedItems(prev => prev.filter(item => item.id !== draggedItem.id));
        setBills(prev => [...prev, newBill]);
      }
    } else {
      // Remove from source
      if (draggedFromBillId) {
        // Remove from another bill and auto-delete if empty
        setBills(prevBills => {
          const updated = prevBills.map(bill =>
            bill.id === draggedFromBillId
              ? { ...bill, items: bill.items.filter(item => item.id !== draggedItem.id) }
              : bill
          );
          const filtered = updated.filter(bill => bill.items.length > 0 || bill.id === billId);
          return filtered.map((bill, index) => ({
            ...bill,
            id: String(index + 1),
          }));
        });
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
    }

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

  const handleBillAreaClick = (billId: string): void => {
    if (!selectedItem) return;

    // Don't move if trying to move to the same bill it's already in
    if (selectedFromBillId === billId) {
      // Just deselect the item
      setSelectedItem(null);
      setSelectedFromBillId(null);
      return;
    }

    // Check if item has quantity > 1
    if (selectedItem.quantity > 1) {
      setPendingMove({
        item: selectedItem,
        fromBillId: selectedFromBillId,
        toBillId: billId,
      });
      setMoveQuantity(1);
      setShowQuantityDialog(true);
      return;
    }

    // If clicking on instruction box, create new bill
    if (billId === 'new') {
      const newBillNumber = bills.length + 1;
      const newBill: SplitBill = {
        id: String(newBillNumber),
        items: [selectedItem],
        status: BillStatus.Active,
      };

      // Remove from source
      if (selectedFromBillId) {
        setBills(prevBills => {
          const filtered = prevBills
            .map(bill =>
              bill.id === selectedFromBillId
                ? { ...bill, items: bill.items.filter(item => item.id !== selectedItem.id) }
                : bill
            )
            .filter(bill => bill.items.length > 0);
          
          const renumbered = filtered.map((bill, index) => ({
            ...bill,
            id: String(index + 1),
          }));
          
          return [...renumbered, newBill];
        });
      } else {
        setUnassignedItems(prev => prev.filter(item => item.id !== selectedItem.id));
        setBills(prev => [...prev, newBill]);
      }
    } else {
      // Move to existing bill
      moveItemToDestination(selectedItem, selectedFromBillId, billId, selectedItem.quantity);
    }

    // Clear selection
    setSelectedItem(null);
    setSelectedFromBillId(null);
  };

  const handleUnassignedAreaClick = (): void => {
    if (!selectedItem || !selectedFromBillId) return;

    // Check if item has quantity > 1
    if (selectedItem.quantity > 1) {
      setPendingMove({
        item: selectedItem,
        fromBillId: selectedFromBillId,
        toBillId: null, // null means unassigned
      });
      setMoveQuantity(1);
      setShowQuantityDialog(true);
      return;
    }

    // Move the entire item
    moveItemToDestination(selectedItem, selectedFromBillId, null, selectedItem.quantity);

    // Clear selection
    setSelectedItem(null);
    setSelectedFromBillId(null);
  };

  const moveItemToDestination = (item: OrderItem, fromBillId: string | null, toBillId: string | null, quantity: number): void => {
    const isMovingAll = quantity === item.quantity;

    // Remove from source
    if (fromBillId) {
      // Remove from a bill and auto-delete if empty
      setBills(prevBills => {
        const updated = prevBills.map(bill => {
          if (bill.id === fromBillId) {
            if (isMovingAll) {
              // Remove entire item
              return { ...bill, items: bill.items.filter(i => i.id !== item.id) };
            } else {
              // Reduce quantity
              return {
                ...bill,
                items: bill.items.map(i =>
                  i.id === item.id ? { ...i, quantity: i.quantity - quantity } : i
                ),
              };
            }
          }
          return bill;
        });
        
        // Filter out empty bills and renumber
        const filtered = updated.filter(bill => bill.items.length > 0);
        return filtered.map((bill, index) => ({
          ...bill,
          id: String(index + 1),
        }));
      });
    } else {
      // Remove from unassigned
      setUnassignedItems(prev => {
        if (isMovingAll) {
          return prev.filter(i => i.id !== item.id);
        } else {
          return prev.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity - quantity } : i
          );
        }
      });
    }

    // Create the item to add with the specified quantity
    const itemToAdd = { ...item, quantity };

    // Add to destination
    if (toBillId === 'new') {
      // Create a new bill with this item
      const newBillNumber = bills.length + 1;
      const newBill: SplitBill = {
        id: String(newBillNumber),
        items: [itemToAdd],
        status: BillStatus.Active,
      };
      setBills(prev => [...prev, newBill]);
    } else if (toBillId) {
      // Add to a bill
      setBills(prevBills =>
        prevBills.map(bill => {
          if (bill.id === toBillId) {
            // Check if item already exists in this bill
            const existingItem = bill.items.find(i => i.id === item.id);
            if (existingItem) {
              // Merge quantities
              return {
                ...bill,
                items: bill.items.map(i =>
                  i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
                ),
              };
            } else {
              // Add new item
              return { ...bill, items: [...bill.items, itemToAdd] };
            }
          }
          return bill;
        })
      );
    } else {
      // Add to unassigned
      setUnassignedItems(prev => {
        const existingItem = prev.find(i => i.id === item.id);
        if (existingItem) {
          // Merge quantities
          return prev.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          // Add new item
          return [...prev, itemToAdd];
        }
      });
    }
  };

  const handleQuantityConfirm = (): void => {
    if (!pendingMove || moveQuantity < 1) return;

    moveItemToDestination(
      pendingMove.item,
      pendingMove.fromBillId,
      pendingMove.toBillId,
      moveQuantity
    );

    // Clear selection and dialog
    setSelectedItem(null);
    setSelectedFromBillId(null);
    setShowQuantityDialog(false);
    setPendingMove(null);
  };

  const handleQuantityCancel = (): void => {
    setShowQuantityDialog(false);
    setPendingMove(null);
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
    // Filter out empty bills and renumber the remaining ones
    const nonEmptyBills = bills
      .filter(bill => bill.items.length > 0)
      .map((bill, index) => ({
        ...bill,
        id: String(index + 1),
      }));

    // Check if all items are unassigned (no bills with items)
    if (nonEmptyBills.length === 0) {
      // Clear the split bill configuration - revert to normal "All products" view
      saveBillSplit(null);
    } else {
      // Save the bill split configuration to global state with only non-empty bills
      saveBillSplit({
        bills: nonEmptyBills,
        unsplitItems: unassignedItems,
      });
    }
    
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
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.md,
              minHeight: 200,
              p: theme.spacing.sm,
              borderRadius: theme.borderRadius.medium,
              backgroundColor: unassignedItems.length === 0 ? 'grey.50' : 'transparent',
              border: selectedItem && selectedFromBillId ? `2px dashed ${theme.colors.primary}` : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Overlay for clicking when item is selected */}
            {selectedItem && selectedFromBillId && (
              <Box
                onClick={handleUnassignedAreaClick}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  borderRadius: theme.borderRadius.medium,
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.15)',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={theme.typography.fontWeights.semibold}
                  sx={{
                    color: theme.colors.primary,
                    backgroundColor: 'white',
                    px: theme.spacing.lg,
                    py: theme.spacing.md,
                    borderRadius: theme.borderRadius.medium,
                    boxShadow: 1,
                  }}
                >
                  {t('splitBillDialog.clickToMoveHere')}
                </Typography>
              </Box>
            )}
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

                const isSelected = selectedItem?.id === item.id && selectedFromBillId === null;

                return (
                  <Card
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: theme.borderRadius.medium,
                      border: isSelected ? `2px solid ${theme.colors.primary}` : '1px solid transparent',
                      backgroundColor: isSelected ? theme.colors.primaryLight : 'white',
                      transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      pointerEvents: (selectedItem && !isSelected) ? 'none' : 'auto',
                      opacity: (selectedItem && !isSelected) ? 0.5 : 1,
                      '&:active': {
                        cursor: 'grabbing',
                      },
                      '&:hover': {
                        boxShadow: 2,
                        transform: isSelected ? 'scale(0.98)' : 'scale(1.02)',
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
                        {item.excludables && item.excludables.length > 0 && (
                          <Typography
                            variant="caption"
                            sx={{ display: 'block', mt: 0.5, color: '#dc2626' }}
                          >
                            {item.excludables.map(e => `− ${e}`).join(', ')}
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
          <Typography
            variant="body1"
            fontWeight={theme.typography.fontWeights.semibold}
            sx={{ mb: theme.spacing.md }}
          >
            {t('splitBillDialog.bills')}
          </Typography>

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.lg,
          }}>
            {bills.map((bill) => {
              const total = calculateBillTotal(bill.items);
              const isRequested = bill.status === BillStatus.Requested;

              return (
                <Box
                  key={bill.id}
                  onDragOver={!isRequested ? handleDragOver : undefined}
                  onDrop={!isRequested ? () => handleDropToBill(bill.id) : undefined}
                  sx={{
                    position: 'relative',
                    border: `2px dashed ${isRequested ? theme.colors.border : (selectedItem ? theme.colors.primary : theme.colors.border)}`,
                    borderRadius: theme.borderRadius.medium,
                    p: theme.spacing.md,
                    backgroundColor: isRequested ? 'grey.200' : (selectedItem ? theme.colors.primaryLight : 'grey.50'),
                    minHeight: 120,
                    transition: 'all 0.2s ease',
                    opacity: isRequested ? 0.6 : 1,
                  }}
                >
                  {/* Overlay for clicking when item is selected */}
                  {selectedItem && !isRequested && selectedFromBillId !== bill.id && (
                    <Box
                      onClick={() => handleBillAreaClick(bill.id)}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderRadius: theme.borderRadius.medium,
                        cursor: 'pointer',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          backgroundColor: 'rgba(33, 150, 243, 0.15)',
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={theme.typography.fontWeights.semibold}
                        sx={{
                          color: theme.colors.primary,
                          backgroundColor: 'white',
                          px: theme.spacing.lg,
                          py: theme.spacing.md,
                          borderRadius: theme.borderRadius.medium,
                          boxShadow: 1,
                        }}
                      >
                        {t('splitBillDialog.clickToMoveHere')}
                      </Typography>
                    </Box>
                  )}
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
                        color={isRequested ? "text.secondary" : "primary"}
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
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.sm,
                    }}>
                      <Typography
                        variant="body1"
                        fontWeight={theme.typography.fontWeights.bold}
                        color={isRequested ? "text.secondary" : "primary"}
                      >
                        €{total.toFixed(2)}
                      </Typography>
                    </Box>
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
                        {isRequested ? t('splitBillDialog.billRequested') : t('splitBillDialog.dragItemsHere')}
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

                        const isSelected = selectedItem?.id === item.id && selectedFromBillId === bill.id;

                        return (
                          <Card
                            key={item.id}
                            draggable={!isRequested}
                            onDragStart={!isRequested ? () => handleDragStart(item, bill.id) : undefined}
                            onClick={!isRequested ? (e) => {
                              e.stopPropagation();
                              handleItemClick(item, bill.id);
                            } : undefined}
                            sx={{
                              cursor: isRequested ? 'default' : 'pointer',
                              borderRadius: theme.borderRadius.small,
                              backgroundColor: isRequested ? 'grey.100' : (isSelected ? theme.colors.primaryLight : 'white'),
                              border: isSelected ? `2px solid ${theme.colors.primary}` : '1px solid transparent',
                              transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                              transition: 'all 0.2s ease',
                              pointerEvents: (selectedItem && !isSelected) ? 'none' : 'auto',
                              opacity: (selectedItem && !isSelected) ? 0.5 : 1,
                              '&:active': {
                                cursor: 'grabbing',
                              },
                              '&:hover': {
                                transform: isSelected ? 'scale(0.98)' : 'scale(1.02)',
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
                                {item.toppings && item.toppings.length > 0 && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', fontSize: '0.65rem', mt: 0.25 }}
                                  >
                                    {item.toppings.map(t => `+ ${t.name}`).join(', ')}
                                  </Typography>
                                )}
                                {item.excludables && item.excludables.length > 0 && (
                                  <Typography
                                    variant="caption"
                                    sx={{ display: 'block', fontSize: '0.65rem', mt: 0.25, color: '#dc2626' }}
                                  >
                                    {item.excludables.map(e => `− ${e}`).join(', ')}
                                  </Typography>
                                )}
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

            {/* Instruction Box for New Bill - Show only when there are unassigned items or a bill item is selected */}
            {(unassignedItems.length > 0 || (selectedItem && selectedFromBillId)) && (
              <Box
                onDragOver={handleDragOver}
                onDrop={() => handleDropToBill('new')}
                sx={{
                  position: 'relative',
                  border: `2px dashed ${selectedItem ? theme.colors.primary : theme.colors.border}`,
                  borderRadius: theme.borderRadius.medium,
                  p: theme.spacing.md,
                  backgroundColor: selectedItem ? 'rgba(33, 150, 243, 0.05)' : 'grey.100',
                  minHeight: 120,
                  transition: 'all 0.2s ease',
                  opacity: 0.7,
                }}
              >
                {/* Overlay for clicking when item is selected */}
                {selectedItem && (
                  <Box
                    onClick={() => handleBillAreaClick('new')}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      borderRadius: theme.borderRadius.medium,
                      cursor: 'pointer',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.15)',
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={theme.typography.fontWeights.semibold}
                      sx={{
                        color: theme.colors.primary,
                        backgroundColor: 'white',
                        px: theme.spacing.lg,
                        py: theme.spacing.md,
                        borderRadius: theme.borderRadius.medium,
                        boxShadow: 1,
                      }}
                    >
                      {t('splitBillDialog.clickToMoveHere')}
                    </Typography>
                  </Box>
                )}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  minHeight: 80,
                }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textAlign: 'center',
                      fontStyle: 'italic',
                    }}
                  >
                    {t('splitBillDialog.placeProductsHere')}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Quantity Selection Dialog */}
      <Dialog
        open={showQuantityDialog}
        onClose={handleQuantityCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: theme.borderRadius.xlarge,
          }
        }}
      >
        <Box sx={{ p: theme.spacing.lg }}>
          <Typography
            variant="h6"
            fontWeight={theme.typography.fontWeights.bold}
            sx={{ mb: theme.spacing.md }}
          >
            {t('splitBillDialog.howManyItems')}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: theme.spacing.lg }}
          >
            {t('splitBillDialog.selectQuantity', { max: pendingMove?.item.quantity || 1 })}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
              mb: theme.spacing.lg,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setMoveQuantity(Math.max(1, moveQuantity - 1))}
              disabled={moveQuantity <= 1}
              sx={{
                minWidth: 48,
                height: 48,
                borderRadius: theme.borderRadius.medium,
                fontSize: theme.typography.fontSizes.xlarge,
                fontWeight: theme.typography.fontWeights.bold,
              }}
            >
              −
            </Button>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 56,
                border: `2px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.medium,
                fontSize: theme.typography.fontSizes.xlarge,
                fontWeight: theme.typography.fontWeights.bold,
              }}
            >
              {moveQuantity}
            </Box>
            <Button
              variant="outlined"
              onClick={() => setMoveQuantity(Math.min(pendingMove?.item.quantity || 1, moveQuantity + 1))}
              disabled={moveQuantity >= (pendingMove?.item.quantity || 1)}
              sx={{
                minWidth: 48,
                height: 48,
                borderRadius: theme.borderRadius.medium,
                fontSize: theme.typography.fontSizes.xlarge,
                fontWeight: theme.typography.fontWeights.bold,
              }}
            >
              +
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: theme.spacing.md,
              justifyContent: 'flex-end',
            }}
          >
            <Button
              onClick={handleQuantityCancel}
              variant="outlined"
              sx={{
                borderRadius: theme.borderRadius.large,
                textTransform: 'none',
                fontSize: theme.typography.fontSizes.medium,
                py: theme.spacing.md,
                px: theme.spacing.lg,
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleQuantityConfirm}
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
              {t('common.confirm')}
            </Button>
          </Box>
        </Box>
      </Dialog>

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