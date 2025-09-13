import React, { useState, useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './NaveBare.css';
import { Link, useNavigate } from 'react-router-dom'
import imag2 from '../images/logo.png'
import { HashLink } from 'react-router-hash-link';
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { useCartStore } from '../store/CartStore';
function NaveBare({ token }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false) // للتحكم في الفتح/القفل

  const dropdownRef = useRef(null)

  const handeleLogOut = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }
  const [isDropDown, setIsDropDown] = useState(false)


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropDown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])


  const cart = useCartStore((state) => state.cart)

  return (

    <nav className={`my-navbar navbar navbar-expand-lg  `}>
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand ms-5" to={"/"}><img src={imag2} alt="Logo" /></Link>
        {/* زرار التوجل في الموبايل */}
        <button
          className="navbar-toggler " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon "></span>
        </button>

        {/* اللينكات */}
        <div className={`collapse navbar-collapse  ${window.location.pathname !== '/' ? "text-dark" : ""}  ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item aft">


              <HashLink to={'/#menu'} className={`${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"} `} >
                Menu
              </HashLink>


            </li>

            <li className="nav-item aft">
              <HashLink to={'/#aboutUs'} className={`${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"} `} >
                About Us
              </HashLink>
            </li>

            <li className="nav-item aft">
              <HashLink to={'/#'} className={`${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"} `} >
                Our Location
              </HashLink>
            </li>



            {/* Dropdown */}


            {token && (
              <>
                {window.location.pathname !== '/Cart' && (

                  <li className="nav-item ">

                    <div className="cartIcon">


                      <HashLink to={'/Cart'} className={` fs-3 no_hover ${window.location.pathname !== '/' ? "navbarLinksProfile   " : "custom-link"} `} >
                        <IoCartOutline />

                      </HashLink>
                      {cart.length > 0 && (
                        <span className="numper_of_order">{cart.length}</span>
                      )}

                    </div>


                  </li>
                )}



                <li className=' nav-item  '

                  ref={dropdownRef}
                >
                  <span className="dropdown__" onClick={() => setIsDropDown(prev => !prev)} > <IoPersonCircleOutline /> </span>

                  {isDropDown && (
                    <div className="position-relative">
                      <ul className="dropdown ">
                        {window.location.pathname !== '/Profile' && (
                          <li className="">
                            <Link to="/Profile"
                              className={`${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"} `}
                              onClick={() => setIsOpen(false)}>
                              Your Profile
                            </Link>
                          </li>
                        )}
                        <li className="nav-item">
                          <Link
                            onClick={handeleLogOut}
                            className={`${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"} `}
                          >
                            Log out
                          </Link>
                        </li>



                      </ul>
                    </div>
                  )}

                </li>


              </>
            )}





            {/* ///////////////// */}
            {!token && (
              <>
                {window.location.pathname !== '/Login' && (
                  <li>
                    <Link
                      to="/Login"
                      className={window.location.pathname === "/" ? "sec" : "secProfile"}
                      onClick={() => setIsOpen(false)}
                    >
                      Log In
                    </Link>
                  </li>
                )}


                {window.location.pathname !== '/Regester' && (
                  <li className="nav-item">
                    <Link to="/Regester" className={` ${window.location.pathname === "/" ? "sec" : "secProfile"}`} onClick={() => setIsOpen(false)}>
                      Sign Up
                    </Link>
                  </li>
                )}

              </>
            )}

            {/* {token && (
              <>
                {window.location.pathname !== '/Profile' && (
                  <li className="">
                    <Link to="/Profile" className={` ${window.location.pathname === "/" ? "sec" : "secProfile"}`} onClick={() => setIsOpen(false)}>
                      Your Profile
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link
                    onClick={handeleLogOut}
                    className={` ${window.location.pathname === "/" ? "sec" : "secProfile"}`}
                  >
                    Log out
                  </Link>
                </li>
              </>
            )} */}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NaveBare
