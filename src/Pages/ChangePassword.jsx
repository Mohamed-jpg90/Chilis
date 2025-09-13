import React from 'react'
import './ChangePassword.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaArrowRight } from "react-icons/fa";
import { useState } from 'react'
import Button from '@mui/material/Button';


const URL = "https://myres.me/chilis-dev/api"

function ChangePassword() {

const [email,setEmail]= useState(localStorage.getItem("user_email"))
const [oldPass,setOldPass] =useState('')
const [newPass,SetNewPass] =useState('')
const token = localStorage.getItem("token")
const [loading,setLoadin]= useState(false)




const handeleChange = async ()=>{
    if(!newPass ||!oldPass){
     toast.error("the data is not commblite ")
    }else if( newPass.length<6){
toast.error("The new pass should be longer than 6 cracter ")

    }
else if (oldPass === newPass ){
    toast.error("You didn't change the password")
}

    else{
      setLoadin(true)
        try{

const res = await axios.post(`${URL}/profile/update/password?email=${email}&password=${oldPass}&new_password=${newPass}&api_token=${token}`)


if(res.data.message){
    toast.error(res.data.message)
}
 else if(res.data.messages){
    toast.error(res.data.messages.message)
}

else{
console.log(res.data)

    localStorage.setItem('token',res.data.data.token)
     toast.success("The password changed successfully")
     setOldPass("")
     SetNewPass("")

}

        }catch(e)
        {

           console.log("the error is :",e)
        }finally{
          setLoadin(false)
        }
    }
}

  return (
     <div className='regester'>
         <div className='container'>
           <div className='the_regester'>
   
             <div className='head_of_Edit' >
     
             <h2 className='header'>Change password</h2>
            <Link className='theError' to={'/profile'} >  <FaArrowRight className='the_arow'/> </Link>
            
   
             </div>
   
            
     
   
             <p className="lable">Email</p>
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
   
             <p className="lable">Old pass</p>
             <input
               type="text"
               className="form_AddAddress"
               required
               value={oldPass}
               
               onChange={(e) => {
                 setOldPass(e.target.value)
                
                 
               }}
             />
   
             <p className="lable">New password</p>
             <input
               type="text"
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
                      Update
          
                    </Button>

             {/* <button onClick={handeleChange}  className='the_button2'>
               Update
             </button> */}
           </div>
         </div>
       </div>
  )
}

export default ChangePassword