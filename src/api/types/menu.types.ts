export type Menu = {
    id: string,
    organizationId: string,
    name: string,
    enabled: boolean,
    categories: string,
    topmostCategory?: boolean,
    patternStartTime?: Date,
    patternEndTime?: Date,
    eventStartTime?: Date,
    eventEndTime?: Date,
    created: Date,
}
