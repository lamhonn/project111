import { useQuery } from '@apollo/client/react';
import { GET_MENU_PRODUCTS } from '../queries/menuProduct.queries';
import type { MenuProduct } from '../types';

interface GetMenuProductsData {
  menuProducts: MenuProduct[];
}

interface GetMenuProductsVars {
  menuId: string;
}

/**
 * Hook to fetch product-category mappings for a menu.
 * Used for: Displaying products under the correct menu categories.
 */
export const useGetMenuProducts = (menuId: string) => {
  return useQuery<GetMenuProductsData, GetMenuProductsVars>(GET_MENU_PRODUCTS, {
    variables: { menuId },
    skip: !menuId,
  });
};