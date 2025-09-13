

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
import { useEffect,useState } from 'react';
import NaveBare from './Pages/NaveBare';

import Cart from './Pages/Cart';
function App() {

 

  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken); 
  };

  return (
     <BrowserRouter>
       <Routes>
      <Route path='/'  element={<Home2/> } />

        <Route path='/Profile'  element= { token? <Profile/> : <Navigate to={'/'} replace/> } />
      <Route path='/Regester'  element={ !token ?  <Regester onLoginSuccess={handleLoginSuccess} /> :<Navigate to={'/'} replace/>} />
      <Route path='/Login'  element={!token ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to={'/'} replace/> } />
      <Route path='/edit-profile'  element={<EditProfile/> } />
      <Route path='/change-password'  element={<ChangePassword/> } />
      <Route path='/Cart'  element={<Cart/> } />
      

     </Routes>

     <Toaster/>
     
     </BrowserRouter>
  );
}

export default App;
