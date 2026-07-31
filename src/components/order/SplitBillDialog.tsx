import React, { useEffect, useState } from 'react';
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
import { billsAtom, saveBillsAtom, sessionOrdersAtom } from '../../state/sessionStore';
import { OrderProductViewModel } from '../../types/viewModels/orderProductViewModel';
import { BillViewModel } from '../../types/viewModels/billViewModel';
import { calculateTotalOrderProductsPrice } from '../../utils/orderUtils';
import { getTranslation } from '../../utils/multilingualNameUtils';

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

interface SplitBillDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SplitBillDialog: React.FC<SplitBillDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  
  const orders = useAtomValue(sessionOrdersAtom);
  const orderProducts = orders.flatMap(order =>  order.OrderProducts); // Consider moving this logic into state instead of running it on every render
  const bills = useAtomValue(billsAtom);
  
  const [splitBills, setSplitBills] = useState(bills); // Atoms behave as immutable. Use this for temporary UI bill splitting functionality instead of "billsAtom"
  const [defaultBill, setDefaultBill] = useState(bills.find(bill => bill.Id === EMPTY_GUID));
  const saveBills = useSetAtom(saveBillsAtom);

  const getOrderProductsForBill = (orderProductIds: string[]): OrderProductViewModel[] => {
    return orderProducts.filter(orderProduct => orderProductIds.includes(orderProduct.Id));
  }

  // A workaround for updating defaultBill here instead of always having to separately do the .find query further
  useEffect(() => {
    setDefaultBill(splitBills.find(bill => bill.Id === EMPTY_GUID));
  }, [splitBills]);

  // Initialize unassigned items when dialog opens
  // useEffect(() => {
  //   if (isOpen) {
  //     // If there's an existing split configuration, restore it
  //     if (existingBillSplit) {
  //       // Get all item IDs from the existing split (both in bills and unsplit)
  //       const existingItemIds = new Set<string>();
  //       existingBillSplit.bills.forEach(bill => {
  //         bill.items.forEach(item => existingItemIds.add(item.id));
  //       });
  //       existingBillSplit.unsplitItems.forEach(item => existingItemIds.add(item.id));

  //       // Find new items that weren't in the previous split
  //       const newItems = allAvailableItems.filter(item => !existingItemIds.has(item.id));

  //       // Restore bills and add new items to unassigned
  //       setBills(existingBillSplit.bills);
  //       setUnassignedItems([...existingBillSplit.unsplitItems, ...newItems]);
  //     } else {
  //       // Otherwise, initialize with all items unassigned and no bills
  //       setUnassignedItems([...allAvailableItems]);
  //       setBills([]);
  //     }
  //   }
  // }, [isOpen, existingBillSplit]);

  // Drag and drop handlers
  const [draggedItem, setDraggedItem] = useState<string | null>(null); // product's ID
  const [draggedFromBillId, setDraggedFromBillId] = useState<string | null>(null); // bill's ID where we are moving from

  // Click-based selection (fallback for drag-and-drop)
  const [selectedItem, setSelectedItem] = useState<string | null>(null); // product's ID
  const [selectedFromBillId, setSelectedFromBillId] = useState<string | null>(null); // bill's ID where we are moving from

  // TODO: quantity functionality. requires refining the logic for handling duplicates in "orderProducts" array
  // // Quantity selection dialog
  // const [showQuantityDialog, setShowQuantityDialog] = useState<boolean>(false);
  // const [pendingMove, setPendingMove] = useState<{
  //   item: string; // ID
  //   fromBillId: string | null;
  //   toBillId: string | null; // null means moving to unassigned
  // } | null>(null);
  // const [moveQuantity, setMoveQuantity] = useState<number>(1);

  const handleDragStart = (item: string, fromBillId?: string): void => {
    setDraggedItem(item);
    setDraggedFromBillId(fromBillId || null);
  };

  const handleItemClick = (item: string, fromBillId?: string): void => {
    // Toggle selection
    if (selectedItem === item) {
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

  const handleDropToBill = (toBillId: string): void => {
    if (!draggedItem || !selectedItem) return;

    moveProductToBill(selectedItem, draggedFromBillId, toBillId);

    setDraggedItem(null);
    setDraggedFromBillId(null);
  };

  const handleBillAreaClick = (toBillId: string): void => {
    if (!selectedItem) return;

    // Don't move if trying to move to the same bill it's already in
    if (selectedFromBillId === toBillId) {
      // Just deselect the item
      setSelectedItem(null);
      setSelectedFromBillId(null);
      return;
    }

    moveProductToBill(selectedItem, selectedFromBillId, toBillId);

    // Clear selection
    setSelectedItem(null);
    setSelectedFromBillId(null);
  };

  const handleUnassignedAreaClick = (): void => {
    if (!selectedItem || !selectedFromBillId) return;

    moveProductToBill(selectedItem, selectedFromBillId, EMPTY_GUID);

    // Clear selection
    setSelectedItem(null);
    setSelectedFromBillId(null);
  };

  const moveProductToBill = (product: string, fromBillId: string | null, toBillId: string | null): void => {
    if (fromBillId && toBillId) {
      if (toBillId === 'new') {
        const newBill: BillViewModel = {
          Id: crypto.randomUUID(),
          OrderProducts: [product],
          Billed: false,
          Name: `${ t('splitBillDialog.bill') } ${ bills.length }`
        };

        setSplitBills(prev => [...prev, newBill]);
      }
      else {
        // Remove from a bill and auto-delete if empty
        setSplitBills(prevBills => {
          const updated: BillViewModel[] = prevBills.map(bill => {
            if (bill.Id === toBillId) {
              return { ...bill, OrderProducts: bill.OrderProducts.filter((op: string) => op !== product)};
            }
  
            if (bill.Id === fromBillId) {
              return { ...bill, OrderProducts: [ ...bill.OrderProducts, product ]};
            }
  
            return bill;
          });
          
          // Filter out empty 
          const filtered = updated.filter(bill => bill.OrderProducts.length > 0 && bill.Id !== EMPTY_GUID);
          return filtered;
        });
      }
    } 
  };

  // TODO: add quantity selection later. Requires handling of duplicate items on bills array
  // const handleQuantityConfirm = (): void => {
  //   if (!pendingMove || moveQuantity < 1) return;

  //   moveProductToBill(
  //     pendingMove.item,
  //     pendingMove.fromBillId,
  //     pendingMove.toBillId,
  //   );

  //   // Clear selection and dialog
  //   setSelectedItem(null);
  //   setSelectedFromBillId(null);
  //   setShowQuantityDialog(false);
  //   setPendingMove(null);
  // };

  // const handleQuantityCancel = (): void => {
  //   setShowQuantityDialog(false);
  //   setPendingMove(null);
  // };

  const handleSave = (): void => {
    saveBills(splitBills);    
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
            {t('splitBillDialog.allItems')} ({defaultBill?.OrderProducts.length})
          </Typography>

          <Box
            onDragOver={handleDragOver}
            onDrop={() => handleDropToBill(EMPTY_GUID)}
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.md,
              minHeight: 200,
              p: theme.spacing.sm,
              borderRadius: theme.borderRadius.medium,
              backgroundColor: defaultBill?.OrderProducts.length === 0 ? 'grey.50' : 'transparent',
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
            {defaultBill?.OrderProducts.length === 0 ? (
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
              bills.find(bill => bill.Id === EMPTY_GUID)?.OrderProducts.map((product) => {
                const orderProduct = orderProducts.find(op => op.Id === product);
                if (!orderProduct) return;

                const isSelected = selectedItem === product && selectedFromBillId === null;
                
                return (
                  <Card
                    key={product}
                    draggable
                    onDragStart={() => handleDragStart(product)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(product);
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
                        src={orderProduct.ImgUrl}
                        alt={getTranslation(orderProduct.Name, i18n.language)}
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
                          {getTranslation(orderProduct?.Name, i18n.language)}
                        </Typography>
                        {/* TODO: should we label "3 toppings" vs "tomato, lettuce, bacon" ? */}
                        {orderProduct.ProductToppings.length > 0 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            {orderProduct.ProductToppings.map(topping => `+ ${getTranslation(topping.Name, i18n.language)}`).join(', ')}
                          </Typography>
                        )}
                        {orderProduct.ProductExcludables.length > 0 && (
                          <Typography
                            variant="caption"
                            sx={{ display: 'block', mt: 0.5, color: '#dc2626' }}
                          >
                            {orderProduct.ProductExcludables.map(excludable => `− ${getTranslation(excludable.Name, i18n.language)}`).join(', ')}
                          </Typography>
                        )}
                      </Box>
                      <Typography 
                        variant="body2"
                        fontWeight={theme.typography.fontWeights.medium}
                      >
                        {orderProduct.Price}€
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
              const billOrderProducts = getOrderProductsForBill(bill.OrderProducts);
              const total = calculateTotalOrderProductsPrice(billOrderProducts);
              const isRequested = bill.Billed;

              return (
                <Box
                  key={bill.Id}
                  onDragOver={!isRequested ? handleDragOver : undefined}
                  onDrop={!isRequested ? () => handleDropToBill(bill.Id) : undefined}
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
                  {selectedItem && !isRequested && selectedFromBillId !== bill.Id && (
                    <Box
                      onClick={() => handleBillAreaClick(bill.Id)}
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
                        {bill.Name}
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
                        {total}€
                      </Typography>
                    </Box>
                  </Box>

                  {bill.OrderProducts.length === 0 ? (
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
                      {bill.OrderProducts.map((product) => {
                        const orderProduct = orderProducts.find(op => op.Id === product);
                        const isSelected = selectedItem === product && selectedFromBillId === bill.Id;

                        if (!orderProduct) return;

                        return (
                          <Card
                            key={orderProduct.Id}
                            draggable={!isRequested}
                            onDragStart={!isRequested ? () => handleDragStart(product, bill.Id) : undefined}
                            onClick={!isRequested ? (e) => {
                              e.stopPropagation();
                              handleItemClick(product, bill.Id);
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
                                src={orderProduct.ImgUrl}
                                alt={getTranslation(orderProduct.Name, i18n.language)}
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
                                  {getTranslation(orderProduct.Name, i18n.language)}
                                </Typography>
                                {orderProduct.ProductToppings.length > 0 && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', fontSize: '0.65rem', mt: 0.25 }}
                                  >
                                    {orderProduct.ProductToppings.map(topping => `+ ${getTranslation(topping.Name, i18n.language)}`).join(', ')}
                                  </Typography>
                                )}
                                {orderProduct.ProductExcludables.length > 0 && (
                                  <Typography
                                    variant="caption"
                                    sx={{ display: 'block', fontSize: '0.65rem', mt: 0.25, color: '#dc2626' }}
                                  >
                                    {orderProduct.ProductExcludables.map(excludable => `− ${getTranslation(excludable.Name, i18n.language)}`).join(', ')}
                                  </Typography>
                                )}
                              </Box>
                              <Typography 
                                variant="caption"
                                fontWeight={theme.typography.fontWeights.medium}
                              >
                                {orderProduct.Price}€
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

            {/* Instruction Box for New Bill - Show only when a bill item is selected */}
            {(selectedItem && selectedFromBillId) && (
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

      {/* TODO: add quantity selection later */}
      {/* Quantity Selection Dialog */}
      {/* <Dialog
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
      </Dialog> */}

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