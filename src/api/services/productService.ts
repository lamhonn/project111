import { api } from "../axios";
import { Product } from "../../types";

const baseUrl = "/products";

export const ProductService = {
    getById: async (id: string) => {
        const { data } = await api.get<Product>(`${baseUrl}/${id}`);
        return data;
    },

    getByOrganization: async (organizationId: string) => {
        const { data } = await api.get<Product[]>(`${baseUrl}/organization/${organizationId}`);
        return data;
    },
}