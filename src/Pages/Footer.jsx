import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import img3 from '../images/logo.png'
import { FaPhoneAlt } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t, i18n } = useTranslation()

  return (
    <div className="footer_container" id='contact_us'>
      <div className="ffoo">

        <div className="foo_text">
          <p>{t("Footer.text")}</p>
        </div>
        <div className="image3">
          <img className='lazzy' src={img3} alt="logo" />
        </div>

        <div className="foo_text">
          <h2><FaPhoneAlt /> 1900</h2>
        </div>
      </div>
    </div>
  )
}

export default Footer
