export type CampaignProduct = {
    Id: string,
    CampaignId: string,
    Description?: string,
    Name?: string,
    ProductId: string,
    LimitedDuration: boolean,
    StartDate?: Date,
    EndDate?: Date,
    CampaignPrice?: number,
    DiscountRate?: number,
    Enabled: boolean,
    Created: Date,
}
