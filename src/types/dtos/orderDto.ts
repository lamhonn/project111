import { OrderStatus } from "../enums/orderStatus";
import { OrderProductDto } from "./orderProductDto";

export interface OrderDto {
    Id: string,
    OrganizationId: string,
    SessionId: string,
    UserId: string,
    TabletId: string,
    TotalPrice: number,
    OrderStatus: OrderStatus,
    OrderProducts: OrderProductDto[],
}
