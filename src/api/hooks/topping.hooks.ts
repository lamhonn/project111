import { useQuery } from '@apollo/client/react';
import { GET_PRODUCT_TOPPINGS } from '../queries/topping.queries';
import type { Topping } from '../types';

interface GetProductToppingsData {
  toppings: Topping[];
}

interface GetProductToppingsVars {
  productId: string;
}

/**
 * Hook to fetch available toppings for a product
 * Used for: Product customization dialog, displaying add-on options
 */
export const useGetProductToppings = (productId: string) => {
  return useQuery<GetProductToppingsData, GetProductToppingsVars>(GET_PRODUCT_TOPPINGS, {
    variables: { productId },
    skip: !productId,
  });
};
