import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS, GET_PRODUCT_BY_ID } from '../queries/product.queries';
import type { Product } from '../types';

interface GetProductsData {
  products: Product[];
}

interface GetProductsVars {
  organizationId: string;
}

interface GetProductByIdData {
  product: Product;
}

interface GetProductByIdVars {
  id: string;
}

/**
 * Hook to fetch all products for an organization
 * Used for: Menu display, product selection
 */
export const useGetProducts = (organizationId: string) => {
  return useQuery<GetProductsData, GetProductsVars>(GET_PRODUCTS, {
    variables: { organizationId },
    skip: !organizationId,
  });
};

/**
 * Hook to fetch a single product by ID with full details
 * Used for: Product detail view, showing ingredients/dietary info
 */
export const useGetProductById = (id: string) => {
  return useQuery<GetProductByIdData, GetProductByIdVars>(GET_PRODUCT_BY_ID, {
    variables: { id },
    skip: !id,
  });
};
