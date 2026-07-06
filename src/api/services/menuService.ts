import { api } from "../axios";
import { Menu } from "../../types";

const baseUrl = "/menus";

export const MenuService = {
    getByOrganizationId: async (organizationId: string) => {
        const { data } = await api.get<Menu[]>(`${baseUrl}/organization/${organizationId}`);
        return data;
    },
}