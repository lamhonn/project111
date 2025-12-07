import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { productCardTheme } from '../../theme';
import ProductDialog from './ProductInfoDialog';

interface Props {
  image: string;
  name: string;
  price: number;
  initialQuantity?: number;
  description?: string;
  toppings?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

const ProductCard: React.FC<Props> = (props: Props) => {
  const { image, name, price, initialQuantity = 0, description, toppings } = props;
  const theme = productCardTheme;

  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const isSelected: boolean = quantity > 0;

  const handleAddItem = (): void => {
    setQuantity(1);
  };

  const handleAddItemClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    handleAddItem();
  };

  const handleIncrement = (): void => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = (): void => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleCardClick = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        sx={{
          maxWidth: theme.card.maxWidth,
          borderRadius: theme.card.borderRadius,
          border: isSelected ? theme.card.border.selected : theme.card.border.default,
          boxShadow: isSelected ? theme.card.boxShadow.selected : theme.card.boxShadow.default,
          transition: theme.card.transition,
          cursor: 'pointer',
        }}
      >
        <CardMedia
          component="img"
          height={theme.media.height}
          image={image}
          alt={name}
          sx={{ objectFit: theme.media.objectFit }}
        />
        
        <CardContent sx={{ pb: theme.spacing.cardContent.paddingBottom }}>
          <Typography 
            variant={theme.typography.title.variant} 
            component="div" 
            fontWeight={theme.typography.title.fontWeight}
          >
            {name}{' '}
            <Typography 
              component="span" 
              color="text.secondary" 
              fontSize={theme.typography.price.fontSize}
            >
              (${price.toFixed(1)})
            </Typography>
          </Typography>
        </CardContent>

        <CardActions sx={{ 
          px: theme.spacing.cardActions.paddingX, 
          pb: theme.spacing.cardActions.paddingBottom, 
          pt: theme.spacing.cardActions.paddingTop 
        }}>
          {!isSelected ? (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddItemClick}
              sx={{
                borderRadius: theme.buttons.addItem.borderRadius,
                textTransform: theme.buttons.addItem.textTransform,
                fontSize: theme.buttons.addItem.fontSize,
                py: theme.buttons.addItem.paddingY,
                borderColor: theme.colors.border,
                color: 'text.primary',
                '&:hover': {
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.primaryLight,
                },
              }}
            >
              Add Item
            </Button>
          ) : (
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Button
                variant="contained"
                startIcon={<CheckCircleIcon />}
                sx={{
                  borderRadius: theme.buttons.choose.borderRadius,
                  textTransform: theme.buttons.choose.textTransform,
                  fontSize: theme.buttons.choose.fontSize,
                  py: theme.buttons.choose.paddingY,
                  px: theme.buttons.choose.paddingX,
                  backgroundColor: theme.colors.primary,
                  '&:hover': {
                    backgroundColor: theme.colors.primaryHover,
                  },
                }}
              >
                Choose
              </Button>
              
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.quantityControl.container.gap,
                  backgroundColor: theme.colors.background,
                  borderRadius: theme.quantityControl.container.borderRadius,
                  px: theme.quantityControl.container.paddingX,
                }}
              >
                <IconButton
                  size="small"
                  onClick={handleDecrement}
                  sx={{ color: 'text.primary' }}
                >
                  <RemoveIcon />
                </IconButton>
                
                <Typography
                  sx={{
                    minWidth: theme.quantityControl.text.minWidth,
                    textAlign: 'center',
                    fontWeight: theme.quantityControl.text.fontWeight,
                    fontSize: theme.quantityControl.text.fontSize,
                  }}
                >
                  {quantity}
                </Typography>
                
                <IconButton
                  size="small"
                  onClick={handleIncrement}
                  sx={{ color: 'text.primary' }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </CardActions>
      </Card>

      <ProductDialog
        product={{
          image,
          name,
          price,
          description,
          toppings,
        }}
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default ProductCard;
