import { OrderDto } from "../../types/dtos/orderDto";
import { api } from "../axios";

const baseUrl = "/orders";

export const OrderService = {
    create: async (order: OrderDto) => {
        const { data } = await api.post<OrderDto>(baseUrl, order);
        return data;
    }
}