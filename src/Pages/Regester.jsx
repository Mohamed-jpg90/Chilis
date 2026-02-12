import React, { useState } from 'react';
import '../App.css'
import axios from 'axios';
import Profile from './Profile';
import Home from './Home2';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import NaveBare from './NaveBare';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';

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


  const regesterSchima = z.object({
    fullName: z.string().min(1, "user name is required"),
    phone: z.string().min(1, "phone numper is required").regex(/^[0-9]+$/, "phone must be numbers only"),
    email: z.string().min(1, "email is required").email("email is in valid"),
    password: z.string().min(6, "password should contain at least 6 chatacter ")

  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(regesterSchima),

    mode: 'onChange'
  }
  )

  const onSubmit = async (data) => {

    try {
      const res = await axios.post(`${URL}/register?first_name=${data.fullName}&email=${data.email}&password=${data.password}&phone=${data.phone}`)

      const user = res.data.data.user;
      const token = res.data.data.token;

      localStorage.setItem('user_name', user.user_name);
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_phone', user.phone);
      localStorage.setItem('token', token);


      setShowProfile(true);
      setCorrect(true)
      toast.success(t('Register.success'))
      onLoginSuccess(token)
      navigate('/')

    } catch (err) {
      console.log(err);

      if (err.response?.data?.messages) {
        toast.error(err.response.data.messages[0]);
      } else {
        toast.error(t('Register.failed'));
      }
    }
  };


  return (
    <div className='regester' dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>

      <div className="navprofilebar">
        <NaveBare token={token} />
      </div>
      <div className='container2'>
        <div className='the_regester' >
          <h2 className='header2'>{t('Register.title')}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='the_regester2'>
            <input
              type='text'
              placeholder={t('Register.fullNamePlaceholder')}
              className='user_name'
              {...register('fullName')}
            />
            {errors.fullName && <p style={{ color: "red", fontSize: "15px" }}>{errors.fullName.message}</p>}

            <input
              type='text'
              placeholder={t('Register.phonePlaceholder')}
              className='user_num'
              {...register('phone')}

            />
            {errors.phone && <p style={{ color: "red", fontSize: "15px" }}>{errors.phone.message}</p>}

            <input
              type='email'
              placeholder={t('Register.emailPlaceholder')}
              className='user_email'

              {...register('email')}

            />
            {errors.email && <p style={{ color: "red", fontSize: "15px" }}>{errors.email.message}</p>}

            <input
              type='password'
              placeholder={t('Register.passwordPlaceholder')}
              className='user_password'
              {...register('password')}
            />
            {errors.password && <p style={{ color: "red", fontSize: "15px" }}>{errors.password.message}</p>}

            <Button
              size="small"
              type='submit'
              variant="outlined"
              className='the_button2'
              disabled={isSubmitting}
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
              {isSubmitting ? "Loading..." : t("Login.loginButton")}
            </Button>

          </form>

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