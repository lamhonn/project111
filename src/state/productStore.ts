import { atom } from 'jotai';
import { Product } from '../types/models';
import { ProductService } from '../api/services/productService';
import { orderProductsAtom } from './orderStore';
import { OrderProductViewModel } from '../types/viewModels/orderProductViewModel';

export const productsAtom = atom<Product[]>([]);

export const loadingAtom = atom(false); 

export const selectedProductIdAtom = atom<string>('');

export const selectedProductAtom = atom<Product | null>(null);

export const errorAtom = atom<string | null>(null);

export const getProductById = atom(
    (get) => {
        const productId = get(selectedProductIdAtom);
        if (!productId) return null;

        return get(productsAtom).find(product => product.Id === productId) || null;
    },
    async (get, set) => {
        const productId = get(selectedProductIdAtom);
        if (!productId) return null;

        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const response = await ProductService.getById(get(selectedProductIdAtom));

            const existingProducts = get(productsAtom);
            const productExists = existingProducts.some(product => product.Id === response.Id);
            if (!productExists) {
                set(productsAtom, [...existingProducts, response]);
            }
            else if (existingProducts.some(product => product.Id === response.Id && product !== response)) {
                // update the array if some product has been modified
                set(productsAtom, existingProducts.map(product => product.Id === response.Id && product === response ? response : product))
            }
            set(selectedProductAtom, response);   
        } 
        catch (error) {
            set(errorAtom, "Error fetching product");
        } 
        finally {
            set(loadingAtom, false);
        }
    }
);

export const addProductToOrderAtom = atom(
    null, 
    (get, set, { 
        product, 
        totalPrice, 
        selectedToppings, 
        selectedExcludables 
    }: { 
        product: Product, 
        totalPrice: number, 
        selectedToppings: any[], 
        selectedExcludables: any[] 
    }) => {
        const orderProduct: OrderProductViewModel = {
            Id: crypto.randomUUID(), // NOTE: will also be persisted to DB, contrary to the nature of ViewModel objects
            ProductId: product.Id,
            Name: product.Name,
            ImgUrl: product.ImgUrl,
            Price: totalPrice,
            ProductToppings: selectedToppings,
            ProductExcludables: selectedExcludables,
        };

        set(orderProductsAtom, (prev) => [...prev, orderProduct]);
    }
);