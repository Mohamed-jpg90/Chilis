import React, { useState } from 'react'
import './EditProfile.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaArrowRight } from "react-icons/fa";

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

  const handleEdit = async () => {
    if (!changed) {
      // setErrorMessage("You didn't change anything")
      toast.error("You didn't change anything")

      console.log("You didn't change anything")
      return
    }
    else if (!name || !phone || !email){
      toast.error("the data is not completed")
    }
    else if (!email.includes("@")||!email.includes(".")){
      toast.error("the email is invalid ")
    }
    else if(phone.length<11){
      toast.error(" invalid phone numper ")
    }
else{
 try {
      const res = await axios.post(
        `${URL}/profile/update?name=${name}&phone=${phone}&email=${email}&referral=chi2021&api_token=${token}`
      )
      console.log(res.data.data)
      if(res.data.message){
        // setErrorMessage=(res.data.message)
        toast.error(res.data.message)
        console.log("error")
      }
else{
     // Uncomment to update local storage
      localStorage.setItem('user_name', res.data.data.user.user_name)
      localStorage.setItem('user_email', res.data.data.user.email)
      localStorage.setItem('user_phone', res.data.data.user.phone)
      localStorage.setItem('token',res.data.data.token)
      setErrorMessage("")
      // setErrorMessage("Profile updated successfully!")
      toast.success("change the data successfuly ")
      setChanged(false)
}

    } catch (e) {
      console.error("The error is:", e)
      setErrorMessage("Failed to update profile")
    }
}
   
  }



  return (
    <div className='regester'>
      <div className='container'>
        <div className='the_regester'>

          <div className='head_of_Edit' >
  
          <h2 className='header'>Edit Profile</h2>
         <Link className='theError' to={'/profile'} >  <FaArrowRight className='the_arow'/> </Link>
         

          </div>

          {/* {errorMessage && <p className="error">{errorMessage}</p>} */}
  

          <p className="lable">Name</p>
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

          <p className="lable">Phone</p>
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

          <p className="lable">Email</p>
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

          <button onClick={handleEdit} className='the_button2'>
            Update
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
