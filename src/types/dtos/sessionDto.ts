export interface SessionDto {
    Id: string,
    OrganizationId: string,
    UserId: string,
    StartTime: Date,
    EndTime: Date | null,
}