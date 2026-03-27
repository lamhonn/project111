import { UserRole } from "./enums"

export type User = {
    id: string,
    organizationId: string,
    login: string,
    email: string,
    role: UserRole,
    created: Date,
}
