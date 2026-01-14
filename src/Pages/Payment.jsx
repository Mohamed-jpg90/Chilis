import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useCartStore } from "../store/CartStore";
const URL = "https://myres.me/chilis-dev/api";


const username = localStorage.getItem('user_name')
const email = localStorage.getItem('user_email')
const phone = localStorage.getItem('user_phone')
const pendingOrder = localStorage.getItem('pendingOrder')

function Payment() {

    const cart = useCartStore((state) => state.cart)
    const total = useCartStore((state) => state.total);
    const resetpayment = useCartStore((state) => state.resetpayment);

    const [token, setToken] = useState(localStorage.getItem('token'));

    const scriptLoaded = useRef(false);

    const [orderDetails, setOrderDetails] = useState(null);


    // useEffect(() => {
    //     return () => {
    //         resetpayment();
    //     };
    // }, []);
useEffect(() => {
  if (scriptLoaded.current) return;
  scriptLoaded.current = true;

  const script = document.createElement("script");
  script.src =
    "https://app.fawaterk.com/fawaterkPlugin/fawaterkPlugin.min.js";
  script.async = true;

  script.onload = () => {
    window.pluginConfig = {
      envType: "test",
      hashKey: "HASH_GENERATED_FROM_TOOL",

      style: { listing: "horizontal" },

      requestBody: {
        cartTotal: total.toFixed(2),
        currency: "EGP",

        customer: {
          first_name: username || "Guest",
          last_name: "User",
          email: email || "test@test.com",
          phone: phone || "01000000000",
          address: "Cairo, Egypt",
        },

        redirectionUrls: {
          successUrl:
            "https://chilis-iota.vercel.app/payment/success",
          failUrl:
            "https://chilis-iota.vercel.app/payment/failed",
          pendingUrl:
            "https://chilis-iota.vercel.app/payment/pending",
        },

        cartItems: cart.map((item) => ({
          name: item.name,
          price: item.price.toFixed(2),
          quantity: item.quantity.toString(),
        })),

        payLoad: {
          order_id: "12345",
        },
      },
    };

    window.fawaterkCheckout(window.pluginConfig);
  };

  document.body.appendChild(script);
}, []);


    return (
        <div>
            <h2>Payment</h2>
            <h3>Total: {total.toFixed(2)} EGP</h3>

            {/* REQUIRED */}
            <div id="fawaterkDivId"></div>
        </div>
    );
}

export default Payment;
