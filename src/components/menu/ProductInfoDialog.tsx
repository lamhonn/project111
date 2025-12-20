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
import { productDialogTheme } from '../../theme/componentThemes';
import { addOrderItemAtom, Topping as OrderTopping } from '../../context/orderStore';

// Temporary interfaces
interface Topping {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  description?: string;
  toppings?: Topping[];
}

interface ProductDialogProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedToppings, setSelectedToppings] = useState<Record<string, number>>({});
  const theme = productDialogTheme;
  const addItem = useSetAtom(addOrderItemAtom);

  const handleAddToOrder = (): void => {
    // Convert selected toppings to array format
    const toppingsArray: OrderTopping[] = [];
    if (product.toppings) {
      product.toppings.forEach(topping => {
        const toppingQuantity = selectedToppings[topping.id] || 0;
        if (toppingQuantity > 0) {
          toppingsArray.push({
            id: topping.id,
            name: topping.name,
            price: topping.price,
            quantity: toppingQuantity,
          });
        }
      });
    }

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
    if (product.toppings) {
      product.toppings.forEach(topping => {
        const count = selectedToppings[topping.id] || 0;
        total += topping.price * count;
      });
    }
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
          borderRadius: theme.dialog.borderRadius,
          maxHeight: theme.dialog.maxHeight,
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
            height: theme.headerImage.height,
            objectFit: theme.headerImage.objectFit,
          }}
        />
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: theme.closeButton.top,
            right: theme.closeButton.right,
            backgroundColor: theme.colors.white,
            boxShadow: theme.closeButton.boxShadow,
            '&:hover': {
              backgroundColor: 'grey.100',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Scrollable Content */}
      <DialogContent sx={{ pb: theme.spacing.contentBottom }}>
        <Typography variant={theme.typography.title.variant} fontWeight={theme.typography.title.fontWeight} gutterBottom>
          {product.name}
        </Typography>
        <Typography variant={theme.typography.price.variant} color={theme.colors.textSecondary} sx={{ mb: theme.spacing.section }}>
          €{product.price.toFixed(2)}
        </Typography>

        {product.description && (
          <Typography color={theme.colors.textPrimary} sx={{ mb: theme.spacing.section }}>
            {product.description}
          </Typography>
        )}

        {/* Toppings */}
        {product.toppings && product.toppings.length > 0 && (
          <Box sx={{ mb: theme.spacing.section }}>
            <Typography 
              variant={theme.typography.sectionHeader.variant}
              fontWeight={theme.typography.sectionHeader.fontWeight}
              color={theme.colors.textSecondary}
              sx={{ mb: theme.spacing.sectionHeaderBottom, display: 'block' }}
            >
              TOPPINGS
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {product.toppings.map((topping) => {
                const count = selectedToppings[topping.id] || 0;
                const isSelected = count > 0;

                return (
                  <Card
                    key={topping.id}
                    variant="outlined"
                    onClick={() => handleToppingToggle(topping.id)}
                    sx={{
                      borderRadius: theme.optionCard.borderRadius,
                      borderColor: isSelected ? theme.optionCard.borderColor.selected : theme.optionCard.borderColor.default,
                      backgroundColor: isSelected ? theme.optionCard.backgroundColor.selected : theme.optionCard.backgroundColor.default,
                      cursor: 'pointer',
                      transition: theme.optionCard.transition,
                      '&:hover': {
                        backgroundColor: isSelected ? theme.optionCard.backgroundColor.selected : 'grey.50',
                      },
                    }}
                  >
                    <CardContent 
                      sx={{ 
                        p: theme.optionCard.padding,
                        '&:last-child': { pb: theme.optionCard.padding },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography component="span" fontWeight="medium">
                          {topping.name}
                        </Typography>
                        {topping.price > 0 && (
                          <Typography component="span" color={theme.colors.textSecondary} sx={{ ml: 1 }}>
                            +€{topping.price.toFixed(2)}
                          </Typography>
                        )}
                        {count > 0 && (
                          <Typography component="span" color={theme.colors.textSecondary} sx={{ ml: 1 }}>
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
                            onClick={(e) => handleToppingDecrement(topping.id, e)}
                            sx={{
                              color: theme.colors.error,
                              '&:hover': {
                                backgroundColor: 'error.light',
                              },
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => handleToppingIncrement(topping.id, e)}
                            sx={{
                              color: theme.colors.textSecondary,
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
          backgroundColor: theme.footer.backgroundColor,
          p: theme.footer.padding,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.footer.gap,
        }}
      >
        <Box 
          sx={{ 
            backgroundColor: theme.colors.white,
            borderRadius: theme.quantityControl.container.borderRadius,
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
            px: theme.quantityControl.text.paddingX, 
            fontWeight: theme.quantityControl.text.fontWeight, 
            fontSize: theme.quantityControl.text.fontSize 
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
            backgroundColor: theme.colors.white,
            color: theme.colors.textPrimary,
            fontWeight: theme.buttons.addToCart.fontWeight,
            py: theme.buttons.addToCart.paddingY,
            px: theme.buttons.addToCart.paddingX,
            borderRadius: theme.buttons.addToCart.borderRadius,
            fontSize: theme.buttons.addToCart.fontSize,
            textTransform: theme.buttons.addToCart.textTransform,
            '&:hover': {
              backgroundColor: 'grey.100',
            },
          }}
        >
          Add to order €{calculateTotal().toFixed(2)}
        </Button>
      </Box>
    </Dialog>
  );
};

export default ProductDialog;