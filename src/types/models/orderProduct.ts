import { OrderProductExcludable } from "./orderProductExcludables";
import { OrderProductTopping } from "./orderProductTopping";
import { Product } from "./product";

export interface OrderProduct {
    Id: string,
    OrderId: string,
    ProductId: string,
    Product: Product,
    OrderProductToppings: OrderProductTopping[],
    OrderProductExcludables: OrderProductExcludable[],
    Created: Date,
}
