import { atom } from "jotai";
import { SessionDto } from "../types/dtos";
import { randomUUID } from "crypto";
import { SessionStatus } from "../types/enums/sessionStatus";

export const currentSessionAtom = atom<SessionDto | null>(null); 

export const sessionStatusAtom = atom<SessionStatus>(SessionStatus.WELCOME);

export const waiterRequestedAtom = atom<boolean>(false);

export const setStartSession = atom(
    null,
    (get, set) => {
        const newSession: SessionDto = {
            Id: randomUUID(),
            OrganizationId: "sometoken", // TODO: derive from token
            UserId: "sometoken", //TODO: derive from token
            TabletId: "sometoken" //TODO: derife from token
        }

        set(currentSessionAtom, newSession)
    }
);