export type OrderProduct = {
    id: string,
    orderId: string,
    productId: string,
    campaignProductId?: string,
    totalPrice: number,
    created: Date,
}
