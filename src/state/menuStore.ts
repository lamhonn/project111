import { atom } from 'jotai';
import { Menu } from '../types/models/menu';
import { MenuService } from '../api/services/menuService';
import { MenuCategory, MenuProduct } from '../types/models';
import { organizationIdAtom } from './authStore';

export const menusAtom = atom<Menu[]>([]);

export const menuProductsAtom = atom<MenuProduct[]>([]);

export const menuCategoriesAtom = atom<MenuCategory[]>([]);

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

export const getMenuCategories = atom(
    (get) => get(menuCategoriesAtom),
    (get, set) => {
        set(errorAtom, null);

        try {
            const menus = get(menusAtom);
            const menuCategories: MenuCategory[] = menus.flatMap(menu => menu.MenuCategories);

            set(menuCategoriesAtom, menuCategories);
        }
        catch (error) {
            set(errorAtom, "Error loading categories");
        }
    }
);

export const getMenuProducts = atom(
    (get) => get(menuProductsAtom),
    (get, set) => {
        set(errorAtom, null);

        try {
            const menus = get(menusAtom);
            const menuProducts: MenuProduct[] = menus.flatMap(menu => menu.MenuProducts);

            set(menuProductsAtom, menuProducts);
        }
        catch (error) {
            set(errorAtom, "Error loading products");
        }
    }
);