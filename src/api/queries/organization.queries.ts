import { gql } from '@apollo/client';

// Fetch organization by ID
export const GET_ORGANIZATION = gql`
  query GetOrganization($id: ID!) {
    organization(id: $id) {
      Id
      Name
      Address
      LicenseId
      MaxUsers
      Created
    }
  }
`;
