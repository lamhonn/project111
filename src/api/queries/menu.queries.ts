import { gql } from '@apollo/client';

// Fetch active menu for organization
export const GET_ACTIVE_MENU = gql`
  query GetActiveMenu($organizationId: ID!) {
    activeMenu(organizationId: $organizationId) {
      Id
      Name
      Categories
      Enabled
    }
  }
`;

// Fetch menu by ID with full details
export const GET_MENU_BY_ID = gql`
  query GetMenuById($id: ID!) {
    menu(id: $id) {
      Id
      OrganizationId
      Name
      Categories
      Enabled
      Created
    }
  }
`;
