import { gql } from '@apollo/client';

// Create a new order
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      code
      success
      message
      order {
        id
        totalPrice
        tabletId
        tableNumber
        created
      }
    }
  }
`;
