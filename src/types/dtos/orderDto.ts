import { Tablet } from "../models"; 
import { User } from "../models"; 
import { OrderProductDto } from "./orderProductDto";

export interface OrderDto {
    OrganizationId: string,
    SessionId: string,
    UserId: string,
    User: User | null,
    TabletId: string,
    Tablet: Tablet | null,
    TotalPrice: number,
    OrderProducts: OrderProductDto[],
}
