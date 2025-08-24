import React, { useState } from 'react';
import './Regester.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Home2 from './Home2';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const URL = "https://myres.me/chilis-dev/api";



function Login() {

    const navigate = useNavigate();


  const [correct, setCorrect] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
    const [showProfile, setShowProfile] = useState(!!localStorage.getItem('token'));
  

  const HandelLogIn = async (e) => {
    // e.preventDefault();

if (email === ''|| password===''){
 

      toast.error("You must complete all fields.")
      setCorrect(false);

}
else if(!email.includes('@') ||!email.includes('.') ){


      setErrorMessage("Email must include '@' and '.'");
      toast.error("Email must include '@' and '.'")

      setCorrect(false);

}
else if(password.length < 6 ){


      toast.error("Password must be at least 6 characters.")

      setCorrect(false);

}
else{
 try {
      const res = await axios.post(`${URL}/login?password=${password}&email=${email}`);

      if (res.data.messages) {
        setCorrect(false)
 
       toast.error(Array.isArray(res.data.messages) ? res.data.messages.join(', ') : res.data.messages);


      }
      else 
      {
         console.log(res.data.data)
        localStorage.setItem('user_name', res.data.data.user.user_name);
        localStorage.setItem('user_id', res.data.data.user.id);
        localStorage.setItem('user_email', res.data.data.user.email);
        localStorage.setItem('user_phone', res.data.data.user.phone);
        localStorage.setItem('token', res.data.data.token);
    
        // toast.success("Login successful ");

         setErrorMessage('');
          setEmail('')
          setPassword('')
        setCorrect(true)
        //  window.location.reload()
        
        //  toast.success("login successfuly ")
        
       window.location.reload();


      }

   
    } catch (err) {

      
      console.log("the error is :",err)
    }
  };
}

   

if (localStorage.getItem('token')) {
  return navigate('/');
}

  return (

 <div className='regester'>
    <div className='container'>
      <div className='the_regester'>
        <h2 className='header'>Log In</h2>
        {/* <p className={!correct ? 'error' : 'not_regester'}>{errorMessage}</p> */}


      <input
  type='text'
  placeholder='Email'
  className='user_name'
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      HandelLogIn(e);
    }
  }}
/>

       <input
  type='password'
  placeholder='Password'
  className='user_password'
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      HandelLogIn(e);   // نفس الفنكشن بتاعة الزرار
    }
  }}
/>
          <button onClick={HandelLogIn}   className='the_button2'>
            Log In
          </button>
          <p className='button7'> I don't have account <Link to={'/Regester'} className='link7' >creat on</Link> </p>


        </div>
      </div>
    </div>
  )
}

export default Login