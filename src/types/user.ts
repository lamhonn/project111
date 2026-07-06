import { UserRole } from "./enums"
import { Organization } from "./organization"

export type User = {
    Id: string,
    OrganizationId: string,
    Organization: Organization,
    Login: string,
    Name: string,
    Password: string,
    Email: string,
    Role: UserRole // enum
    MaxDevices: number,
    Created: Date,
}
