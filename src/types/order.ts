import { OrderProduct } from "./orderProduct";
import { Tablet } from "./table";
import { User } from "./user";

export interface Order {
    Id: string,
    OrganizationId: string,
    SessionId: string,
    UserId: string,
    User: User | null,
    TabletId: string,
    Tablet: Tablet | null,
    TotalPrice: number,
    OrderProducts: OrderProduct[],
    Created: Date
}
