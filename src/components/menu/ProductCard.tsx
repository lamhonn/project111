import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';

import { theme } from '../../theme/theme';
import ProductDialog from './ProductDialog';
import { getTranslation } from '../../utils/multilingualNameUtils';
import { selectedProductIdAtom } from '../../state/productStore';

interface Props {
  productId: string;
  imgUrl?: string;
  name: string;
  price: number;
}

const ProductCard: React.FC<Props> = (props: Props) => {
  const { productId: productId, imgUrl, name, price } = props;
  const { t, i18n } = useTranslation();

  const localizedName = getTranslation(name, i18n.language);

  const [selectedProductId, setSelectedProductId] = useAtom(selectedProductIdAtom);

  const [quantity, setQuantity] = useState<number>(0); // remove?
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const isSelected: boolean = quantity > 0;

  const handleOpenDialog = (): void => {
    setSelectedProductId(productId);
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setSelectedProductId('');
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
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {!imageError ? (
          <CardMedia
            component="img"
            height={200}
            image={imgUrl}
            alt={localizedName}
            onError={() => setImageError(true)}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.200',
            }}
          >
            <FastfoodIcon sx={{ fontSize: 80, color: 'grey.500' }} />
          </Box>
        )}
        
        <CardContent sx={{ pb: theme.spacing.sm, flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            component="div" 
            fontWeight={theme.typography.fontWeights.semibold}
          >
            {localizedName}{' '}
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
          pt: 0,
          mt: 'auto',
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
              {t('productCard.addItem')}
            </Button>
        </CardActions>
      </Card>

      <ProductDialog
        productId={productId}
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default ProductCard;