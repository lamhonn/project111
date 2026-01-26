export type OrderProduct = {
    Id: string,
    OrderId: string,
    ProductId: string,
    CampaignProductId?: string,
    TotalPrice: number,
    Created: Date,
}
