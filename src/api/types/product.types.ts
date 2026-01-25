export type Product = {
    Id: string,
    OrganizationId: string,
    Name: string,
    Description?: string,
    Price: number,
    Ingredients?: string, // JSON string with multilingual object
    Dietaries?: number[], // Array of Dietary enum values (integers)
    ImgUrl?: string,
    Enabled: boolean,
    Created: Date,
    AgeRestrictied: boolean,
    Toppings?: string, // JSON string array of topping objects
    Excludables?: string, // JSON string array of multilingual excludable ingredient objects
}
