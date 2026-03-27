import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ORDER_PRODUCT_TOPPINGS } from '../queries/orderProductTopping.queries';
import { CREATE_ORDER_PRODUCT_TOPPING } from '../mutations/orderProductTopping.mutations';
import type { OrderProductTopping } from '../types';

// Query types
interface GetOrderProductToppingsData {
  order: {
    products: {
      id: string;
      toppings: OrderProductTopping[];
    }[];
  } | null;
}

interface GetOrderProductToppingsVars {
  orderId: string;
}

// Mutation types
interface CreateOrderProductToppingInput {
  orderProductId: string;
  toppingId: string;
  amount: number;
}

interface CreateOrderProductToppingData {
  createOrderProductTopping: OrderProductTopping;
}

interface CreateOrderProductToppingVars {
  input: CreateOrderProductToppingInput;
}

/**
 * Hook to fetch toppings for a specific order product
 * Used for: Displaying customizations on order items in receipts
 */
export const useGetOrderProductToppings = (orderId: string) => {
  return useQuery<GetOrderProductToppingsData, GetOrderProductToppingsVars>(
    GET_ORDER_PRODUCT_TOPPINGS,
    {
      variables: { orderId },
      skip: !orderId,
    }
  );
};

/**
 * Hook to add a topping to an order product
 * Used for: Recording selected toppings when submitting customized items
 * Automatically refetches order product toppings after creation
 */
export const useCreateOrderProductTopping = () => {
  return useMutation<CreateOrderProductToppingData, CreateOrderProductToppingVars>(
    CREATE_ORDER_PRODUCT_TOPPING,
    {
      refetchQueries: [GET_ORDER_PRODUCT_TOPPINGS],
      awaitRefetchQueries: true,
    }
  );
};
