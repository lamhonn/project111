import { useQuery, useMutation } from '@apollo/client/react';
import { GET_TABLE_ORDERS, GET_ORDER_BY_ID } from '../queries/order.queries';
import { CREATE_ORDER } from '../mutations/order.mutations';
import type { Order } from '../types';

// Query types
interface GetTableOrdersData {
  ordersByTablet: Order[];
}

interface GetTableOrdersVars {
  tabletId: string;
}

interface GetOrderByIdData {
  order: Order;
}

interface GetOrderByIdVars {
  id: string;
}

// Mutation types
interface CreateOrderInput {
  OrganizationId: string;
  TotalPrice: string;
  TabletId: string;
  TableNumber: number;
}

interface CreateOrderData {
  createOrder: Order;
}

interface CreateOrderVars {
  input: CreateOrderInput;
}

/**
 * Hook to fetch all orders for a table
 * Used for: Displaying order history, tracking table's orders
 */
export const useGetTableOrders = (tabletId: string) => {
  return useQuery<GetTableOrdersData, GetTableOrdersVars>(GET_TABLE_ORDERS, {
    variables: { tabletId },
    skip: !tabletId,
  });
};

/**
 * Hook to fetch a specific order by ID
 * Used for: Order detail view, order confirmation
 */
export const useGetOrderById = (id: string) => {
  return useQuery<GetOrderByIdData, GetOrderByIdVars>(GET_ORDER_BY_ID, {
    variables: { id },
    skip: !id,
  });
};

/**
 * Hook to create a new order
 * Used for: Submitting customer order from cart
 * Automatically refetches table orders after creation
 */
export const useCreateOrder = () => {
  return useMutation<CreateOrderData, CreateOrderVars>(CREATE_ORDER, {
    refetchQueries: [GET_TABLE_ORDERS],
    awaitRefetchQueries: true,
  });
};
