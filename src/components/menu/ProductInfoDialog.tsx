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
  Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { addOrderItemAtom, Topping as OrderTopping } from '../../context/orderStore';
import { parseToppings } from '../../api/utils/toppings.utils';
import { getLocalizedIngredients, parseExcludables, getLocalizedExcludable } from '../../api/utils/multilingualName.utils';
import { getDietaryCodes, getDietaryName } from '../../api/utils/dietary.utils';
import { Dietary } from '../../api/types/enums';

// Temporary interfaces
interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  description?: string;
  toppings?: string;
  ingredients?: string;
  excludables?: string;
  ageRestricted?: boolean;
  dietaries?: number[];
}

interface ProductDialogProps {
  productId: string;
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ productId, product, isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedToppings, setSelectedToppings] = useState<Record<number, number>>({});
  const [selectedExcludables, setSelectedExcludables] = useState<Set<number>>(new Set());
  const [imageError, setImageError] = useState<boolean>(false);
  const addItem = useSetAtom(addOrderItemAtom);
  
  // Parse toppings from embedded product data
  const toppings = parseToppings(product.toppings);
  
  // Parse excludables from embedded product data
  const excludables = parseExcludables(product.excludables);
  
  // Get localized ingredients
  const localizedIngredients = getLocalizedIngredients(product.ingredients, i18n.language);

  const handleAddToOrder = (): void => {
    // Convert selected toppings to array format
    const toppingsArray: OrderTopping[] = [];
    toppings.forEach((topping, index) => {
      const toppingQuantity = selectedToppings[index] || 0;
      if (toppingQuantity > 0) {
        toppingsArray.push({
          id: topping.Name,
          name: topping.Name,
          price: topping.PriceIncrement,
          quantity: toppingQuantity,
        });
      }
    });

    // Convert selected excludables to array format
    const excludablesArray: string[] = [];
    selectedExcludables.forEach((index) => {
      const excludableName = getLocalizedExcludable(excludables[index], i18n.language);
      if (excludableName) {
        excludablesArray.push(excludableName);
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
      excludables: excludablesArray.length > 0 ? excludablesArray : undefined,
    });

    // Reset and close
    setQuantity(1);
    setSelectedToppings({});
    setSelectedExcludables(new Set());
    onClose();
  };

  const handleToppingToggle = (toppingIndex: number): void => {
    setSelectedToppings(prev => {
      const current = prev[toppingIndex] || 0;
      if (current === 0) {
        return { ...prev, [toppingIndex]: 1 };
      }
      return { ...prev, [toppingIndex]: 0 };
    });
  };

  const handleToppingIncrement = (toppingIndex: number, e: React.MouseEvent): void => {
    e.stopPropagation();
    setSelectedToppings(prev => ({
      ...prev,
      [toppingIndex]: (prev[toppingIndex] || 0) + 1
    }));
  };

  const handleToppingDecrement = (toppingIndex: number, e: React.MouseEvent): void => {
    e.stopPropagation();
    setSelectedToppings(prev => {
      const current = prev[toppingIndex] || 0;
      if (current > 0) {
        return { ...prev, [toppingIndex]: current - 1 };
      }
      return prev;
    });
  };

  const handleExcludableToggle = (excludableIndex: number): void => {
    setSelectedExcludables(prev => {
      const newSet = new Set(prev);
      if (newSet.has(excludableIndex)) {
        newSet.delete(excludableIndex);
      } else {
        newSet.add(excludableIndex);
      }
      return newSet;
    });
  };

  const calculateTotal = (): number => {
    let total = product.price * quantity;
    toppings.forEach((topping, index) => {
      const count = selectedToppings[index] || 0;
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
        {!imageError ? (
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            sx={{
              width: '100%',
              height: 192,
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: 192,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.200',
            }}
          >
            <FastfoodIcon sx={{ fontSize: 100, color: 'grey.500' }} />
          </Box>
        )}
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
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="h5" fontWeight={theme.typography.fontWeights.bold}>
            {product.name}
          </Typography>
          {product.dietaries && product.dietaries.length > 0 && (
            <Typography 
              variant="h5" 
              fontWeight={theme.typography.fontWeights.medium}
              color="text.secondary"
            >
              ({getDietaryCodes(product.dietaries as Dietary[]).join(', ')})
            </Typography>
          )}
        </Box>
        <Typography variant="h6" color={theme.colors.text} sx={{ mb: theme.spacing.lg }}>
          €{product.price.toFixed(2)}
        </Typography>

        {/* Age Restriction Warning */}
        {product.ageRestricted && (
          <Typography 
            variant="body2"
            sx={{ 
              mb: theme.spacing.lg,
              color: '#b45309',
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5 
            }}
          >
            <ErrorOutlineIcon fontSize="small" sx={{ color: '#b45309' }} /> {t('productDialog.ageVerification')}
          </Typography>
        )}

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
              {toppings.map((topping, index) => {
                const count = selectedToppings[index] || 0;
                const isSelected = count > 0;

                return (
                  <Card
                    key={index}
                    variant="outlined"
                    onClick={() => handleToppingToggle(index)}
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
                        maxHeight: '48px',
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
                            onClick={(e) => handleToppingDecrement(index, e)}
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
                            onClick={(e) => handleToppingIncrement(index, e)}
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

        {/* Excludables */}
        {excludables && excludables.length > 0 && (
          <Box sx={{ mb: theme.spacing.lg }}>
            <Typography 
              variant="caption"
              fontWeight={theme.typography.fontWeights.bold}
              color={theme.colors.text}
              sx={{ mb: 1.5, display: 'block' }}
            >
              {t('productDialog.excludables')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {excludables.map((excludable, index) => {
                const isExcluded = selectedExcludables.has(index);
                const localizedName = getLocalizedExcludable(excludable, i18n.language);

                return (
                  <Card
                    key={index}
                    variant="outlined"
                    onClick={() => handleExcludableToggle(index)}
                    sx={{
                      borderRadius: theme.borderRadius.medium,
                      borderColor: isExcluded ? '#dc2626' : 'grey.300',
                      backgroundColor: isExcluded ? '#fee2e2' : 'transparent',
                      cursor: 'pointer',
                      transition: theme.transitions.normal,
                      '&:hover': {
                        backgroundColor: isExcluded ? '#fee2e2' : 'grey.50',
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                          checked={isExcluded}
                          onChange={() => handleExcludableToggle(index)}
                          icon={<RemoveCircleOutlineIcon />}
                          checkedIcon={<RemoveCircleOutlineIcon />}
                          sx={{
                            color: '#dc2626',
                            '&.Mui-checked': {
                              color: '#dc2626',
                            },
                            p: 0,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Typography component="span" fontWeight="medium">
                          {localizedName}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>
        )}

        {/* Ingredients */}
        {localizedIngredients && (
          <Box sx={{ mb: theme.spacing.lg }}>
            <Typography 
              variant="caption"
              fontWeight={theme.typography.fontWeights.bold}
              color={theme.colors.text}
              sx={{ mb: 1, display: 'block' }}
            >
              {t('productDialog.ingredients')}
            </Typography>
            <Typography 
              color={theme.colors.text}
              sx={{ 
                fontStyle: 'italic',
                fontSize: theme.typography.fontSizes.small,
              }}
            >
              {localizedIngredients}
            </Typography>
          </Box>
        )}

        {/* Dietary Definitions */}
        {product.dietaries && product.dietaries.length > 0 && (
          <Box sx={{ mb: theme.spacing.md }}>
            <Typography 
              variant="caption"
              color="text.secondary"
              sx={{ 
                fontStyle: 'italic',
                fontSize: theme.typography.fontSizes.small,
                display: 'block',
              }}
            >
              {product.dietaries.map((dietary, index) => {
                const code = getDietaryCodes([dietary as Dietary])[0];
                const name = getDietaryName(dietary as Dietary, t);
                return (
                  <span key={dietary}>
                    {code} = {name}
                    {index < product.dietaries!.length - 1 ? ', ' : ''}
                  </span>
                );
              })}
            </Typography>
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