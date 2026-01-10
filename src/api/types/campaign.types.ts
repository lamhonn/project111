export type Campaign = {
    Id: string,
    OrganizationId: string,
    MenuId: string,
    Name?: string,
    Description?: string,
    LimitedDuration: boolean,
    StartDate?: Date,
    EndDate?: Date,
    Enabled: boolean,
    Created: Date,
}
