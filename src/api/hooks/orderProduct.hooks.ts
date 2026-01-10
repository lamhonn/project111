import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ORDER_PRODUCTS } from '../queries/orderProduct.queries';
import { CREATE_ORDER_PRODUCT } from '../mutations/orderProduct.mutations';
import type { OrderProduct } from '../types';

// Query types
interface GetOrderProductsData {
  orderProducts: OrderProduct[];
}

interface GetOrderProductsVars {
  orderId: string;
}

// Mutation types
interface CreateOrderProductInput {
  OrderId: string;
  ProductId: string;
  CampaignProductId?: string;
  TotalPrice: number;
}

interface CreateOrderProductData {
  createOrderProduct: OrderProduct;
}

interface CreateOrderProductVars {
  input: CreateOrderProductInput;
}

/**
 * Hook to fetch all products in an order
 * Used for: Displaying order details, receipt generation
 */
export const useGetOrderProducts = (orderId: string) => {
  return useQuery<GetOrderProductsData, GetOrderProductsVars>(GET_ORDER_PRODUCTS, {
    variables: { orderId },
    skip: !orderId,
  });
};

/**
 * Hook to add a product to an order
 * Used for: Adding items from cart to submitted order
 * Automatically refetches order products after creation
 */
export const useCreateOrderProduct = () => {
  return useMutation<CreateOrderProductData, CreateOrderProductVars>(CREATE_ORDER_PRODUCT, {
    refetchQueries: [GET_ORDER_PRODUCTS],
    awaitRefetchQueries: true,
  });
};
