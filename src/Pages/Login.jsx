import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

import './Regester.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Home2 from './Home2';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import NaveBare from './NaveBare';

const URL = "https://myres.me/chilis-dev/api";



function Login({ onLoginSuccess }) {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');


  const [correct, setCorrect] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showProfile, setShowProfile] = useState(!!localStorage.getItem('token'));


  const HandelLogIn = async (e) => {
    // e.preventDefault();

    if (email === '' || password === '') {


      toast.error("You must complete all fields.")
      setCorrect(false);

    }
    else if (!email.includes('@') || !email.includes('.')) {


      setErrorMessage("Email must include '@' and '.'");
      toast.error("Email must include '@' and '.'")

      setCorrect(false);

    }
    else if (password.length < 6) {


      toast.error("Password must be at least 6 characters.")

      setCorrect(false);

    }
    else {
        setCorrect(true)
        setLoading(true)
      try {
        const res = await axios.post(`${URL}/login?password=${password}&email=${email}`);

        if (res.data.messages) {
          setCorrect(false)

          toast.error(Array.isArray(res.data.messages) ? res.data.messages.join(', ') : res.data.messages);


        }
        else {
          console.log(res.data.data)
          localStorage.setItem('user_name', res.data.data.user.user_name);
          localStorage.setItem('user_id', res.data.data.user.id);
          localStorage.setItem('user_email', res.data.data.user.email);
          localStorage.setItem('user_phone', res.data.data.user.phone);

          const token = res.data.data.token;
          localStorage.setItem('token', token);

          // toast.success("Login successful ");

          setErrorMessage('');
          setEmail('')
          setPassword('')


          toast.success("login successfuly ")
          onLoginSuccess(token)

          //  window.location.reload();

          navigate('/')
        }


      } catch (err) {


        console.log("the error is :", err)
      }finally{
        setLoading(false)
      }
    };
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);



  const [loading, setLoading] = React.useState(false);
  // React.useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timeout);
  // });


  return (

    <div className='regester'>
         <div className="navprofilebar">
      <NaveBare token={token} />

      </div>
      <div className='container2'>
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


          <Button
            size="small"
            onClick={() => { HandelLogIn() }}
            loading={loading}
            // loadingIndicator="Loading…"
            variant="outlined"
            className='the_button2'
            sx={{
              marginTop: "30px",
              backgroundColor: "#f44336",
              border: 0,
              borderRadius: "15px",
              padding: "13px 10px",
              cursor: "pointer",
              transition: "0.5s",
              border: "3px solid #f44336",
              color: "white",
              fontWeight: 900,
              fontSize: "15px",
           
            }}
          >
            Log In

          </Button>
          {/* 
          <button onClick={HandelLogIn}  className='the_button2'>
            Log In
          </button> */}

          <p className='button7'> I don't have account <Link to={'/Regester'} className='link7' >create on</Link> </p>


        </div>
      </div>
    </div>
  )
}

export default Login