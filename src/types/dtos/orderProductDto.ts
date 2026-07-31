import { OrderProductExcludableDto } from "./orderProductExcludableDto";
import { OrderProductToppingDto } from "./orderProductToppingDto";

export interface OrderProductDto {
    Id: string,
    ProductId: string,
    Name: string, // JSON string with multilingual object
    Price: number,
    OrderProductToppings: OrderProductToppingDto[],
    OrderProductExcludables: OrderProductExcludableDto[],
}