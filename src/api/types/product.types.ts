import { Dietary } from "./enums";

export type Product = {
    Id: string,
    Name: string,
    Description?: string,
    OrganizationId: string,
    Price: number,
    OldPrice?: number,
    Toppings?: string, // JSON string array of topping objects
    Ingredients?: string, // JSON string with multilingual object
    Dietaries?: Dietary[], // Array of Dietary enum values (integers)
    FreeToppings: number,
    Excludables?: string, // JSON string array of multilingual excludable ingredient objects
    ImgUrl?: string,
    Enabled: boolean,
    Created: Date,
    AgeRestrictied: boolean,
}
