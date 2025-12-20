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
import { useSetAtom } from 'jotai';
import { productCardTheme } from '../../theme';
import ProductDialog from './ProductInfoDialog';
import { addOrderItemAtom } from '../../context/orderStore';

interface Props {
  id: string;
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
  const { id, image, name, price, initialQuantity = 0, description, toppings } = props;
  const theme = productCardTheme;
  const addItem = useSetAtom(addOrderItemAtom);

  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const isSelected: boolean = quantity > 0;

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  return (
    <>
      <Card
        onClick={handleOpenDialog}
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
              ({price.toFixed(2)}€)
            </Typography>
          </Typography>
        </CardContent>

        <CardActions sx={{ 
          px: theme.spacing.cardActions.paddingX, 
          pb: theme.spacing.cardActions.paddingBottom, 
          pt: theme.spacing.cardActions.paddingTop 
        }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
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
        </CardActions>
      </Card>

      <ProductDialog
        product={{
          id,
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
