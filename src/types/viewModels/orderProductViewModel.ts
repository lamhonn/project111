import { ProductExcludable, ProductTopping } from "../models";

// used for frontend purposes only
export interface OrderProductViewModel {
    Id: string, // This does not persist into DB
    ProductId: string,
    Name: string, // JSON string with multilingual object
    ImgUrl?: string,
    Price: number,
    ProductToppings: ProductTopping[], // Store name and number. NOTE: As of now, saves multiple toppings as duplicates, e.g. [{ Id: 1, Name: Tomato }, { Id: 1, Name: Tomato }, ...]
    ProductExcludables: ProductExcludable[] // Store namess of the excludables
}