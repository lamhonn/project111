export type Product = {
    Id: string,
    OrganizationId: string,
    Name: string,
    Description?: string,
    Price: number,
    Ingredients?: string, // JSON string with multilingual object
    Dieataries?: string[],
    ImgUrl?: string,
    Enabled: boolean,
    Created: Date,
    AgeRestrictied: boolean,
    Toppings?: string, // JSON string array of topping objects
}
