import { api } from "../axios";

const baseUrl = "/auth/tablet";

// TODO: tablet specific auth
export const AuthService = {
    login: async (credentials: LoginRequest) => {
        // 1. Make the API call
        const { data } = await api.post<AuthResponse>(`${baseUrl}/login`, credentials);
        
        return data;
    },

    refresh: async (refreshToken: string) => {
        const { data } = await api.post<AuthResponse>(`${baseUrl}/refresh`, { refreshToken: });
        return data;
    },

    logout: async () => {
        try {
            await api.post(`${baseUrl}/logout`, { refreshToken: tokens.refreshToken });
        } catch (e) {
            console.error("Logout request failed", e);
        } 
    }
}