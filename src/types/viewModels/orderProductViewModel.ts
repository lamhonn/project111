import { ProductExcludable, ProductTopping } from "../models";

// used for frontend purposes
export interface OrderProductViewModel {
    Id: string, 
    ProductId: string,
    Name: string, // JSON string with multilingual object
    ImgUrl?: string,
    Price: number, // Total price, including toppings, calculated in UI level
    ProductToppings: ProductTopping[], // Store name and number. NOTE: As of now, saves multiple toppings as duplicates, e.g. [{ Id: 1, Name: Tomato }, { Id: 1, Name: Tomato }, ...]
    ProductExcludables: ProductExcludable[] // Store namess of the excludables
}