// [NOT IMPLEMENTED] Order status subscription — WF-05 / WF-06
//
// useOrderConfirmation is the integration point for real-time order status updates.
// When implemented:
//   1. Ensure client.ts has a GraphQLWsLink (WF-06).
//   2. Subscribe to the orderStatusChanged GraphQL subscription for the given orderId.
//   3. Call onStatusChange when the backend emits a status event.
//   4. Return true once the backend confirms the order was received.

import { useCallback } from 'react';

export type OrderStatusCallback = (status: 'received' | 'preparing' | 'ready') => void;

export const useOrderConfirmation = () => {
  const confirmOrder = useCallback(async (
    _orderId?: string,
    _onStatusChange?: OrderStatusCallback,
  ): Promise<boolean> => {
    console.warn('[NOT IMPLEMENTED] order status subscription — orderStatusChanged not wired (WF-06)');
    return false;
  }, []);

  return { confirmOrder };
};
