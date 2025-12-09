import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import ProductCard from '../../components/menu/ProductCard';
import ActionBar from '../../components/actionbar/Actionbar';

// Sample product data
const sampleProducts = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    name: 'Margherita Pizza',
    price: 12.99,
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    toppings: [
      { id: 't1', name: 'Extra Cheese', price: 2.0 },
      { id: 't2', name: 'Mushrooms', price: 1.5 },
      { id: 't3', name: 'Olives', price: 1.0 },
      { id: 't4', name: 'Pepperoni', price: 2.5 },
    ],
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400',
    name: 'Pepperoni Pizza',
    price: 14.99,
    description: 'Pizza topped with spicy pepperoni and mozzarella cheese',
    toppings: [
      { id: 't1', name: 'Extra Cheese', price: 2.0 },
      { id: 't2', name: 'Mushrooms', price: 1.5 },
      { id: 't5', name: 'Green Peppers', price: 1.0 },
    ],
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    name: 'Hawaiian Pizza',
    price: 13.99,
    description: 'Pizza with ham, pineapple, and mozzarella',
    toppings: [
      { id: 't1', name: 'Extra Cheese', price: 2.0 },
      { id: 't6', name: 'Extra Ham', price: 2.5 },
      { id: 't7', name: 'Extra Pineapple', price: 1.5 },
    ],
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    name: 'Veggie Supreme',
    price: 13.49,
    description: 'Loaded with fresh vegetables and mozzarella',
    toppings: [
      { id: 't2', name: 'Mushrooms', price: 1.5 },
      { id: 't5', name: 'Green Peppers', price: 1.0 },
      { id: 't3', name: 'Olives', price: 1.0 },
      { id: 't8', name: 'Tomatoes', price: 1.0 },
    ],
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=400',
    name: 'BBQ Chicken',
    price: 15.99,
    description: 'BBQ sauce, grilled chicken, red onions, and cilantro',
    toppings: [
      { id: 't1', name: 'Extra Cheese', price: 2.0 },
      { id: 't9', name: 'Extra Chicken', price: 3.0 },
      { id: 't10', name: 'Bacon', price: 2.5 },
    ],
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400',
    name: 'Meat Lovers',
    price: 16.99,
    description: 'Loaded with pepperoni, sausage, ham, and bacon',
    toppings: [
      { id: 't4', name: 'Pepperoni', price: 2.5 },
      { id: 't10', name: 'Bacon', price: 2.5 },
      { id: 't6', name: 'Extra Ham', price: 2.5 },
    ],
  },
];

const MenuView: React.FC = () => {
  const [orderCount] = useState(3);
  const [totalPrice] = useState(42.47);

  return (
    <Box sx={{ pb: 10 }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: 'success.main',
          color: 'white',
          py: 3,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold">
            Menu
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Choose your favorite pizza
          </Typography>
        </Container>
      </Box>

      {/* Product Grid */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              description={product.description}
              toppings={product.toppings}
            />
          ))}
        </Box>
      </Container>

      {/* Action Bar */}
      <ActionBar orderCount={orderCount} totalPrice={totalPrice} />
    </Box>
  );
};

export default MenuView;
