import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useState } from 'react'
import Button from '@mui/material/Button';
import NaveBare from './NaveBare'
import LogInAgain from './LogInAgain';
import { useTranslation } from 'react-i18next';

const URL = "https://myres.me/chilis-dev/api"

function ChangePassword() {
  const [email, setEmail] = useState(localStorage.getItem("user_email"))
  const [oldPass, setOldPass] = useState('')
  const [newPass, SetNewPass] = useState('')
  const token = localStorage.getItem("token")
  const [loading, setLoadin] = useState(false)
  const [Errmessage, setErrMessage] = useState(false)

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handeleChange = async () => {
    if (!newPass || !oldPass) {
      toast.error(t('ChangePassword.incompleteData'))
    } else if (newPass.length < 6) {
      toast.error(t('ChangePassword.passwordLength'))
    } else if (oldPass === newPass) {
      toast.error(t('ChangePassword.samePassword'))
    } else {
      setLoadin(true)
      try {
        const res = await axios.post(`${URL}/profile/update/password?email=${email}&password=${oldPass}&new_password=${newPass}&api_token=${token}`)

        if (res.data.response == false) {
          if (res.data.message === "Invalid Token")
            setErrMessage(true)
          else toast.error(t('ChangePassword.somethingWrong'))
        } else {
          console.log(res.data)
          localStorage.setItem('token', res.data.data.token)
          toast.success(t('ChangePassword.success'))
          setOldPass("")
          SetNewPass("")
        }
      } catch (e) {
        console.log("the error is :", e)
      } finally {
        setLoadin(false)
      }
    }
  }

  return (
    <div className='regester' dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <NaveBare token={token} />
      <div className='container2' style={{ marginTop: "50px" }} >
        <div className='the_regester'>
          <div className='head_of_Edit' >
            <h2 className='header'>{t('ChangePassword.title')}</h2>
            <Link className='theError' to={'/profile'} >  
              <IoMdArrowRoundBack className='the_arow' style={{ fontSize: "26px", color: "#333" }} /> 
            </Link>
          </div>

          <p className="lable">{t('ChangePassword.email')}</p>
          <input
            type="text"
            className="form_AddAddress"
            required
            value={email}
            disabled
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />

          <p className="lable">{t('ChangePassword.oldPassword')}</p>
          <input
            type="password"
            className="form_AddAddress"
            required
            value={oldPass}
            onChange={(e) => {
              setOldPass(e.target.value)
            }}
          />

          <p className="lable">{t('ChangePassword.newPassword')}</p>
          <input
            type="password"
            className="form_AddAddress"
            required
            value={newPass}
            onChange={(e) => {
              SetNewPass(e.target.value)
            }}
          />

          <Button
            size="small"
            onClick={() => { handeleChange() }}
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
            {t('ChangePassword.update')}
          </Button>

          {Errmessage && (
            <LogInAgain/>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChangePassword