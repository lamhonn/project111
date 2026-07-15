import { Order } from "./order";
import { User } from "./user";

export interface Session {
    Id: string,
    OrganizationId: string,
    UserId: string,
    User: User | null,
    StartTime: Date,
    EndTime: Date | null,
    Orders: Order[],
}