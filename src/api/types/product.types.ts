import { Dietary } from "./enums";

export type Product = {
    id: string,
    name: string,
    description?: string,
    organizationId: string,
    price: number,
    oldPrice?: number,
    toppings?: string,
    ingredients?: string,
    dietaries?: Dietary[],
    freeToppings: number,
    excludables?: string,
    imgUrl?: string,
    enabled: boolean,
    created: Date,
    ageRestricted: boolean,
}
