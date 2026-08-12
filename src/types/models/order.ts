import { OrderStatus } from "../enums/orderStatus";
import { OrderProduct } from "./orderProduct";
import { Tablet } from "./tablet";
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
    OrderStatus: OrderStatus,
    OrderProducts: OrderProduct[],
    Created: Date
}
