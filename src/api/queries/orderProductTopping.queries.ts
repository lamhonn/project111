import { gql } from '@apollo/client';

// Fetch toppings for a specific order product
export const GET_ORDER_PRODUCT_TOPPINGS = gql`
  query GetOrderProductToppings($orderId: ID!) {
    order(id: $orderId) {
      id
      products {
        id
        toppings {
          id
          orderProductId
          toppingId
          amount
          created
        }
      }
    }
  }
`;
