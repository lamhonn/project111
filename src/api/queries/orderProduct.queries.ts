import { gql } from '@apollo/client';

// Fetch all products in an order
export const GET_ORDER_PRODUCTS = gql`
  query GetOrderProducts($orderId: ID!) {
    order(id: $orderId) {
      id
      products {
        id
        orderId
        productId
        campaignProductId
        totalPrice
        created
      }
    }
  }
`;
