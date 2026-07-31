import { OrderStatus } from "../enums/orderStatus";
import { OrderProductViewModel } from "./orderProductViewModel";

export interface OrderViewModel {
    Id: string, // TODO: temp id. Create a logic to fetch the id from database.
    OrganizationId: string,
    SessionId: string,
    UserId: string,
    TabletId: string,
    TotalPrice: number,
    OrderStatus: OrderStatus,
    OrderProducts: OrderProductViewModel[],
}