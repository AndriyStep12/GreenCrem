import {create} from 'zustand';
import Cookies from 'js-cookie';

const getCartItems = () => {
  const items = Cookies.get('cart');
  return items ? JSON.parse(items) : [];
};

const useCartStore = create((set) => ({
  carts: getCartItems().length,
  cartsIncrement: () => set((state) => ({ carts: state.carts + 1 })),
  cartsDecrement: () => set((state) => ({ carts: state.carts - 1 })),
  cartsZero: () => set((state) => ({carts: 0}))
}));

export default useCartStore;
