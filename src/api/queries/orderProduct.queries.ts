import { gql } from '@apollo/client';

// Fetch all products in an order
export const GET_ORDER_PRODUCTS = gql`
  query GetOrderProducts($orderId: ID!) {
    orderProducts(orderId: $orderId) {
      Id
      OrderId
      ProductId
      CampaignProductId
      TotalPrice
      Created
    }
  }
`;
