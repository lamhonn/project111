import { Dietary } from "./enums";

export type Product = {
    id: string,
    name: string,
    description?: string,
    organizationId: string,
    price: number,
    toppings?: string,
    ingredients?: string,
    dietaries?: Dietary[],
    freeToppings: number,
    maxToppings: number,
    excludables?: string,
    imgUrl?: string | null,
    enabled: boolean,
    created: Date,
    ageRestricted: boolean,
}
