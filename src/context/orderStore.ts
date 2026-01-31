import { atom } from 'jotai';
import { OrderStatus } from '../components/header/MenuHeader';

export interface Topping {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string; // Base product ID
  name: string;
  image: string;
  price: number;
  quantity: number;
  toppings?: Topping[];
  excludables?: string[]; // Array of excluded ingredient names
  orderStatus?: 'received' | 'preparing' | 'ready'; // Track which order this item belongs to and its status
  orderId?: string; // Track the source order ID for items in preparing/received state
}

// Helper function to generate unique ID for items with toppings and excludables
const generateItemId = (productId: string, toppings?: Topping[], excludables?: string[]): string => {
  if ((!toppings || toppings.length === 0) && (!excludables || excludables.length === 0)) {
    return productId; // Vanilla items use just product ID
  }
  // Create a unique ID based on product, toppings, and excludables
  const toppingSignature = toppings
    ? toppings.map(t => `${t.id}:${t.quantity}`).sort().join('|')
    : '';
  const excludablesSignature = excludables
    ? excludables.sort().join('|')
    : '';
  return `${productId}_${toppingSignature}_${excludablesSignature}`;
};

// Helper function to check if two topping arrays are the same
// const areToppingsEqual = (toppings1?: Topping[], toppings2?: Topping[]): boolean => {
//   if (!toppings1 && !toppings2) return true;
//   if (!toppings1 || !toppings2) return false;
//   if (toppings1.length !== toppings2.length) return false;
  
//   const sorted1 = [...toppings1].sort((a, b) => a.id.localeCompare(b.id));
//   const sorted2 = [...toppings2].sort((a, b) => a.id.localeCompare(b.id));
  
//   return sorted1.every((t1, idx) => {
//     const t2 = sorted2[idx];
//     return t1.id === t2.id && t1.quantity === t2.quantity;
//   });
// };

// Atomic states
export const orderItemsAtom = atom<OrderItem[]>([]);

export const orderNumberAtom = atom<string>('#219021');

export const tableNumberAtom = atom<string | number>('12');

export const orderStatusAtom = atom<OrderStatus | null>(null);

export const billRequestedAtom = atom<boolean>(false);

export const tableLockedAtom = atom<boolean>(false);

// Session state tracking
export enum SessionState {
  Welcome = 'welcome',      // Initial welcome screen
  Active = 'active',        // Session is active (dining/ordering)
  Ended = 'ended',          // Session ended (showing thank you)
}

export const sessionStateAtom = atom<SessionState>(SessionState.Welcome);

export const languageAtom = atom<string>('en'); // ISO language codes: 'en', 'fi', 'sv'

// Split Bill Types and State
export enum BillStatus {
  Active = 'active',      // Bill is active and can be modified
  Requested = 'requested', // Bill has been requested/sent to waiter
}

export interface SplitBill {
  id: string;
  items: OrderItem[];
  status: BillStatus;
}

export interface BillSplitConfiguration {
  bills: SplitBill[];
  unsplitItems: OrderItem[]; // Items not assigned to any bill
}

// State for split bills configuration
export const billSplitConfigurationAtom = atom<BillSplitConfiguration | null>(null);

// Atom to save bill split configuration
export const saveBillSplitAtom = atom(
  null,
  (get, set, config: BillSplitConfiguration | null) => {
    set(billSplitConfigurationAtom, config);
  }
);

// Atom to clear bill split configuration
export const clearBillSplitAtom = atom(
  null,
  (get, set) => {
    set(billSplitConfigurationAtom, null);
  }
);

// Atom to mark bills as requested
export const markBillsAsRequestedAtom = atom(
  null,
  (get, set, billIds: string[]) => {
    const currentConfig = get(billSplitConfigurationAtom);
    if (!currentConfig) return;

    const updatedBills = currentConfig.bills.map(bill =>
      billIds.includes(bill.id)
        ? { ...bill, status: BillStatus.Requested }
        : bill
    );

    set(billSplitConfigurationAtom, {
      ...currentConfig,
      bills: updatedBills,
    });
  }
);

