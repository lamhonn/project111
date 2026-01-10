import { UserRole } from "./enums"

export type User = {
    Id: string,
    OrganizationId: string,
    Login: string,
    Password: string,
    Email: string,
    Role: UserRole // enum
    Created: Date,
}
