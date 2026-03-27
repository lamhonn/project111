import { useQuery } from '@apollo/client/react';
import { GET_ACTIVE_MENU, GET_MENU_BY_ID } from '../queries/menu.queries';
import type { Menu } from '../types';

interface GetActiveMenuData {
  menus: Menu[];
}

interface GetActiveMenuVars {
  organizationId: string;
}

interface GetMenuByIdData {
  menu: Menu;
}

interface GetMenuByIdVars {
  id: string;
}

/**
 * Hook to fetch the active menu for an organization
 * Used for: Initial menu load, determining available categories
 */
export const useGetActiveMenu = (organizationId: string) => {
  const result = useQuery<GetActiveMenuData, GetActiveMenuVars>(GET_ACTIVE_MENU, {
    variables: { organizationId },
    skip: !organizationId,
  });

  const menus = result.data?.menus ?? [];
  const activeMenu = menus.find((menu) => menu.enabled) ?? menus[0] ?? null;

  return {
    ...result,
    data: result.data ? { activeMenu } : undefined,
  };
};

/**
 * Hook to fetch a specific menu by ID
 * Used for: Admin menu management
 */
export const useGetMenuById = (id: string) => {
  return useQuery<GetMenuByIdData, GetMenuByIdVars>(GET_MENU_BY_ID, {
    variables: { id },
    skip: !id,
  });
};
