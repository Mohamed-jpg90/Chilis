import React, { useState } from 'react';
import './Regester.css';
import axios from 'axios';
import Profile from './Profile';
import Home from './Home2';
import { Link } from 'react-router-dom';

const URL = "https://myres.me/chilis-dev/api";

function Regester() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [correct, setCorrect] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showProfile, setShowProfile] = useState(!!localStorage.getItem('token'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email ||!password||!fullName||!number){
      setErrorMessage("You must complete all fildes")
      setCorrect(false)
    }
    else if (password.length < 6){
        setErrorMessage("The password should include at lest 6 cracters")
      setCorrect(false)

    }else if (!email.includes('@')||!email.includes('.')){
      setErrorMessage("the emaile should include '@' or '.'")
      setCorrect(false)

    }else if(fullName.length<2){
      setErrorMessage("The full name should be bigger than 2 cracter ")
    }
    else{

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
        window.location.reload()
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
          setErrorMessage(res.data.messages[0]);
        } else {
          setErrorMessage('Registration failed. Please try again.');
        }
      }
    
  };
    }


  if (showProfile) {
    return <Home/>
  }

  return (
    <div className='regester'>
      <div className='container'>
        {/* {!correct && <p className="error">{errorMessage}</p>} */}

        <div className='the_regester' >
          <h2 className='header'>Create Account</h2>
          <p className={!correct ? 'error' : 'not_regester'} >{errorMessage}</p>
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
          <button onClick={handleSubmit} className='the_button2'>
            Create Account
          </button>

           <p className='button7'> I have an account <Link to={'/LogIn'} className='link7' >Log In</Link> </p>
        </div>
      </div>
    </div>
  );
}

export default Regester;
