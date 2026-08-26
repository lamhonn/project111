import { BillStatus } from "../enums/billStatus";

export interface BillViewModel {
    Id: string,
    Name: string,
    Status: BillStatus,
    OrderProducts: string[] // array of OrderProductViewModel IDs
}