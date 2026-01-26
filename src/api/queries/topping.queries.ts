import { gql } from '@apollo/client';

// Fetch toppings for a specific product
export const GET_PRODUCT_TOPPINGS = gql`
  query GetProductToppings($productId: ID!) {
    toppings(productId: $productId) {
      Id
      Name
      PriceIncrement
    }
  }
`;
