import { License } from "./license";
import { User } from "./user";

export interface Organization {
    Id: string,
    LicenseId: string | null,
    License: License | null,
    Users: User[],
    PrimaryUserId: string | null,
    PrimaryUser: User | null,
    Name: string,
    MaxUsers: number,
    Created: Date,
}
