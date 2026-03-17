export type Menu = {
    Id: string,
    OrganizationId: string,
    Name: string,
    Enabled: boolean,
    Categories: string,
    TopmostCategory?: boolean, // Whether this menu is the topmost category, e.g. "Campaigns" or "Seasonal"
    PatternStartTime?: Date, // For recurring patterns, the start time of the pattern, e.g. every weekday from 11am to 2pm, the pattern start time would be 11am
    PatternEndTime?: Date, // For recurring patterns, the end time of the pattern, e.g. every weekday from 11am to 2pm, the pattern end time would be 2pm
    EventStartTime?: Date, // For seasonal or one-time events, the start time of the event
    EventEndTime?: Date, // For seasonal or one-time events, the end time of the event
    Created: Date,
}
