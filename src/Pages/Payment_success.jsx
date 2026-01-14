import { useEffect } from "react";
import { useCartStore } from "../store/CartStore";

function Payment_success() {
  const setPaymentStatus = useCartStore((s) => s.setPaymentStatus);
  const resetpayment = useCartStore((s) => s.resetpayment);
  const clearProducts = useCartStore((s) => s.clearProducts);

  useEffect(() => {
    setPaymentStatus("success");
    clearProducts();
    resetpayment();
  }, []);

  return <h2>Payment Successful 🎉</h2>;
}

export default Payment_success;