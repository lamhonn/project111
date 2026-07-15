import { Organization } from "./organization";

export interface License {
    Id: string,
    OrganizationId: string,
    Organization: Organization,
    MaxUsers: number,
    Expires: Date,
    Enabled: boolean,
    Created: Date,
}