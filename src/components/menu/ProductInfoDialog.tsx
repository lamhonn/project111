import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { addOrderItemAtom, Topping as OrderTopping } from '../../context/orderStore';
import { useGetProductToppings } from '../../api/hooks/topping.hooks';

// Temporary interfaces
interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  description?: string;
}

interface ProductDialogProps {
  productId: string;
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ productId, product, isOpen, onClose }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedToppings, setSelectedToppings] = useState<Record<string, number>>({});
  const addItem = useSetAtom(addOrderItemAtom);
  
  // Fetch toppings from API
  const { data: toppingsData } = useGetProductToppings(productId);
  const toppings = toppingsData?.toppings || [];

  const handleAddToOrder = (): void => {
    // Convert selected toppings to array format
    const toppingsArray: OrderTopping[] = [];
    toppings.forEach(topping => {
      const toppingQuantity = selectedToppings[topping.Id] || 0;
      if (toppingQuantity > 0) {
        toppingsArray.push({
          id: topping.Id,
          name: topping.Name,
          price: topping.PriceIncrement,
          quantity: toppingQuantity,
        });
      }
    });

    // Add item to order
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: quantity,
      toppings: toppingsArray.length > 0 ? toppingsArray : undefined,
    });

    // Reset and close
    setQuantity(1);
    setSelectedToppings({});
    onClose();
  };

  const handleToppingToggle = (toppingId: string): void => {
    setSelectedToppings(prev => {
      const current = prev[toppingId] || 0;
      if (current === 0) {
        return { ...prev, [toppingId]: 1 };
      }
      return { ...prev, [toppingId]: 0 };
    });
  };

  const handleToppingIncrement = (toppingId: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    setSelectedToppings(prev => ({
      ...prev,
      [toppingId]: (prev[toppingId] || 0) + 1
    }));
  };

  const handleToppingDecrement = (toppingId: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    setSelectedToppings(prev => {
      const current = prev[toppingId] || 0;
      if (current > 0) {
        return { ...prev, [toppingId]: current - 1 };
      }
      return prev;
    });
  };

  const calculateTotal = (): number => {
    let total = product.price * quantity;
    toppings.forEach(topping => {
      const count = selectedToppings[topping.Id] || 0;
      total += topping.PriceIncrement * count;
    });
    return total;
  };


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
      {/* Header Image */}
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={product.image}
          alt={product.name}
          sx={{
            width: '100%',
            height: 192,
            objectFit: 'cover',
          }}
        />
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: "24px",
            right: "24px",
            backgroundColor: theme.colors.brandWhite,
            boxShadow: theme.shadows.md,
            '&:hover': {
              backgroundColor: 'grey.100',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Scrollable Content */}
      <DialogContent sx={{ pb: 0 }}>
        <Typography variant="h5" fontWeight={theme.typography.fontWeights.bold} gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="h6" color={theme.colors.text} sx={{ mb: theme.spacing.lg }}>
          €{product.price.toFixed(2)}
        </Typography>

        {product.description && (
          <Typography color={theme.colors.text} sx={{ mb: theme.spacing.lg }}>
            {product.description}
          </Typography>
        )}

        {/* Toppings */}
        {toppings && toppings.length > 0 && (
          <Box sx={{ mb: theme.spacing.lg }}>
            <Typography 
              variant="caption"
              fontWeight={theme.typography.fontWeights.bold}
              color={theme.colors.text}
              sx={{ mb: 1.5, display: 'block' }}
            >
              {t('productDialog.toppings')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {toppings.map((topping) => {
                const count = selectedToppings[topping.Id] || 0;
                const isSelected = count > 0;

                return (
                  <Card
                    key={topping.Id}
                    variant="outlined"
                    onClick={() => handleToppingToggle(topping.Id)}
                    sx={{
                      borderRadius: theme.borderRadius.medium,
                      borderColor: isSelected ? theme.colors.primary : 'grey.300',
                      backgroundColor: isSelected ? theme.colors.primaryLight : 'transparent',
                      cursor: 'pointer',
                      transition: theme.transitions.normal,
                      '&:hover': {
                        backgroundColor: isSelected ? theme.colors.primaryLight : 'grey.50',
                      },
                    }}
                  >
                    <CardContent 
                      sx={{ 
                        p: 1.5,
                        '&:last-child': { pb: 1.5 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography component="span" fontWeight="medium">
                          {topping.Name}
                        </Typography>
                        {topping.PriceIncrement > 0 && (
                          <Typography component="span" color={theme.colors.text} sx={{ ml: 1 }}>
                            +€{topping.PriceIncrement.toFixed(2)}
                          </Typography>
                        )}
                        {count > 0 && (
                          <Typography component="span" color={theme.colors.text} sx={{ ml: 1 }}>
                            ×{count}
                          </Typography>
                        )}
                      </Box>
                      
                      {isSelected && (
                        <Box 
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }} 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => handleToppingDecrement(topping.Id, e)}
                            sx={{
                              color: 'error.main',
                              '&:hover': {
                                backgroundColor: 'error.light',
                              },
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => handleToppingIncrement(topping.Id, e)}
                            sx={{
                              color: theme.colors.text,
                              '&:hover': {
                                backgroundColor: 'success.light',
                              },
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>
        )}
    </DialogContent>

      {/* Footer with Quantity and Add Button */}
      <Box 
        sx={{ 
          backgroundColor: theme.colors.primary,
          p: theme.spacing.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.md,
        }}
      >
        <Box 
          sx={{ 
            backgroundColor: theme.colors.brandWhite,
            borderRadius: '50px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            sx={{
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
          >
            <RemoveIcon />
          </IconButton>
          <Typography sx={{ 
            px: theme.spacing.md, 
            fontWeight: theme.typography.fontWeights.bold, 
            fontSize: '1.125rem' 
          }}>
            {quantity}
          </Typography>
          <IconButton
            onClick={() => setQuantity(quantity + 1)}
            sx={{
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        <Button
          variant="contained"
          onClick={handleAddToOrder}
          sx={{
            flex: 1,
            backgroundColor: theme.colors.brandWhite,
            color: theme.colors.text,
            fontWeight: theme.typography.fontWeights.bold,
            py: 1.5,
            px: theme.spacing.lg,
            borderRadius: '50px',
            fontSize: '1.125rem',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'grey.100',
            },
          }}
        >
          {t('productDialog.addToOrder')} €{calculateTotal().toFixed(2)}
        </Button>
      </Box>
    </Dialog>
  );
};

export default ProductDialog;