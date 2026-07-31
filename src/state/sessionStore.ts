import { atom } from "jotai";
import { SessionDto } from "../types/dtos";
import { SessionStatus } from "../types/enums/sessionStatus";
import { OrderViewModel } from "../types/viewModels/orderViewModel";
import { BillViewModel } from "../types/viewModels/billViewModel";
import { SessionService } from "../api/services/sessionService";

export const currentSessionAtom = atom<SessionDto | null>(null); 

export const sessionStatusAtom = atom<SessionStatus>(SessionStatus.WELCOME);

export const sessionOrdersAtom = atom<OrderViewModel[]>([]); 

// TODO: persist in storage?
export const setStartSessionAtom = atom(
    null,
    async (get, set) => {
        const newSession: SessionDto = {
            Id: crypto.randomUUID(),
            OrganizationId: "sometoken", // TODO: derive from token
            UserId: "sometoken", //TODO: derive from token
            TabletId: "sometoken" //TODO: derife from token
        }

        set(currentSessionAtom, newSession)

        await SessionService.create(newSession);
    }
);

export const setEndSessionAtom = atom(
    null,
    async (get, set) => {
        try {
            const currentSession = get(currentSessionAtom);
    
            if (currentSession) {
                set(currentSessionAtom, null);
                set(sessionStatusAtom, SessionStatus.BILL_REQUESTED);
                await SessionService.endSession(currentSession);
            }
        }
        catch (error) {
            console.error("Error setting end session:", error);
        }
    }
);

export const setSessionStateWelcomeAtom = atom(
    null,
    (get, set) => {
        set(sessionStatusAtom, SessionStatus.WELCOME);
    }
);

export const billsAtom = atom<BillViewModel[]>([]);

export const setBillsRequestedAtom = atom(
    null,
    (get, set, billIds: string[] ) => {
        const bills = get(billsAtom);

        const updatedBills = bills.map(bill =>
            billIds.includes(bill.Id)
            ? { ...bill, Billed: true }
            : bill
        );

        set(billsAtom, updatedBills);

        // TODO: request bills query
    }
);

export const saveBillsAtom = atom(
    null,
    (get, set, bills: BillViewModel[]) => {
        set(billsAtom, bills);
    } 
);