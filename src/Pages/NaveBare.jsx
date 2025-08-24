import React from 'react'
import './NaveBare.css'
import { Link } from 'react-router-dom'
// import { Link } from "react-scroll";
// import Home2 from './Home2';

import { useNavigate } from 'react-router-dom';

function NaveBare({ token, handeleLogOut, img1 }) {
        const navigate = useNavigate();
    
    return (
        <div>


            <div className="head">
                <div className="image">
                    <img src={img1} alt="Logo" />
                </div>

                <div className="navbar">
                    <ul>
                        <li className='aft'><Link to={'/'} style={{ marginLeft: '-10px' }}>Home</Link></li>
                        <li className='aft'>
                            <Link to={'/'}
                                onClick={() =>  {
                                    if (window.location.pathname === '/') {
                                        const menuSection = document.getElementById('menu-section');
                                        menuSection?.scrollIntoView({ behavior: 'smooth' });
                                    } else {
                                        navigate('/', { state: { scrollTo: 'menu-section' } });
                    
                                    }
                                }}
                            >
                                Menu
                            </Link>

                        </li>
                        <li className='aft'><a href="#">Our Locations</a></li>

                        {!token && (
                            <>
                                <li><Link to="/Login" className="sec">Log In</Link></li>
                                <li><Link to="/Regester" className="sec">Sign Up</Link></li>
                            </>
                        )}

                        {/* Show Profile and Log Out only when there IS a token */}
                        {token && (
                            <>
                                <li><Link to="/Profile" className="sec">your Profile</Link></li>
                                <li><Link onClick={handeleLogOut} className="sec">log out</Link></li>
                            </>
                        )}

                    </ul>
                </div>
            </div>




        </div>
    )
}

export default NaveBare