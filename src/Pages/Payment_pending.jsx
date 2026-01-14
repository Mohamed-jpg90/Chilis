import { useEffect } from "react";
import { useCartStore } from "../store/CartStore";

function Payment_pending() {
  const setPaymentStatus = useCartStore((s) => s.setPaymentStatus);
  const resetpayment = useCartStore((s) => s.resetpayment);
  const clearProducts = useCartStore((s) => s.clearProducts);

useEffect(() => {
  setPaymentStatus("pending");
}, []);

  return <h2>Payment Successful 🎉</h2>;
}

export default Payment_pending;
