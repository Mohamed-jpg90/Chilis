import React, { useState } from 'react';
import './Regester.css';
import axios from 'axios';
import Profile from './Profile';
import Home from './Home2';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import NaveBare from './NaveBare';

const URL = "https://myres.me/chilis-dev/api";

function Regester({ onLoginSuccess }) {

  const navigate = useNavigate();
   const token = localStorage.getItem('token');


  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [correct, setCorrect] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showProfile, setShowProfile] = useState(!!localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !fullName || !number) {
      toast.error("You must complete all fildes")
      setCorrect(false)
    }
    else if (password.length < 6) {
      setErrorMessage("The password should include at lest 6 cracters")
      toast.error("The password should include at lest 6 cracters")

      setCorrect(false)

    } else if (!email.includes('@') || !email.includes('.')) {
      // setErrorMessage("the emaile should include '@' or '.'")
      toast.error("the emaile should include '@' or '.'")

      setCorrect(false)

    } else if (fullName.length < 2) {
      // setErrorMessage("The full name should be bigger than 2 cracter ")
      toast.error("The full name should be bigger than 2 cracter ")

    } else if (isNaN(number)) {
      toast.error("The phone number contains letters or invalid characters. ")


    }
    else {
      setLoading(true)

      try {


        const res = await axios.post(`${URL}/register?first_name=${fullName}&email=${email}&password=${password}&phone=${number}`)

        const user = res.data.data.user;
        const token = res.data.data.token;

        localStorage.setItem('user_name', user.user_name);
        localStorage.setItem('user_id', user.id);
        localStorage.setItem('user_email', user.email);
        localStorage.setItem('user_phone', user.phone);
        localStorage.setItem('token', token);

        setFullName('');
        setEmail('');
        setPassword('');
        setNumber('');
        setShowProfile(true);
        setErrorMessage('')
        setCorrect(true)
        // window.location.reload()
        toast.success("account created successfuly")
        onLoginSuccess(token)
        navigate('/')

      } catch (err) {

        const res = await axios.post(`${URL}/register`, null, {
          params: {
            first_name: fullName,
            email: email,
            password: password,
            phone: number
          }
        });
        
        console.log(res.data.messages)
        setCorrect(false);
        if (res.data.messages) {
          toast.error(res.data.messages[0])
        } else {
          setErrorMessage('Registration failed. Please try again.');
        }
      } finally {
        setLoading(false)
      }

    };
  }




  return (
    <div className='regester'>


         <div className="navprofilebar">
      <NaveBare token={token} />

      </div>
      <div className='container2'>
        {/* {!correct && <p className="error">{errorMessage}</p>} */}

        <div className='the_regester' >
          <h2 className='header2'>Create Account</h2>
          <input
            type='text'
            placeholder='Full Name'
            className='user_name'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type='text'
            placeholder='Phone'
            className='user_num'
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <input
            type='email'
            placeholder='Email address'
            className='user_email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            className='user_password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            size="small"
            onClick={handleSubmit}
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
            Create Account

          </Button>


          {/* <button onClick={handleSubmit} className='the_button2'>
            Create Account
          </button> */}

          <p className='button7'> I have an account <Link to={'/LogIn'} className='link7' >Log In</Link> </p>
        </div>
      </div>
    </div>
  );
}

export default Regester;
