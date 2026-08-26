import { atom } from "jotai";
import { SessionDto } from "../types/dtos";
import { SessionStatus } from "../types/enums/sessionStatus";
import { OrderViewModel } from "../types/viewModels/orderViewModel";
import { BillViewModel } from "../types/viewModels/billViewModel";
import { SessionService } from "../api/services/sessionService";
import { organizationIdAtom, tabletIdAtom, userIdAtom } from "./authStore";
import { BillStatus } from "../types/enums/billStatus";
import { atomWithStorage } from "jotai/utils";

// TODO: persist in storage for session recovery?
export const currentSessionAtom = atomWithStorage<SessionDto | null>("session", null); 

export const sessionStatusAtom = atom<SessionStatus>(SessionStatus.WELCOME);

export const sessionOrdersAtom = atom<OrderViewModel[]>([]); 

export const setStartSessionAtom = atom(
    null,
    async (get, set) => {
        const organizationId = get(organizationIdAtom);
        const tabletId = get(tabletIdAtom);
        const userId = get(userIdAtom);
    
        if (!organizationId || !tabletId || !userId) return;

        const newSession: SessionDto = {
            Id: crypto.randomUUID(),
            OrganizationId: organizationId, 
            UserId: userId,
            TabletId: tabletId
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
            ? { ...bill, Status: BillStatus.REQUESTED }
            : bill
        );

        set(billsAtom, updatedBills);

        // TODO: websocket that resets session status
        set(sessionStatusAtom, SessionStatus.BILL_REQUESTED);

        // TODO: bill endpoints
        
        if (updatedBills.filter(bill => !bill.Status).length === 0) {
            set(setEndSessionAtom);
        }
    }
);

export const saveBillsAtom = atom(
    null,
    (get, set, bills: BillViewModel[]) => {
        set(billsAtom, bills);
    } 
);