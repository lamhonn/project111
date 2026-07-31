export interface BillViewModel {
    Id: string,
    Name: string,
    Billed: boolean,
    OrderProducts: string[] // array of OrderProductViewModel IDs
}