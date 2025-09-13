import React from 'react'
import './Footer.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import img3 from '../images/logo.png'
import { FaPhoneAlt } from "react-icons/fa";function Footer() {
  return (
   <div className=" footer_container ">
          <div className="ffoo">
            <div className="image3">
                <img className='lazzy' src={img3}/>
            </div>
            <div className="foo_text">
                <p>Our menu is crafted to satisfy every craving </p>
            </div>
                 <div className="foo_text">
                    <h2> <FaPhoneAlt /> 1900 </h2>
            </div>
          </div>
   </div>
  )
}

export default Footer