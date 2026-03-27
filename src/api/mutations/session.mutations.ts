import { gql } from '@apollo/client';

export const START_DINING_SESSION = gql`
  mutation StartDiningSession($input: StartDiningSessionInput!) {
    startDiningSession(input: $input) {
      code
      success
      message
      session {
        sessionId
        tabletId
        tableNumber
        organizationId
        orderId
        orderStatus
        totalOrders
        totalSpent
        createdAt
        updatedAt
      }
    }
  }
`;

export const REQUEST_BILL = gql`
  mutation RequestBill($input: RequestBillInput!) {
    requestBill(input: $input) {
      code
      success
      message
    }
  }
`;
