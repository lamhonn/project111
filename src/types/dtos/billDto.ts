import { BillStatus } from "../enums/billStatus";
import { OrderProductDto } from "./orderProductDto";

export interface BillDto {
    Id: string,
    SessionId: string,
    Name: string,
    Status: BillStatus,
    OrderProducts: OrderProductDto[],
    TotalPrice: number,
}