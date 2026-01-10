import { gql } from '@apollo/client';

// Fetch products by organization for menu display
export const GET_PRODUCTS = gql`
  query GetProducts($organizationId: ID!) {
    products(organizationId: $organizationId) {
      Id
      Name
      Description
      Price
      ImgUrl
      Enabled
    }
  }
`;

// Fetch single product with full details including ingredients and dietary info
export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      Id
      OrganizationId
      Name
      Description
      Price
      Ingredients
      Dieataries
      ImgUrl
      Enabled
      AgeRestrictied
    }
  }
`;
