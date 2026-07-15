import { MenuCategory } from "./menuCategory"
import { Product } from "./product"

export type MenuProduct = {
    Id: string,
    MenuId: string,
    ProductId: string,
    Product: Product,
    MenuCategoryId: string,
    MenuCategory: MenuCategory,
    Created: Date
}
