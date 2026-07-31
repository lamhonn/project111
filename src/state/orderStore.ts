import { atom } from 'jotai';
import { OrderProductViewModel } from '../types/viewModels/orderProductViewModel';
import { OrderDto } from '../types/dtos/orderDto';
import { billsAtom, currentSessionAtom } from './sessionStore';
import { calculateTotalOrderPrice } from '../utils/orderUtils';
import { OrderProductDto } from '../types/dtos/orderProductDto';
import { OrderProductExcludableDto } from '../types/dtos/orderProductExcludableDto';
import { OrderProductToppingDto } from '../types/dtos/orderProductToppingDto';
import { OrderService } from '../api/services/orderService';
import { BillViewModel } from '../types/viewModels/billViewModel';
import { organizationIdAtom, tabletIdAtom, userIdAtom } from './authStore';

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

export const orderProductsAtom = atom<OrderProductViewModel[]>([]); 

export const createOrderLoadingAtom = atom<boolean>(false);
export const createOrderErrorAtom = atom<boolean>(false);

export const createOrderAtom = atom(
    null,
    async (get, set) => {
        set(createOrderErrorAtom, false);
        set(createOrderLoadingAtom, true);
        try {
            const sessionId = get(currentSessionAtom)?.Id;
            const orderProductsViewModel = get(orderProductsAtom);
            const totalPrice = calculateTotalOrderPrice(orderProductsViewModel);

            const organizationId = get(organizationIdAtom);
            const tabletId = get(tabletIdAtom);
            const userId = get(userIdAtom);
        
            const orderProducts: OrderProductDto[] = get(orderProductsAtom).map(viewModel => <OrderProductDto>{
                Id: viewModel.Id,
                ProductId: viewModel.ProductId,
                Name: viewModel.Name,
                OrderProductToppings: viewModel.ProductToppings.map(topping => <OrderProductToppingDto>{
                    Id: topping.Id,
                    OrderProductId: viewModel.Id,
                    ProductToppingId: topping.Id
                }),
                OrderProductExcludables: viewModel.ProductExcludables.map(excludable => <OrderProductExcludableDto>{
                    Id: excludable.Id,
                    OrderProductId: viewModel.Id,
                    ProductExcludableId: excludable.Id
                }),
                Price: totalPrice
            });
        
            if (sessionId && organizationId && tabletId && userId) {
                const newOrder: OrderDto = {
                    Id: crypto.randomUUID(),
                    OrganizationId: organizationId,
                    UserId: userId,
                    TabletId: tabletId,
                    SessionId: sessionId,
                    TotalPrice: totalPrice, // NOTE: total price including toppings
                    OrderProducts: orderProducts
                }

                await OrderService.create(newOrder);

                // Update the first bill's (i.e. "default bill") items
                // TODO: consider creating a write-only atom to sessionStore instead
                const bills: BillViewModel[] = get(billsAtom);

                const mainBill = bills.find(bill => bill.Id === EMPTY_GUID);

                if (mainBill) {
                    const updatedMainBill: BillViewModel = {
                        ...mainBill,
                        OrderProducts: [
                            ...mainBill.OrderProducts,
                            ...orderProducts.map(op => op.Id)
                        ]
                    };

                    const updatedBills = bills.map(bill => bill.Id === EMPTY_GUID ? updatedMainBill : bill)

                    set(billsAtom, updatedBills);
                }
                else {
                    const newDefaultBill: BillViewModel = {
                        Id: EMPTY_GUID,
                        Name: "DEFAULT", // TODO: translation?
                        Billed: false,
                        OrderProducts: orderProducts.map(orderProduct => orderProduct.Id)
                    }
                    set(billsAtom, [ newDefaultBill ]);
                }
            }
        }
        catch (error) {
            set(createOrderErrorAtom, true);
        }
        finally {
            set(createOrderLoadingAtom, false);
        }
    }
);

// TODO: maybe add separate atom for actual orders on top of viewmodels?