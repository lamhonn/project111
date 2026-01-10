export type Product = {
    Id: string,
    OrganizationId: string,
    Name: string,
    Description?: string,
    Price: number,
    Ingredients?: string[],
    Dieataries?: string[],
    ImgUrl?: string,
    Enabled: boolean,
    Created: Date,
    AgeRestrictied: boolean,
}
