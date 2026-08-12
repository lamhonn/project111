import { MenuProduct } from "../models";

export interface MenuCategoryViewModel {
    Id: string,
    Name: string,
    Products: MenuProduct[]
}