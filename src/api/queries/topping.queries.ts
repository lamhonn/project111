import { gql } from '@apollo/client';

// Fetch toppings for a specific product
export const GET_PRODUCT_TOPPINGS = gql`
  query GetProductToppings($productId: ID!) {
    product(id: $productId) {
      id
      toppings
    }
  }
`;
