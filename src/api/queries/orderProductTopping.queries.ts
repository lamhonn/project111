import { gql } from '@apollo/client';

// Fetch toppings for a specific order product
export const GET_ORDER_PRODUCT_TOPPINGS = gql`
  query GetOrderProductToppings($orderProductId: ID!) {
    orderProductToppings(orderProductId: $orderProductId) {
      Id
      ToppingId
      Amount
    }
  }
`;