// Atom to reset all state back to initial values
export const resetAppStateAtom = atom(
  null,
  (get, set) => {
    set(orderItemsAtom, []);
    set(totalOrderItemsAtom, []);
    set(submittedOrdersAtom, []);
    set(orderStatusAtom, null);
    set(billRequestedAtom, false);
    set(tableLockedAtom, false);
    set(languageAtom, 'en');
    set(billSplitConfigurationAtom, null);
    set(sessionStateAtom, SessionState.Welcome); // Reset to welcome screen
  }
);

// Atom to start a new session
export const startSessionAtom = atom(
  null,
  (get, set) => {
    set(sessionStateAtom, SessionState.Active);
  }
);

// Derived atoms
export const orderCountAtom = atom((get) => {
  const items = get(orderItemsAtom);
  return items.reduce((count, item) => count + item.quantity, 0);
});

export const totalPriceAtom = atom((get) => {
  const items = get(orderItemsAtom);
  return items.reduce((total, item) => {
    const itemBasePrice = item.price * item.quantity;
    const toppingsPrice = item.toppings
      ? item.toppings.reduce((sum, topping) => sum + (topping.price * topping.quantity), 0)
      : 0;
    return total + itemBasePrice + toppingsPrice;
  }, 0);
});

// Write atoms for managing order items
export const addOrderItemAtom = atom(
  null,
  (get, set, item: OrderItem) => {
    const currentItems = get(orderItemsAtom);
    const itemId = generateItemId(item.productId, item.toppings, item.excludables);
    const existingItemIndex = currentItems.findIndex(i => i.id === itemId);
    
    if (existingItemIndex >= 0) {
      // Item with same product, toppings, and excludables exists, update quantity
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + item.quantity,
      };
      set(orderItemsAtom, updatedItems);
    } else {
      // New item (or same product with different toppings/excludables), add to array
      const newItem = {
        ...item,
        id: itemId,
      };
      set(orderItemsAtom, [...currentItems, newItem]);
    }
  }
);

export const removeOrderItemAtom = atom(
  null,
  (get, set, itemId: string) => {
    const currentItems = get(orderItemsAtom);
    set(orderItemsAtom, currentItems.filter(item => item.id !== itemId));
  }
);

export const updateOrderItemQuantityAtom = atom(
  null,
  (get, set, { itemId, quantity }: { itemId: string; quantity: number }) => {
    const currentItems = get(orderItemsAtom);
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      set(orderItemsAtom, currentItems.filter(item => item.id !== itemId));
    } else {
      const updatedItems = currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      set(orderItemsAtom, updatedItems);
    }
  }
);

export const clearOrderAtom = atom(
  null,
  (get, set) => {
    set(orderItemsAtom, []);
  }
);

// State for tracking all submitted orders (for total receipt)
export const totalOrderItemsAtom = atom<OrderItem[]>([]);

// Individual order with status tracking
export interface SubmittedOrder {
  id: string;
  items: OrderItem[];
  status: 'received' | 'preparing' | 'ready';
  timestamp: Date;
}

// Atom to track all submitted orders with their statuses
export const submittedOrdersAtom = atom<SubmittedOrder[]>([]);

