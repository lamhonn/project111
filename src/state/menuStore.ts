import { atom } from 'jotai';
import { Menu } from '../types/models/menu';
import { MenuService } from '../api/services/menuService';
import { MenuProduct } from '../types/models';
import { organizationIdAtom } from './authStore';
import { MenuCategoryViewModel } from '../types/viewModels/menuCategoryViewModel';

export const menusAtom = atom<Menu[]>([]);

export const loadingAtom = atom(false);

export const errorAtom = atom<string | null>(null);

export const getActiveMenus = atom(
    (get) => get(menusAtom),
    async (get, set) => {
        set(loadingAtom, true);
        set(errorAtom, null);
        
        try {
            const organizationId = get(organizationIdAtom);

            if (!organizationId) return;

            const response = await MenuService.getActiveByOrganizationId(organizationId);
            set(menusAtom, response);
        }
        catch (error) {
            set(errorAtom, "Error fetching menus");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const getMenuCategoriesAtom = atom(
    (get) => {
        const menus = get(menusAtom);

        const menuCategories: MenuCategoryViewModel[] = menus.flatMap(menu => 
            menu.MenuCategories.map(menuCategory => 
            (
                {
                    Id: menuCategory.Id,
                    Name: menuCategory.Name,
                    Products: menu.MenuProducts.filter(product => product.MenuCategoryId === menuCategory.Id)
                }
            )
        ));

        return menuCategories;
    }
);