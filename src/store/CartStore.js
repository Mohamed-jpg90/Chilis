import { create } from "zustand";
import { persist } from "zustand/middleware";
   

 export  const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      total : 0 ,

      canPay: false,      
      paymentStatus: null,


      addToCart: (product) =>
        set((state) => ({ cart: [...state.cart, product] })),
      removeFromTheCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      clearProducts: () => 
        set({ 
          cart: [],
          total :0,
         }),
      updateCart: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
        updateNote: (id, note) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, special: note } : item
          ),
        })),

      /////////////////////////////
      setTotal : (total)=> set({total}),
      ////////////////////////////////

      startPayment: () => 
        set({canPay: true,paymentStatus:"pending"}),
      setPaymentStatus : (status) =>
        set({paymentStatus : status}),

      resetpayment : () =>
        set({canPay: false, paymentStatus : null})
      ////////////////////////

    }),
    {
      name: "cartItem", 
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