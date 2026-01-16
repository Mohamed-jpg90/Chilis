import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useCartStore } from "../store/CartStore";
const URL = "https://myres.me/chilis-dev/api";


const username = localStorage.getItem('user_name')
const email = localStorage.getItem('user_email')
const phone = localStorage.getItem('user_phone')
const pendingOrder = localStorage.getItem('pendingOrder')

function Payment() {


  const cart = useCartStore((state) => state.cart);
  const total = useCartStore((state) => state.total);
  const resetpayment = useCartStore((state) => state.resetpayment);

  const scriptLoaded = useRef(false);


  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    const script = document.createElement("script");
    script.src =
      "https://app.fawaterk.com/fawaterkPlugin/fawaterkPlugin.min.js";
    script.async = true;

    script.onload = () => {
      var pluginConfig = {
        envType: "test",
        hashKey: "e039d57e089ea028360defdaffd54eb79cc47830d0a5ce41a2ca26b06c7cbde1",
        style: { listing: "horizontal" },
        version: "0",
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
            successUrl: "https://chilis-iota.vercel.app/payment/success",
            failUrl: "https://chilis-iota.vercel.app/payment/failed",
            pendingUrl: "https://chilis-iota.vercel.app/payment/pending",
          },

          "cartItems": [{
            "name": "this is test oop 112252",
            "price": total.toFixed(2),
            "quantity": "1"
          },

          ],
          "payLoad": {
            "custom_field1": "xyz",
            "custom_field2": "xyz2"
          }
        },
      };
      window.fawaterkCheckout(pluginConfig);
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


