import { gql } from '@apollo/client';

// Fetch orders for a table
export const GET_TABLE_ORDERS = gql`
  query GetTabletOrders($tabletId: ID!) {
    ordersByTablet(tabletId: $tabletId) {
      Id
      OrganizationId
      TotalPrice
      TabletId
      TableNumber
      Created
    }
  }
`;

// Fetch single order with details
export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
      Id
      OrganizationId
      TotalPrice
      TabletId
      TableNumber
      Created
    }
  }
`;
