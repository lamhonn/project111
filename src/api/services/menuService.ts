import { api } from "../axios";
import { Menu } from "../../types/models";

const baseUrl = "/menus";

export const MenuService = {
    getActiveByOrganizationId: async (organizationId: string) => {
        const { data } = await api.get<Menu[]>(`${baseUrl}/organization/${organizationId}/active`);
        return data;
    },
}