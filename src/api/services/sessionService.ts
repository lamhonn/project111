import { api } from "../axios";
import { Session } from "../../types";

const baseUrl = "/sessions";

export const SessionService = {
    create: async (session: Session) => {
        const { data } = await api.post<Omit<Session, "id">>(baseUrl, session);
        return data;
    },

    // TODO: end session
}