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
        if (!orderDetails || scriptLoaded.current) return; // mesh 3arfha 
        scriptLoaded.current = true;

        const script = document.createElement("script");/// mesh 3arfha 
        script.src =
            "https://app.fawaterk.com/fawaterkPlugin/fawaterkPlugin.min.js";
        script.async = true;

        script.onload = () => {


            const cartItems = cart.map((item) => ({
                name: item.name,
                price: item.price.toFixed(2),
                quantity: item.quantity.toString(),
                id: item.id.toString()
            }));

            setOrderDetails(cartItems)

            window.pluginConfig = {
                envType: "test",
                hashKey: "4caf1b3e9068445b5a33ed40df4b9eabd87d1301707b782a02541fd5ce31b4d9",

                style: {
                    listing: "horizontal",
                },
                requestBody: {
                    cartTotal: total.toFixed(2) || 0,
                    currency: "EGP",
                    customer: {
                        first_name: username,
                        last_name: "Test",
                        email: email,
                        phone: phone,
                        address: "Cairo, Egypt",
                    },
                    redirectionUrls: {
                        successUrl:
                            "https://chilis-iota.vercel.app/payment/success",
                        failUrl:
                            "https://chilis-iota.vercel.app/payment/fail",
                        pendingUrl:
                            "https://chilis-iota.vercel.app/payment/pending",// mesh fahim 
                    },
                    cartItems: {
                        name: "Order Payment",
                        price: total.toFixed(2),
                        quantity: "1",
                    },
                    payLoad: {
                        order_id: orderDetails.id,
                    },
                },
            };

            window.fawaterkCheckout(window.pluginConfig);
        };

        document.body.appendChild(script);


    }, [orderDetails]);

    return (
        <div>
            <h2>Payment</h2>
            <h3>Total: {total.toFixed(2)} EGP</h3>
        </div>
    );
}

export default Payment;
