import { api } from "../axios";
import { SessionDto } from "../../types/dtos";

const baseUrl = "/sessions";

export const SessionService = {
    create: async (session: SessionDto) => {
        const { data } = await api.post<SessionDto>(baseUrl, session);
        return data;
    },

    // TODO: end session
}