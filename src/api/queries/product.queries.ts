import { gql } from '@apollo/client';

// Fetch products by organization for menu display
export const GET_PRODUCTS = gql`
  query GetProducts($organizationId: ID!) {
    products(organizationId: $organizationId) {
      id
      organizationId
      name
      description
      price
      oldPrice
      freeToppings
      ingredients
      dietaries
      imgUrl
      enabled
      ageRestricted
      toppings
      excludables
      created
    }
  }
`;

// Fetch single product with full details including ingredients and dietary info
export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      organizationId
      name
      description
      price
      oldPrice
      freeToppings
      ingredients
      dietaries
      imgUrl
      enabled
      ageRestricted
      toppings
      excludables
      created
    }
  }
`;
