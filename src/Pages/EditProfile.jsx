import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { IoMdArrowRoundBack } from "react-icons/io";
import NaveBare from './NaveBare';
import LogInAgain from './LogInAgain';
import { useTranslation } from 'react-i18next';

const URL = 'https://myres.me/chilis-dev/api'

function EditProfile() {
  const [errorMessage, setErrorMessage] = useState("")
  const token = window.localStorage.getItem("token")
  const nameValue = localStorage.getItem("user_name") || ""
  const emailValue = localStorage.getItem("user_email") || ""
  const phoneValue = localStorage.getItem("user_phone") || ""

  const [name, setName] = useState(nameValue)
  const [email, setEmail] = useState(emailValue)
  const [phone, setPhone] = useState(phoneValue)
  const [changed, setChanged] = useState(false)
  const [loading, setLoading] = useState(false)
  const [Errmessage, setErrMessage] = useState(false)

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleEdit = async () => {
    if (!changed) {
      toast.error(t('EditProfile.noChanges'))
      return
    }
    else if (!name || !phone || !email) {
      toast.error(t('EditProfile.incompleteData'))
    }
    else if (!email.includes("@") || !email.includes(".")) {
      toast.error(t('EditProfile.invalidEmail'))
    }
    else if (phone.length < 11) {
      toast.error(t('EditProfile.invalidPhone'))
    }
    else {
      setLoading(true)
      try {
        const res = await axios.post(
          `${URL}/profile/update?name=${name}&phone=${phone}&email=${email}&referral=chi2021&api_token=${token}`
        )
        if (res.data.response == false) {
          if (res.data.message === "Invalid Token")
            setErrMessage(true)
          else toast.error(t('EditProfile.somethingWrong'))
        }
        else {
          localStorage.setItem('user_name', res.data.data.user.user_name)
          localStorage.setItem('user_email', res.data.data.user.email)
          localStorage.setItem('user_phone', res.data.data.user.phone)
          localStorage.setItem('token', res.data.data.token)
          setErrorMessage("")
          toast.success(t('EditProfile.success'))
          setChanged(false)
        }
      } catch (e) {
        console.error("The error is:", e)
        setErrorMessage(t('EditProfile.updateFailed'))
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className='regester' dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <NaveBare token={token} />
      <div className='container2' style={{ marginTop: "50px" }} >
        <div className='the_regester'>
          <div className='head_of_Edit' >
            <h2 className='header'>{t('EditProfile.title')}</h2>
            <Link className='backToProfile' to={'/profile'} >  
              <IoMdArrowRoundBack className='the_arow' style={{ fontSize: "26px" }} /> 
            </Link>
          </div>

          <p className="lable">{t('EditProfile.name')}</p>
          <input
            type="text"
            className="form_AddAddress"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setChanged(true)
            }}
          />

          <p className="lable">{t('EditProfile.phone')}</p>
          <input
            type="text"
            className="form_AddAddress"
            required
            value={phone}
            maxLength={11}
            onChange={(e) => {
              setPhone(e.target.value)
              setChanged(true)
            }}
          />

          <p className="lable">{t('EditProfile.email')}</p>
          <input
            type="text"
            className="form_AddAddress"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setChanged(true)
            }}
          />

          <Button
            size="small"
            onClick={() => { handleEdit() }}
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
            {t('EditProfile.update')}
          </Button>
        </div>
      </div>
      {Errmessage && (
        <LogInAgain/>
      )}
    </div>
  )
}

export default EditProfile