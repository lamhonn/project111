import { MenuCategory } from "./menuCategory";
import { MenuProduct } from "./menuProduct";

export interface Menu {
    Id: string,
    OrganizationId: string,
    Enabled: boolean,
    Name: string,
    PatternStartTime: Date | null,
    PatternEndTime: Date | null,
    EventStartTime: Date | null,
    EventEndTime: Date | null,
    MenuCategories: MenuCategory[],
    MenuProducts: MenuProduct[],
    Created: Date,
}
