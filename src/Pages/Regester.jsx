import React, { useState } from 'react';
import '../App.css'
import axios from 'axios';
import Profile from './Profile';
import Home from './Home2';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import NaveBare from './NaveBare';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';

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

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !fullName || !number) {
      toast.error(t('Register.completeAllFields'))
      setCorrect(false)
    }
    else if (password.length < 6) {
      setErrorMessage(t('Register.passwordLength'))
      toast.error(t('Register.passwordLength'))
      setCorrect(false)
    } else if (!email.includes('@') || !email.includes('.')) {
      toast.error(t('Register.invalidEmail'))
      setCorrect(false)
    } else if (fullName.length < 2) {
      toast.error(t('Register.nameLength'))
    } else if (isNaN(number)) {
      toast.error(t('Register.invalidPhone'))
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
        toast.success(t('Register.success'))
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
          setErrorMessage(t('Register.failed'));
        }
      } finally {
        setLoading(false)
      }
    };
  }

  return (
    <div className='regester' dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>

      <div className="navprofilebar">
        <NaveBare token={token} />
      </div>
      <div className='container2'>
        <div className='the_regester' >
          <h2 className='header2'>{t('Register.title')}</h2>
          <input
            type='text'
            placeholder={t('Register.fullNamePlaceholder')}
            className='user_name'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type='text'
            placeholder={t('Register.phonePlaceholder')}
            className='user_num'
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <input
            type='email'
            placeholder={t('Register.emailPlaceholder')}
            className='user_email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder={t('Register.passwordPlaceholder')}
            className='user_password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <LoadingButton
            size="small"
            onClick={handleSubmit}
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
            {t('Register.createAccountButton')}
          </LoadingButton>

          <p className='button7'>
            {t('Register.haveAccount')} 
            <Link to={'/LogIn'} className='link7'>
              {t('Register.loginLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Regester;