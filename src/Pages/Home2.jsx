import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenueSec from './MenueSec';
import NaveBare from './NaveBare';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import videoSrc from '../images/WhatsApp Video 2025-08-24 at 16.11.29_46f4fdd1.mp4'
import Footer from './Footer';
import img3 from '../images/aboutUs.jpg'
import ScrollToTop from './ScrollToTop';


import Cookies from 'js-cookie'
import { MdAddToDrive } from 'react-icons/md';
import AddToCartSuccess from './AddToCartSuccess';
function Home2() {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [menuData, setMenuData] = useState([]);
  const { t , i18n} = useTranslation(); // Initialize translation function

const lng = Cookies.get("i18next") || "en"

useEffect(()=>{
  window.document.dir = i18n.dir()
},[lng])


  return (
    <div className="homepage">
      <div className="sec1">
        <NaveBare token={token} />
        <ScrollToTop />
        <AddToCartSuccess/>

        <video src={videoSrc} autoPlay loop muted playsInline></video>

        {/* Content */}
        <div className="text_box">
          <h1>{t('home.welcome')}</h1>
          <br />
          <p>
            {t('home.experience')} <br />
            {t('home.indulge')}
          </p>
          <br />
          <br />
          <Link to={'/'} className={token ? "sec1_but" : 'dis_non'}>
            {t('home.contactUs')}
          </Link>
        </div>
      </div>

      {/* Section 2 - About Us */}
      <div className="section2" id='aboutUs'>
        <div className="container_section2">
          <div className="AboutUsContent">
            <h2>{t('aboutUs.title')}</h2>
            <hr></hr>
            <p>
              {t('aboutUs.description')}
            </p>
          </div>

          <div className="AboutUsImage">
            <img src={img3} alt={t('aboutUs.imageAlt')} />
          </div>
        </div>
      </div>

      {/* Section 3 - Menu */}
      <div id="menu-section">
        <MenueSec menuData={menuData} />
      </div>
      <Footer />
    </div>
  );
}

export default Home2;