import { atom } from 'jotai';
import { OrderProductViewModel } from '../types/viewModels/orderProductViewModel';
import { OrderStatus } from '../types/enums/orderStatus';

export const orderProductsAtom = atom<OrderProductViewModel[]>([]); 

export const orderStatusAtom = atom<Record<string, OrderStatus>>({}); 

// TODO: maybe add separate atom for actual orders on top of viewmodels?