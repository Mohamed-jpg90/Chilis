import { useEffect } from "react";
import { useCartStore } from "../store/CartStore";

function Payment_failed() {
  const setPaymentStatus = useCartStore((s) => s.setPaymentStatus);
  const resetpayment = useCartStore((s) => s.resetpayment);
  const clearProducts = useCartStore((s) => s.clearProducts);

useEffect(() => {
  setPaymentStatus("failed");
  resetpayment(); 
}, []);

  return <h2>Payment failed </h2>;
}

export default Payment_failed;
