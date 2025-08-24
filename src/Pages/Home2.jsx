import React, { useState, useEffect } from 'react';

import './Home.css';
import img1 from '../images/logo.png';
import './NaveBare'


import { Link } from 'react-router-dom';
import MenueSec from './MenueSec';
import NaveBare from './NaveBare';
import { useLocation } from 'react-router-dom';


function Home2() {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [menuData, setMenuData] = useState([]);


  const handeleLogOut = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }
  return (
    <div className="homepage">
      <div className="sec1">

        <NaveBare token={token} handeleLogOut={handeleLogOut} img1={img1} />

        <div className="text_box">
          <h1>World's Biggest University</h1>
          <br />
          <p>
            Friday is a day of reflection and renewal. <br />
            Just like we recharge our hearts with prayer, we can also recharge our minds with knowledge.
          </p>
          <br />
          <br />

          <Link to={'/'} className={token ? "sec1_but" : 'dis_non'}  >locations </Link>
        </div>





      </div>

      {/* Section 2 */}
      <div className="sec2-99">
        <div className="contnt_sec2-99">
          <h2 className="title-99">Courses We Offer</h2>
          {/* <div className="line-99"></div> */}

          <div className="courses-99">
            <h3>Enter Mediat</h3>
            <div className="line-99"></div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius dolore inventore facere iste laborum quos,
              voluptatem consequatur quod nulla nemo reiciendis, libero ab odit quaerat nobis. Fuga similique reprehenderit.
            </p>
          </div>

          <div className="courses-99">
            <h3>Degree</h3>
            <div className="line-99"></div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius dolore inventore facere iste laborum quos,
              voluptatem consequatur quod nulla nemo reiciendis, libero ab odit quaerat nobis. Fuga similique reprehenderit.
            </p>
          </div>

          <div className="courses-99">
            <h3>Post Graduation</h3>
            <div className="line-99"></div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius dolore inventore facere iste laborum quos,
              voluptatem consequatur quod nulla nemo reiciendis, libero ab odit quaerat nobis. Fuga similique reprehenderit.
            </p>
          </div>
        </div>
      </div>


      {/* sec3 */}

      <div id="menu-section">
        <MenueSec menuData={menuData} />
      </div>
    </div>
  );
}

export default Home2;
