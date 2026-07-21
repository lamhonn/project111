import { ProductExcludable, ProductTopping } from "../models";

// used for frontend purposes only
export interface OrderProductViewModel {
    ProductId: string,
    Name: string, // JSON string with multilingual object
    Price: number,
    ProductToppings: Record<string, number>, // Store id and number
    ProductExcludables: Set<string>, // Store ids of the excludables
}