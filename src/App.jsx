

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Regester from './Pages/Regester'
import Home2 from './Pages/Home2'
import Profile from './Pages/Profile'
import Login from './Pages/Login';
import toast, { Toaster } from 'react-hot-toast';
import EditProfile from './Pages/EditProfile';
import ChangePassword from './Pages/ChangePassword';
import { useEffect, useState } from 'react';
import NaveBare from './Pages/NaveBare';
import Location from './Pages/Location';
import Cart from './Pages/Cart';
import "./i18n"
import MyOrder from './Pages/MyOrder';
import Payment from './Pages/Payment';
import Payment_success from './Pages/Payment_success';
import Payment_failed from './Pages/Payment_failed';
import Payment_pending from './Pages/Payment_pending';
import { useCartStore } from './store/CartStore';
import AddressModal from './Pages/AddressModal';
import AddAddresses from './Pages/AddAddresses';

function App() {

const canpay = useCartStore((state) => state.canPay);
const paymentStatus = useCartStore((state) => state.paymentStatus);
const cart = useCartStore((state) => state.cart);
// const pending = useCartStore((state)=> state.pending)


  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home2 />} />
        <Route path='/Profile' element={token ? <Profile /> : <Navigate to={'/'} replace />} />
        <Route path='/Regester' element={!token ? <Regester onLoginSuccess={handleLoginSuccess} /> : <Navigate to={'/'} replace />} />
        <Route path='/Login' element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path='/edit-profile' element={token ? <EditProfile /> : <Navigate to={'/'} replace />} />
        <Route path='/change-password' element={token ? <ChangePassword /> : <Navigate to={'/'} replace />} />
        <Route path='/Cart' element={<Cart />} />
        <Route path='/Location' element={<Location />} />
        <Route path='/myOrder' element={<MyOrder />} />
        <Route path="/payment"element={ canpay ? <Payment /> : <Navigate to="/" replace /> }/>         
           <Route path='/payment/success' element={ paymentStatus === "success"?  <Payment_success/> :<Navigate to={'/'} replace /> } />
           <Route path='/payment/failed' element={paymentStatus == "failed" ?<Payment_failed/> :<Navigate to={'/'} replace /> }     />
           <Route path='/payment/pending' element={paymentStatus == "pending" ?<Payment_pending/> :<Navigate to={'/'} replace />  }   />

      </Routes>

      <Toaster />

    </BrowserRouter>
  );
}

export default App;
