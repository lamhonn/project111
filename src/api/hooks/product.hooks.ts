import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS, GET_PRODUCT_BY_ID } from '../queries/product.queries';
import type { Product } from '../types';
import { MOCK_PRODUCTS, type ProductWithCategory } from '../mockData/products.mock';

interface GetProductsData {
  products: ProductWithCategory[];
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
 * 
 * TODO: Currently returns mock data. When ready to connect to real API,
 * uncomment the useQuery call and remove the mock data return.
 */
export const useGetProducts = (organizationId: string) => {
  // Temporarily return mock data instead of making GraphQL query
  // This allows components to use the hook pattern while we develop
  return {
    data: { products: MOCK_PRODUCTS },
    loading: false,
    error: undefined,
  } as const;

  // When ready for real API, replace above with:
  // return useQuery<GetProductsData, GetProductsVars>(GET_PRODUCTS, {
  //   variables: { organizationId },
  //   skip: !organizationId,
  // });
};

/**
 * Hook to fetch a single product by ID with full details
 * Used for: Product detail view, showing ingredients/dietary info
 * 
 * TODO: Currently returns mock data. When ready to connect to real API,
 * uncomment the useQuery call and remove the mock data return.
 */
export const useGetProductById = (id: string) => {
  const product = MOCK_PRODUCTS.find(p => p.Id === id);
  
  return {
    data: product ? { product } : undefined,
    loading: false,
    error: product ? undefined : new Error('Product not found'),
  } as const;

  // When ready for real API, replace above with:
  // return useQuery<GetProductByIdData, GetProductByIdVars>(GET_PRODUCT_BY_ID, {
  //   variables: { id },
  //   skip: !id,
  // });
};
