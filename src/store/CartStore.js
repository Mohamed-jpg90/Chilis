import { create } from "zustand";
import { persist } from "zustand/middleware";
   

 export  const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product) =>
        set((state) => ({ cart: [...state.cart, product] })),
      removeFromTheCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      clearProducts: () => set({ cart: [] }),
      updateCart: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
    }),
    {
      name: "cartItem", // ✅ لازم string
    }
  )
);


export const useCartAddresses = create (
    persist(
        (set)=>({
    address : null ,
    addAddress : (address) => set ( () =>({ address: address }) ),
    cleerAddress : ()=> set({address : {} }) 
}),{
    name: "the_celecter_address"
}
    )
)