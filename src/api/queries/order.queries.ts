import { gql } from '@apollo/client';

// Fetch orders for a table
export const GET_TABLE_ORDERS = gql`
  query GetTableOrders($tableId: ID!) {
    ordersByTable(tableId: $tableId) {
      Id
      TotalPrice
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
      TableId
      Created
    }
  }
`;
