import { Dietary } from "../enums";
import { ProductExcludable } from "./productExcludable";
import { ProductTopping } from "./productTopping";

export interface Product {
    Id: string,
    OrganizationId: string,
    Name: string, // JSON string with multilingual object
    Description?: string, // JSON string with multilingual object
    Ingredients?: string // JSON string with multilingual object
    Price: number,
    Dietaries: Dietary[], // Array of Dietary enum values
    FreeToppings: number, // Number of toppings that can be added before PriceIncrement starts
    ProductToppings: ProductTopping[],
    ProductExcludables: ProductExcludable[],
    ImgUrl?: string,
    Created: Date,
}
