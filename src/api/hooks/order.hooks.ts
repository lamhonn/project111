import { useQuery, useMutation, useSubscription } from '@apollo/client/react';
import { GET_TABLE_ORDERS, GET_ORDER_BY_ID } from '../queries/order.queries';
import { CREATE_ORDER } from '../mutations/order.mutations';
import {
  ORDER_STATUS_CHANGED_SUBSCRIPTION,
  ORGANIZATION_ORDER_STATUS_CHANGED_SUBSCRIPTION,
  NEW_ORDER_NOTIFICATION_SUBSCRIPTION,
} from '../subscriptions';
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
  organizationId: string;
  totalPrice: number;
  tabletId: string;
  tableNumber: number;
  products: {
    productId: string;
    campaignProductId?: string;
    totalPrice: number;
    toppings?: {
      toppingId: string;
      amount: number;
    }[];
  }[];
}

interface CreateOrderData {
  createOrder: {
    code: string;
    success: boolean;
    message: string;
    order: Order | null;
  };
}

interface CreateOrderVars {
  input: CreateOrderInput;
}

type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

interface OrderStatusUpdate {
  orderId: string;
  tabletId: string;
  tableNumber: number;
  organizationId: string;
  previousStatus?: OrderStatus;
  newStatus: OrderStatus;
  timestamp: string;
  message?: string;
}

interface NewOrderEvent {
  orderId: string;
  tabletId: string;
  tableNumber: number;
  organizationId: string;
  totalPrice: number;
  productCount: number;
  timestamp: string;
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

export const useOrderStatusChanged = (tabletId: string) => {
  return useSubscription<{ orderStatusChanged: OrderStatusUpdate }, { tabletId: string }>(
    ORDER_STATUS_CHANGED_SUBSCRIPTION,
    {
      variables: { tabletId },
      skip: !tabletId,
    },
  );
};

export const useOrganizationOrderStatusChanged = (organizationId: string) => {
  return useSubscription<
    { organizationOrderStatusChanged: OrderStatusUpdate },
    { organizationId: string }
  >(
    ORGANIZATION_ORDER_STATUS_CHANGED_SUBSCRIPTION,
    {
      variables: { organizationId },
      skip: !organizationId,
    },
  );
};

export const useNewOrderNotification = (tabletId: string) => {
  return useSubscription<{ newOrderNotification: NewOrderEvent }, { tabletId: string }>(
    NEW_ORDER_NOTIFICATION_SUBSCRIPTION,
    {
      variables: { tabletId },
      skip: !tabletId,
    },
  );
};
