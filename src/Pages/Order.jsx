import React, { useState } from 'react'
import Button from '@mui/material/Button';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/CartStore';
function Order({ loading, cart, token, t }) {
    const  cleare = useCartStore((state)=>state.clearProducts)
    const [orederID, setOrderID] = useState("")

const handelOrder= async ()=>{
try{

    const res = await axios.post(`/orders/create?delivery_type=1&payment=1&lat=0&lng=0&address=187&area=1&branch=2&items={"items":[{"id":26,"choices":[],"extras":[],"options":[],"count":1,"special":""}]}&device_id=&notes=&time=&car_model=&car_color=&gift_cards=&coins=00.00`)
        if (res.data.response == false) {
          if (res.data.message === "Invalid Token") {
            localStorage.removeItem("token")
            setErrMessage(true)
          }
          else toast.error(t('Cart.somethingWrong'))
        }else{
            toast.success("the order is created successfuly ")
            setOrderID(res.data.data.order_id)
            cleare()
        }


}catch(e){
    console.log("the error is ",e)
}finally{
    loading= true
}


}

  return (
    <div>

    </div>
  )
}

export default Order
