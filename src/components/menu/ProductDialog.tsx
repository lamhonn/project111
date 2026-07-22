import React, { useEffect, useState } from 'react';
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
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { orderProductsAtom } from '../../state/orderStore';
import { Dietaries } from '../../types/enums';
import { getProductById, loadingAtom, selectedProductAtom } from '../../state/productStore';
import { getTranslation } from '../../utils/multilingualNameUtils';
import { ProductExcludable, ProductTopping } from '../../types/models';
import { getDietaryCodes, getDietaryName } from '../../utils/dietaryUtils';
import { OrderProductViewModel } from '../../types/viewModels/orderProductViewModel';
import { randomUUID } from 'crypto';

interface ProductDialogProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedToppings, setSelectedToppings] = useState<ProductTopping[]>([]);
  const [selectedExcludables, setSelectedExcludables] = useState<ProductExcludable[]>([]);
  const [imageError, setImageError] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const loading = useAtomValue(loadingAtom);

  const getProduct = useSetAtom(getProductById);
  const product = useAtomValue(selectedProductAtom);
  
  const [toppings, setToppings] = useState<ProductTopping[]>();
  const [excludables, setExcludables] = useState<ProductExcludable[]>();

  const [orderProducts, setOrderProducts] = useAtom(orderProductsAtom);

  useEffect(() => {
    getProduct();
    if (product) {
      setToppings(product.ProductToppings);
      setExcludables(product.ProductExcludables);
    }
  }, []);

  useEffect(() => {
    setTotalPrice(calculateTotal());
  }, [selectedToppings, selectedExcludables])

  const handleAddToOrder = (): void => {
    if (product) {
      const orderProduct: OrderProductViewModel = {
        Id: randomUUID(),
        ProductId: product.Id,
        Name: product.Name,
        ImgUrl: product.ImgUrl,
        Price: totalPrice,
        ProductToppings: selectedToppings,
        ProductExcludables: selectedExcludables
      }
      setOrderProducts([...orderProducts, orderProduct]);
    }
    
    onClose();
  };

  const handleToppingToggle = (toppingId: string): void => {
    const topping = product?.ProductToppings.find(topping => topping.Id === toppingId);
    if (topping) setSelectedToppings([...selectedToppings, topping]);
  };

  const handleToppingIncrement = (toppingId: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    const topping = product?.ProductToppings.find(topping => topping.Id === toppingId);
    if (topping) setSelectedToppings([...selectedToppings, topping]);
  };

  const handleToppingDecrement = (toppingId: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    const selectedTopping = selectedToppings.find(topping => topping.Id === toppingId);
    if (selectedTopping) {
      const selectedToppingIndex = selectedToppings.indexOf(selectedTopping);
      if (selectedToppingIndex > -1) {
        setSelectedToppings(selectedToppings.splice(selectedToppingIndex, 1));
      } 
    }
  };

  const handleExcludableToggle = (excludableId: string): void => {
      const productExcludables = product?.ProductExcludables;
      if (productExcludables) {
        const selectedExcludable = productExcludables.find(excludable => excludable.Id === excludableId);
        
        // Not the most elegant way to toggle excludable selection, but works, probably
        if (selectedExcludable) {
          const selectedIndex = productExcludables.indexOf(selectedExcludable);
          setSelectedExcludables(productExcludables.splice(selectedIndex, 1));
        } else {
          const newExcludable = product?.ProductExcludables.find(excludable => excludable.Id === excludableId); 
          if (newExcludable) setSelectedExcludables([...selectedExcludables, newExcludable]);
        }
      }
  };

  const calculateTotal = (): number => {
    if (!product) return 0;

    let total = product.Price * quantity;
    const freeToppingsCount = product.FreeToppings || 0;
    
    // Calculate how many toppings need to be charged
    const chargeableToppings = Math.max(0, selectedToppings.length - freeToppingsCount);
    
    // If we have free toppings, we need to apply the price only to the excess toppings
    if (freeToppingsCount > 0 && chargeableToppings > 0) {
      const toppingPrices: number[] = [];
      selectedToppings?.forEach((topping) => {
        toppingPrices.push(topping.Price);
      });
      toppingPrices.sort((a, b) => a - b); // Sort prices from lowest to highest, reverse to b - a if we want to go highest-lowest price order
      
      // Add only the chargeable toppings (skip the free ones)
      for (let i = freeToppingsCount; i < toppingPrices.length; i++) {
        total += toppingPrices[i];
      }
    } else if (freeToppingsCount === 0) {
      // No free toppings, charge for all
      toppings?.forEach((topping) => {
        total += topping.Price;
      });
    }    
    return total; // TODO: round to decimal?
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
          maxHeight: '95vh',
          height: { xs: 'auto', md: '95vh' },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: "24px",
          right: "24px",
          backgroundColor: theme.colors.brandWhite,
          boxShadow: theme.shadows.md,
          zIndex: 1,
          '&:hover': {
            backgroundColor: 'grey.100',
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
      }}>
        {/* Image Section */}
        <Box sx={{ 
          position: 'relative',
          width: { xs: '100%', md: '50%' },
          minHeight: { xs: 192, md: 'auto' },
          flexShrink: 0,
        }}>
          {!imageError ? (
            <Box
              component="img"
              src={product?.ImgUrl}
              alt={product?.ImgUrl ? getTranslation(product.Name, i18n.language) : "Image"}
              onError={() => setImageError(true)}
              sx={{
                width: '100%',
                height: { xs: 192, md: '100%' },
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: { xs: 192, md: '100%' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.200',
              }}
            >
              <FastfoodIcon sx={{ fontSize: 100, color: 'grey.500' }} />
            </Box>
          )}
        </Box>

        {/* Content Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}>
          {/* Scrollable Content */}
          <DialogContent sx={{ 
            pb: 0, 
            flex: 1, 
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="h5" fontWeight={theme.typography.fontWeights.bold}>
            {product?.Name ? getTranslation(product.Name, i18n.language) : "ERROR"}
          </Typography>
          {product?.Dietaries && product.Dietaries.length > 0 && (
            <Typography 
              variant="h5" 
              fontWeight={theme.typography.fontWeights.medium}
              color="text.secondary"
            >
              ({getDietaryCodes(product.Dietaries as Dietaries[]).join(', ')})
            </Typography>
          )}
        </Box>
        <Typography variant="h6" color={theme.colors.text} sx={{ mb: theme.spacing.lg }}>
          {product?.Price ? product.Price.toFixed(2) : "ERROR"}€
        </Typography>

        {product?.Description && (
          <Typography color={theme.colors.text} sx={{ mb: theme.spacing.lg }}>
            {getTranslation(product.Description, i18n.language)}
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
                const count = selectedToppings.filter(t => t === topping).length || 0;
                const isSelected = count > 0;
                const toppingName = getTranslation(topping.Name, i18n.language);

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
                        maxHeight: '48px',
                      }}
                    >
                      <Box>
                        <Typography component="span" fontWeight="medium">
                          {toppingName}
                        </Typography>
                        {topping.Price > 0 && (
                          product?.FreeToppings && selectedToppings.length < product.FreeToppings ? (
                            <></>
                            ) : (
                            <Typography component="span" color={theme.colors.text} sx={{ ml: 1 }}>
                              +{topping.Price.toFixed(2)}€
                            </Typography>
                          )
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
                const isExcluded = !!selectedExcludables.find(e => e.Id === excludable.Id);
                const toppingName = getTranslation(excludable.Name, i18n.language);

                return (
                  <Card
                    key={index}
                    variant="outlined"
                    onClick={() => handleExcludableToggle(excludable.Id)}
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
                          onChange={() => handleExcludableToggle(excludable.Id)}
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
                          {toppingName}
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
        {product?.Ingredients && (
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
              {getTranslation(product.Ingredients, i18n.language)}
            </Typography>
          </Box>
        )}

        {/* Dietary Definitions */}
        {product?.Dietaries && product.Dietaries.length > 0 && (
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
              {product?.Dietaries.map((dietary, index) => {
                const code = getDietaryCodes([dietary])[0];
                const name = getDietaryName(dietary, t);
                return (
                  <span key={dietary}>
                    {code} = {name}
                    {index < product.Dietaries!.length - 1 ? ', ' : ''}
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
              flexShrink: 0,
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
          {t('productDialog.addToOrder')} {totalPrice}€
        </Button>
      </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ProductDialog;