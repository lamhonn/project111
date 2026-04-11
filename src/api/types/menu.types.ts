export type Menu = {
    id: string,
    organizationId: string,
    name: string,
    enabled: boolean,
    categories: string,
    patternStartTime?: Date,
    patternEndTime?: Date,
    eventStartTime?: Date,
    eventEndTime?: Date,
    created: Date,
}
