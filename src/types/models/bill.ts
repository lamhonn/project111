import { BillStatus } from "../enums/billStatus";
import { OrderProduct } from "./orderProduct";

export interface Bill {
    Id: string,
    SessionId: string,
    TabletId: string,
    Name: string,
    Status: BillStatus,
    OrderProducts: OrderProduct[],
    TotalPrice: number,
    Created: Date
}