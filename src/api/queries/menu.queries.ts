import { gql } from '@apollo/client';

// Fetch active menu for organization
export const GET_ACTIVE_MENU = gql`
  query GetActiveMenu($organizationId: ID!) {
    menus(organizationId: $organizationId) {
      id
      organizationId
      name
      categories
      enabled
      topmostCategory
      patternStartTime
      patternEndTime
      eventStartTime
      eventEndTime
      created
    }
  }
`;

// Fetch menu by ID with full details
export const GET_MENU_BY_ID = gql`
  query GetMenuById($id: ID!) {
    menu(id: $id) {
      id
      organizationId
      name
      categories
      enabled
      topmostCategory
      patternStartTime
      patternEndTime
      eventStartTime
      eventEndTime
      created
    }
  }
`;
