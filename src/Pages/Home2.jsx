import React, { useState, useEffect } from 'react';

import './Home.css';

import './NaveBare'


import { Link } from 'react-router-dom';
import MenueSec from './MenueSec';
import NaveBare from './NaveBare';
import { useLocation } from 'react-router-dom';
import videoSrc from '../images/WhatsApp Video 2025-08-24 at 16.11.29_46f4fdd1.mp4'
import Footer from './Footer';
import img3 from '../images/aboutUs.jpg'
import ScrollToTop from './ScrollToTop';
// import bootstrap form 'bootstra'

function Home2() {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [menuData, setMenuData] = useState([]);



  return (
    <div className="homepage">
      <div className="sec1">

        <NaveBare token={token}  />
        <ScrollToTop/>

       <video src={videoSrc} autoPlay loop muted playsInline></video>



        {/* المحتوى */}
        <div className="text_box">
          <h1>Welcome to Our Restaurant</h1>
          <br />
          <p>
             Experience the finest dining with a variety of cuisines. <br />
            Indulge in flavors that will tantalize your taste buds.
          </p>
          <br />
          <br />
          <Link to={'/'} className={token ? "sec1_but" : 'dis_non'}>
            Contact Us
          </Link>

        </div>

      </div>

      {/* Section 2 */}
      
<div className="  section2 " id='aboutUs' >
<div className="container_section2">

<div className="AboutUsContent ">
  <h2> About Us </h2>
<hr></hr>
<p>
    Welcome to chilis , where flavor meets tradition. Founded with a passion for authentic cuisine and exceptional dining experiences, we take pride in crafting dishes that delight every sense.

Our menu combines the freshest ingredients with time-honored recipes, offering something for everyone—from classic favorites to innovative creations. At chilis, we believe that great food brings people together, and every meal is an opportunity to create lasting memories.

Whether you're joining us for a casual lunch, a family dinner, or a special celebration, our warm and welcoming atmosphere ensures a dining experience you'll never forget.

Come taste the difference, and let us make every meal extraordinary.
</p>

</div>


<div className="AboutUsImage">
  <img src={img3} alt="" />
</div>

</div>

</div>

      {/* sec3 */}

      <div id="menu-section">
        <MenueSec menuData={menuData} />
      </div>
      <Footer/>
    </div>
  );
}

export default Home2;
