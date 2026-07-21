import { OrderProductTopping } from "./orderProductTopping";
import { Product } from "./product";
import { ProductExcludable } from "./productExcludable";

export interface OrderProductExcludable {
    Id: string,
    OrderProductId: string,
    ProductExcludableId : string,
    ProductExcludable: ProductExcludable,
    Created: Date,
}