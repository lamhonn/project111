import { gql } from '@apollo/client';

// Fetch orders for a table
export const GET_TABLE_ORDERS = gql`
  query GetTabletOrders($tabletId: ID!) {
    ordersByTablet(tabletId: $tabletId) {
      id
      organizationId
      totalPrice
      tabletId
      tableNumber
      created
    }
  }
`;

// Fetch single order with details
export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
      id
      organizationId
      totalPrice
      tabletId
      tableNumber
      created
    }
  }
`;
