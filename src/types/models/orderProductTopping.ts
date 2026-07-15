import { ProductTopping } from "./productTopping";

export interface OrderProductTopping {
    Id: string,
    OrderProductId: string,
    ProductToppingId: string,
    ProductTopping: ProductTopping,
    Created: Date
}
