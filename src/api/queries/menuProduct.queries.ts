import { gql } from '@apollo/client';

// Fetch menu product mappings for a menu
export const GET_MENU_PRODUCTS = gql`
  query GetMenuProducts($menuId: ID!) {
    menuProducts(menuId: $menuId) {
      id
      menuId
      productId
      categoryId
      created
    }
  }
`;