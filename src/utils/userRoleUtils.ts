import { UserRole } from "../types/enums";

export function parseUserRole(role?: string): UserRole {
    switch (role) {
        case 'TABLET':
            return UserRole.TABLET;
        case 'RESTAURANT_STAFF':
            return UserRole.RESTAURANT_STAFF;
        case 'RESTAURANT_MANAGER':
            return UserRole.RESTAURANT_MANAGER;
        case 'SUPERUSER':
            return UserRole.SUPERUSER;
        case 'UNKNOWN':
        default:
            return UserRole.UNKNOWN;
    }
}