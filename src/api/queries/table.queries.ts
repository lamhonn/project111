import { gql } from '@apollo/client';

// Fetch table by table number and organization
export const GET_TABLE_BY_NUMBER = gql`
  query GetTableByNumber($organizationId: ID!, $tableNumber: Int!) {
    tableByNumber(organizationId: $organizationId, tableNumber: $tableNumber) {
      Id
      TableNumber
      OrganizationId
    }
  }
`;

// Fetch table by ID
export const GET_TABLE_BY_ID = gql`
  query GetTableById($id: ID!) {
    table(id: $id) {
      Id
      TableNumber
      OrganizationId
      Created
    }
  }
`;
