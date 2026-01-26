import { gql } from '@apollo/client';

// Create order product (add item to order)
export const CREATE_ORDER_PRODUCT = gql`
  mutation CreateOrderProduct($input: CreateOrderProductInput!) {
    createOrderProduct(input: $input) {
      Id
      OrderId
      ProductId
      CampaignProductId
      TotalPrice
      Created
    }
  }
`;
