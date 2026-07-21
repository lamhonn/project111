import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { SplitBill, OrderItem, BillStatus } from '../../state/orderStore';

interface BillRequestOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bills: SplitBill[];
  primaryBillItems: OrderItem[];
  onRequestAll: () => void;
  onRequestSelected: (selectedBillIds: string[], includePrimary: boolean) => void;
}

const BillRequestOptionsDialog: React.FC<BillRequestOptionsDialogProps> = ({
  isOpen,
  onClose,
  bills,
  primaryBillItems,
  onRequestAll,
  onRequestSelected,
}) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'options' | 'select'>('options');
  const [selectedBillIds, setSelectedBillIds] = useState<Set<string>>(new Set());
  const [includePrimary, setIncludePrimary] = useState(false);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setViewMode('options');
      setSelectedBillIds(new Set());
      setIncludePrimary(false);
    }
  }, [isOpen]);

  const handleRequestAll = () => {
    onRequestAll();
    onClose();
  };

  const handleSelectBills = () => {
    setViewMode('select');
  };

  const handleToggleBill = (billId: string) => {
    setSelectedBillIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(billId)) {
        newSet.delete(billId);
      } else {
        newSet.add(billId);
      }
      return newSet;
    });
  };

  const handleTogglePrimary = () => {
    setIncludePrimary(prev => !prev);
  };

  const handleConfirmSelection = () => {
    if (selectedBillIds.size === 0 && !includePrimary) {
      return; // Don't allow requesting nothing
    }
    onRequestSelected(Array.from(selectedBillIds), includePrimary);
    onClose();
  };

  const handleBack = () => {
    setViewMode('options');
    setSelectedBillIds(new Set());
    setIncludePrimary(false);
  };

  // Calculate total for items
  const calculateItemsTotal = (items: OrderItem[]): number => {
    return items.reduce((sum, item) => {
      const itemBasePrice = item.price * item.quantity;
      const toppingsPrice = item.toppings
        ? item.toppings.reduce((toppingSum, topping) => toppingSum + (topping.price * topping.quantity), 0)
        : 0;
      return sum + itemBasePrice + toppingsPrice;
    }, 0);
  };

  const hasPrimaryBill = primaryBillItems.length > 0;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.xlarge,
          maxHeight: '80vh',
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
          color="text.primary"
        >
          {viewMode === 'options' 
            ? t('billRequestDialog.title') 
            : t('billRequestDialog.selectBillsTitle')}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: theme.spacing.lg }}>
        {viewMode === 'options' ? (
          // Options View
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('billRequestDialog.description')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Request All Bills */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleRequestAll}
                sx={{
                  backgroundColor: theme.colors.primary,
                  color: 'white',
                  fontWeight: theme.typography.fontWeights.semibold,
                  textTransform: 'none',
                  py: 2,
                  borderRadius: theme.borderRadius.large,
                  '&:hover': {
                    backgroundColor: theme.colors.primaryHover,
                  },
                }}
                startIcon={<CheckCircleIcon />}
              >
                {t('billRequestDialog.requestAllBills')}
              </Button>

              {/* Select Specific Bills */}
              <Button
                variant="outlined"
                fullWidth
                onClick={handleSelectBills}
                sx={{
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  fontWeight: theme.typography.fontWeights.semibold,
                  textTransform: 'none',
                  py: 2,
                  borderRadius: theme.borderRadius.large,
                  '&:hover': {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.primaryLight,
                  },
                }}
                startIcon={<ReceiptIcon />}
              >
                {t('billRequestDialog.selectSpecificBills')}
              </Button>
            </Box>
          </Box>
        ) : (
          // Bill Selection View
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('billRequestDialog.selectDescription')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Primary Bill (unsplit items) */}
              {hasPrimaryBill && (
                <Box
                  sx={{
                    border: `2px solid ${includePrimary ? theme.colors.primary : theme.colors.border}`,
                    borderRadius: theme.borderRadius.large,
                    p: 2,
                    cursor: 'pointer',
                    transition: theme.transitions.fast,
                    backgroundColor: includePrimary ? theme.colors.primaryLight : 'transparent',
                    '&:hover': {
                      borderColor: theme.colors.primary,
                      backgroundColor: theme.colors.primaryLight,
                    },
                  }}
                  onClick={handleTogglePrimary}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Checkbox
                        checked={includePrimary}
                        onChange={handleTogglePrimary}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Box>
                        <Typography fontWeight={theme.typography.fontWeights.semibold}>
                          {t('billRequestDialog.primaryBill')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {primaryBillItems.length} {primaryBillItems.length === 1 ? t('splitBillDialog.item') : t('splitBillDialog.items')}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography fontWeight={theme.typography.fontWeights.bold} color="text.primary">
                      €{calculateItemsTotal(primaryBillItems).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Split Bills - Show all, but disable requested ones */}
              {bills.map((bill, index) => {
                const isSelected = selectedBillIds.has(bill.id);
                const isRequested = bill.status === BillStatus.Requested;
                const billTotal = calculateItemsTotal(bill.items);
                
                return (
                  <Box
                    key={bill.id}
                    sx={{
                      border: `2px solid ${isRequested ? theme.colors.border : (isSelected ? theme.colors.primary : theme.colors.border)}`,
                      borderRadius: theme.borderRadius.large,
                      p: 2,
                      cursor: isRequested ? 'not-allowed' : 'pointer',
                      transition: theme.transitions.fast,
                      backgroundColor: isRequested ? 'grey.100' : (isSelected ? theme.colors.primaryLight : 'transparent'),
                      opacity: isRequested ? 0.6 : 1,
                      '&:hover': {
                        borderColor: isRequested ? theme.colors.border : theme.colors.primary,
                        backgroundColor: isRequested ? 'grey.100' : theme.colors.primaryLight,
                      },
                    }}
                    onClick={!isRequested ? () => handleToggleBill(bill.id) : undefined}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleToggleBill(bill.id)}
                          onClick={(e) => e.stopPropagation()}
                          disabled={isRequested}
                        />
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography fontWeight={theme.typography.fontWeights.semibold} color={isRequested ? 'text.secondary' : 'text.primary'}>
                              {t('splitBillDialog.bill')} {index + 1}
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
                          <Typography variant="body2" color="text.secondary">
                            {bill.items.length} {bill.items.length === 1 ? t('splitBillDialog.item') : t('splitBillDialog.items')}
                          </Typography>
                          {/* Show first 3 products */}
                          <Box sx={{ mt: 0.5 }}>
                            {bill.items.slice(0, 3).map((item, idx) => (
                              <Typography 
                                key={idx}
                                variant="caption" 
                                color="text.secondary"
                                sx={{ display: 'block', fontSize: '0.7rem' }}
                              >
                                • {item.quantity > 1 && `${item.quantity}× `}{item.name}
                              </Typography>
                            ))}
                            {bill.items.length > 3 && (
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ fontStyle: 'italic', fontSize: '0.7rem' }}
                              >
                                +{bill.items.length - 3} more
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Typography fontWeight={theme.typography.fontWeights.bold} color={isRequested ? 'text.secondary' : 'text.primary'}>
                        €{billTotal.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleBack}
                sx={{
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  textTransform: 'none',
                  py: 1.5,
                  borderRadius: theme.borderRadius.large,
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleConfirmSelection}
                disabled={selectedBillIds.size === 0 && !includePrimary}
                sx={{
                  backgroundColor: theme.colors.primary,
                  color: 'white',
                  fontWeight: theme.typography.fontWeights.semibold,
                  textTransform: 'none',
                  py: 1.5,
                  borderRadius: theme.borderRadius.large,
                  '&:hover': {
                    backgroundColor: theme.colors.primaryHover,
                  },
                  '&:disabled': {
                    backgroundColor: theme.colors.border,
                    color: 'rgba(0, 0, 0, 0.26)',
                  },
                }}
              >
                {t('billRequestDialog.requestSelected')} ({selectedBillIds.size + (includePrimary ? 1 : 0)})
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BillRequestOptionsDialog;
