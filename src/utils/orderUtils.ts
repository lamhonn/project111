import { OrderProductViewModel } from "../types/viewModels/orderProductViewModel";

export function calculateTotalOrderPrice(orderProducts: OrderProductViewModel[]): number {
    const totalPrice =  orderProducts.reduce(((total, product) => total + product.Price), 0);
    return totalPrice;
}