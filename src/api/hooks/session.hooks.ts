import { useMutation } from '@apollo/client/react';
import { REQUEST_BILL, START_DINING_SESSION } from '../mutations/session.mutations';

export interface DiningSession {
  sessionId: string;
  tabletId: string;
  tableNumber: number;
  organizationId: string;
  orderId?: string;
  orderStatus?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

interface StartDiningSessionData {
  startDiningSession: {
    code: string;
    success: boolean;
    message: string;
    session: DiningSession | null;
  };
}

interface StartDiningSessionVars {
  input: {
    tabletId: string;
    tableNumber: number;
    organizationId: string;
  };
}

interface RequestBillData {
  requestBill: {
    code: string;
    success: boolean;
    message: string;
  };
}

interface RequestBillVars {
  input: {
    sessionId: string;
    message?: string;
  };
}

export const useStartDiningSession = () => {
  return useMutation<StartDiningSessionData, StartDiningSessionVars>(START_DINING_SESSION);
};

export const useRequestBill = () => {
  return useMutation<RequestBillData, RequestBillVars>(REQUEST_BILL);
};
