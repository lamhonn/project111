import { useQuery } from '@apollo/client/react';
import { GET_PRODUCT_TOPPINGS } from '../queries/topping.queries';
import type { Topping } from '../types';
import { MOCK_TOPPINGS, MOCK_CAMPAIGN_TOPPINGS } from '../mockData/toppings.mock';

interface GetProductToppingsData {
  toppings: Topping[];
}

interface GetProductToppingsVars {
  productId: string;
}

/**
 * Hook to fetch available toppings for a product
 * Used for: Product customization dialog, displaying add-on options
 * 
 * TODO: Currently returns mock data. When ready to connect to real API,
 * uncomment the useQuery call and remove the mock data return.
 */
export const useGetProductToppings = (productId: string) => {
  // Check both regular products and campaign products
  const toppings = MOCK_TOPPINGS[productId] || MOCK_CAMPAIGN_TOPPINGS[productId] || [];
  
  return {
    data: { toppings },
    loading: false,
    error: undefined,
  } as const;

  // When ready for real API, replace above with:
  // return useQuery<GetProductToppingsData, GetProductToppingsVars>(GET_PRODUCT_TOPPINGS, {
  //   variables: { productId },
  //   skip: !productId,
  // });
};
