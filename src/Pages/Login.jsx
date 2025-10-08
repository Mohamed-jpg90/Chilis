import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Home2 from './Home2';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import NaveBare from './NaveBare';
import { useTranslation } from 'react-i18next';

const URL = "https://myres.me/chilis-dev/api";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [correct, setCorrect] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showProfile, setShowProfile] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = React.useState(false);

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const HandelLogIn = async (e) => {
    if (email === '' || password === '') {
      toast.error(t('Login.completeAllFields'))
      setCorrect(false);
    }
    else if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage(t('Login.invalidEmail'));
      toast.error(t('Login.invalidEmail'))
      setCorrect(false);
    }
    else if (password.length < 6) {
      toast.error(t('Login.passwordLength'))
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
          
          setErrorMessage('');
          setEmail('')
          setPassword('')

          toast.success(t('Login.success'))
          onLoginSuccess(token)
          navigate('/')
        }
      } catch (err) {
        console.log("the error is :", err)
      } finally {
        setLoading(false)
      }
    };
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  return (
    <div className='regester' dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="navprofilebar">
        <NaveBare token={token} />
      </div>
      <div className='container2'>
        <div className='the_regester'>
          <h2 className='header'>{t('Login.title')}</h2>

          <input
            type='text'
            placeholder={t('Login.emailPlaceholder')}
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
            placeholder={t('Login.passwordPlaceholder')}
            className='user_password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                HandelLogIn(e);
              }
            }}
          />

          <Button
            size="small"
            onClick={() => { HandelLogIn() }}
            loading={loading}
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
              fontSize: {
                xs: "10px",
                sm: "14px",
                md: "15px",
              },
            }}
          >
            {t('Login.loginButton')}
          </Button>

          <p className='button7'>
            {t('Login.noAccount')} 
            <Link to={'/Regester'} className='link7'>
              {t('Login.createAccount')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login