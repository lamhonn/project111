import { gql } from '@apollo/client';

export const ORDER_STATUS_CHANGED_SUBSCRIPTION = gql`
  subscription OrderStatusChanged($tabletId: ID!) {
    orderStatusChanged(tabletId: $tabletId) {
      orderId
      tabletId
      tableNumber
      organizationId
      previousStatus
      newStatus
      timestamp
      message
    }
  }
`;

export const ORGANIZATION_ORDER_STATUS_CHANGED_SUBSCRIPTION = gql`
  subscription OrganizationOrderStatusChanged($organizationId: ID!) {
    organizationOrderStatusChanged(organizationId: $organizationId) {
      orderId
      tabletId
      tableNumber
      organizationId
      previousStatus
      newStatus
      timestamp
      message
    }
  }
`;

export const NEW_ORDER_NOTIFICATION_SUBSCRIPTION = gql`
  subscription NewOrderNotification($tabletId: ID!) {
    newOrderNotification(tabletId: $tabletId) {
      orderId
      tabletId
      tableNumber
      organizationId
      totalPrice
      productCount
      timestamp
    }
  }
`;
