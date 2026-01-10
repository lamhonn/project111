import { gql } from '@apollo/client';

// Create order product topping (add topping to order item)
export const CREATE_ORDER_PRODUCT_TOPPING = gql`
  mutation CreateOrderProductTopping($input: CreateOrderProductToppingInput!) {
    createOrderProductTopping(input: $input) {
      Id
      OrderProductId
      ToppingId
      Amount
      Created
    }
  }
`;
