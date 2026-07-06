import { OrderProductExcludables } from "./orderProductExcludables";
import { OrderProductTopping } from "./orderProductTopping";
import { Product } from "./product";

export interface OrderProduct {
    Id: string,
    OrderId: string,
    ProductId: string,
    Product: Product,
    OrderProductToppings: OrderProductTopping[],
    OrderProductExcludables: OrderProductExcludables[],
    Created: Date,
}