// Atom to update order status
export const updateOrderStatusAtom = atom(
  null,
  (get, set, { orderId, status }: { orderId: string; status: 'received' | 'preparing' | 'ready' }) => {
    const orders = get(submittedOrdersAtom);
    
    // Update order status in submitted orders
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { 
        ...order, 
        status,
        items: order.items.map(item => ({ ...item, orderStatus: status }))
      } : order
    );
    set(submittedOrdersAtom, updatedOrders);
    
    // Also update items in bill split configuration if they exist
    const billSplitConfig = get(billSplitConfigurationAtom);
    if (billSplitConfig) {
      const updateItemsStatus = (items: OrderItem[]) => 
        items.map(item => 
          item.orderId === orderId ? { ...item, orderStatus: status } : item
        );
      
      const updatedConfig = {
        ...billSplitConfig,
        bills: billSplitConfig.bills.map(bill => ({
          ...bill,
          items: updateItemsStatus(bill.items),
        })),
        unsplitItems: updateItemsStatus(billSplitConfig.unsplitItems),
      };
      
      set(billSplitConfigurationAtom, updatedConfig);
    }
    
    // When an order becomes ready, move its items to totalOrderItems and remove from submittedOrders
    if (status === 'ready') {
      const readyOrder = updatedOrders.find(order => order.id === orderId);
      if (readyOrder) {
        const currentTotalItems = get(totalOrderItemsAtom);
        const mergedItems = [...currentTotalItems];
        
        // Merge ready order items into total items, removing order tracking
        readyOrder.items.forEach(item => {
          const { orderId: _, orderStatus: __, ...itemWithoutOrderTracking } = item;
          const existingItemIndex = mergedItems.findIndex(i => i.id === itemWithoutOrderTracking.id);
          if (existingItemIndex >= 0) {
            mergedItems[existingItemIndex] = {
              ...mergedItems[existingItemIndex],
              quantity: mergedItems[existingItemIndex].quantity + itemWithoutOrderTracking.quantity,
            };
          } else {
            mergedItems.push(itemWithoutOrderTracking);
          }
        });
        
        set(totalOrderItemsAtom, mergedItems);
        // Remove the ready order from submitted orders
        set(submittedOrdersAtom, updatedOrders.filter(order => order.id !== orderId));
      }
    }
  }
);

// Derived atom for total order count (includes both ready items and items in submitted orders)
export const totalOrderCountAtom = atom((get) => {
  const readyItems = get(totalOrderItemsAtom);
  const submittedOrders = get(submittedOrdersAtom);
  
  const readyCount = readyItems.reduce((count, item) => count + item.quantity, 0);
  const submittedCount = submittedOrders.reduce((total, order) => {
    return total + order.items.reduce((count, item) => count + item.quantity, 0);
  }, 0);
  
  return readyCount + submittedCount;
});

// Derived atom for total order price (includes both ready items and items in submitted orders)
export const totalOrderPriceAtom = atom((get) => {
  const readyItems = get(totalOrderItemsAtom);
  const submittedOrders = get(submittedOrdersAtom);
  
  const calculateItemsPrice = (items: OrderItem[]) => {
    return items.reduce((total, item) => {
      const itemBasePrice = item.price * item.quantity;
      const toppingsPrice = item.toppings
        ? item.toppings.reduce((sum, topping) => sum + (topping.price * topping.quantity), 0)
        : 0;
      return total + itemBasePrice + toppingsPrice;
    }, 0);
  };
  
  const readyPrice = calculateItemsPrice(readyItems);
  const submittedPrice = submittedOrders.reduce((total, order) => {
    return total + calculateItemsPrice(order.items);
  }, 0);
  
  return readyPrice + submittedPrice;
});

// Atom to submit current order items to total order
export const submitOrderToTotalAtom = atom(
  null,
  (get, set) => {
    const currentItems = get(orderItemsAtom);
    
    if (currentItems.length === 0) return;
    
    // Create a new order with unique ID
    const orderId = `order-${Date.now()}`;
    
    // Mark items with their order ID and status
    const itemsWithStatus = currentItems.map(item => ({
      ...item,
      orderId,
      orderStatus: 'received' as const,
    }));
    
    const newOrder: SubmittedOrder = {
      id: orderId,
      items: itemsWithStatus,
      status: 'received',
      timestamp: new Date(),
    };
    
    // Add to submitted orders
    const currentSubmittedOrders = get(submittedOrdersAtom);
    set(submittedOrdersAtom, [...currentSubmittedOrders, newOrder]);
    
    // Clear current order after submitting
    set(orderItemsAtom, []);
    // Set order status to Received
    set(orderStatusAtom, OrderStatus.Received);
    
    // Return the order ID so we can track status updates
    return newOrder.id;
  }
);
