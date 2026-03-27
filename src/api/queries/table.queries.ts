import { gql } from '@apollo/client';

// Fetch table by table number and organization
export const GET_TABLE_BY_NUMBER = gql`
  query GetTabletByNumber($organizationId: ID!, $tableNumber: Int!) {
    tablets(organizationId: $organizationId) {
      id
      userId
      tableNumber
      created
    }
  }
`;

// Fetch table by ID
export const GET_TABLE_BY_ID = gql`
  query GetTabletById($id: ID!) {
    tablet(id: $id) {
      id
      userId
      tableNumber
      created
    }
  }
`;

// Fetch tablet assignment status for polling
export const GET_TABLE_LOCKED_STATUS = gql`
  query GetTabletStatus($id: ID!) {
    tablet(id: $id) {
      id
      userId
    }
  }
`;
