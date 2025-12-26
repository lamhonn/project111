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
import { theme } from '../../theme/theme';
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
          maxWidth: 345,
          borderRadius: theme.borderRadius.small,
          border: isSelected ? `3px solid ${theme.colors.primary}` : `1px solid ${theme.colors.border}`,
          boxShadow: isSelected ? theme.shadows.primary : 1,
          transition: theme.transitions.normal,
          cursor: 'pointer',
        }}
      >
        <CardMedia
          component="img"
          height={200}
          image={image}
          alt={name}
          sx={{ objectFit: 'cover' }}
        />
        
        <CardContent sx={{ pb: theme.spacing.sm }}>
          <Typography 
            variant="h6" 
            component="div" 
            fontWeight={theme.typography.fontWeights.semibold}
          >
            {name}{' '}
            <Typography 
              component="span" 
              color="text.secondary" 
              fontSize={theme.typography.fontSizes.medium}
            >
              ({price.toFixed(2)}€)
            </Typography>
          </Typography>
        </CardContent>

        <CardActions sx={{ 
          px: theme.spacing.md, 
          pb: theme.spacing.md, 
          pt: 0 
        }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{
                borderRadius: theme.borderRadius.large,
                textTransform: 'none',
                fontSize: theme.typography.fontSizes.medium,
                py: theme.spacing.sm,
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
