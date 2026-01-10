import { gql } from '@apollo/client';

// Create a new order
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      Id
      TotalPrice
      TableId
      Created
    }
  }
`;
