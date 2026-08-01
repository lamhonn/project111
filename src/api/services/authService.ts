import { api } from "../axios";

const baseUrl = "/auth";

export const AuthService = {
    login: async (pin: string) => {
        const { data } = await api.post<string>(`${baseUrl}/tablet/login`, pin);        
        return data;
    },

    refresh: async () => {
        const { data } = await api.post<string>(`${baseUrl}/tablet/refresh`);
        return data;
    },
}