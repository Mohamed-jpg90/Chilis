import React from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate  } from 'react-router-dom';

function LogInAgain() {
  const navigate = useNavigate();

  const onRelogin =  () => {
    navigate('/Login')

  }


  return (
    <div className="overlay" >
      <div
        className="myModal"
        role="dialog"
       
      >
        {/* Header */}
        <div className="modal_header">
          <h2 className="text-Danger" >Session Expired</h2>

        </div>

        {/* Body */}
        <div className="modal_body">
          <p className="text-gray-700">
            For your security, your session has expired.  
            Please log in again to continue.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="modal-actions">
          {/* <button className="btn-secondary" onClick={() => setPopUp(false)}>
            Cancel
          </button> */}
          <button className="btn-primary" onClick={onRelogin}>
            Log in again
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogInAgain;