import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import imag2 from '../images/logo.png';
import { HashLink } from 'react-router-hash-link';
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/CartStore';
import DarkMoode from './DarkMoode';
import './NaveBare.css';

function NaveBare({ token }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isDropDown, setIsDropDown] = useState(false);
  const { t, i18n } = useTranslation();

  const handeleLogOut = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cart = useCartStore((state) => state.cart);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Force direction to remain static (LTR)
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lng;
  };

  // Ensure direction stays static on component mount and language change
  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <nav className={`my-navbar navbar`}>
      <div className={`nav-container`}>
        {/* Logo */}
        <Link className="nav-logo" to={"/"}><img src={imag2} alt="Logo" /></Link>

        {/* Navigation Links */}
        <ul className={`nav-menu ${isOpen ? "active" : ""}`}>
          <li className="nav-item">
            <HashLink
              to={'/#menu'}
              className={`nav-link ${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"}`}
              onClick={() => setIsOpen(false)}
            >
              {t('navbar.menu')}
            </HashLink>
          </li>

          <li className="nav-item">
            <HashLink
              to={'/#aboutUs'}
              className={`nav-link ${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"}`}
              onClick={() => setIsOpen(false)}
            >
              {t('navbar.aboutUs')}
            </HashLink>
          </li>

          <li className="nav-item">
            <Link
              to={'/Location'}
              className={`nav-link ${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"}`}
              onClick={() => setIsOpen(false)}
            >
              {t('navbar.ourLocation')}
            </Link>
          </li>



          {/* Language Switcher Dropdown */}
          <li className="nav-item">
            <select
              className={`form-select  ${window.location.pathname !== '/' ? "language_select2" : "language_select"} `}

              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              style={
                window.location.pathname === '/'
                  ? { maxWidth: '70px', margin: '0px 7px', color: 'white' }
                  : { maxWidth: '70px', margin: '0px 7px' }
              }

            >
              <option value="en" style={{ color: "black" }}>English</option>
              <option value="ar" style={{ color: "black" }}>العربية</option>
            </select>
          </li>

          {/* Cart Icon */}
          {token && window.location.pathname !== '/Cart' && (
            <li className="nav-item">
              <div className="cartIcon">
                <HashLink
                  to={'/Cart'}
                  className={`nav-link fs-3 no_hover ${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <IoCartOutline />
                </HashLink>
                {cart.length > 0 && (
                  <span className="numper_of_order">{cart.length}</span>
                )}
              </div>
            </li>
          )}



          {/* User Dropdown */}
          {token && (
            <li className="nav-item" ref={dropdownRef}>
              <span
                className={`dropdown-icon ${window.location.pathname !== '/' ? "dropdown__2" : "dropdown__"}`}
                onClick={() => setIsDropDown(prev => !prev)}
              >
                <IoPersonCircleOutline />
              </span>

              {isDropDown && (
                <div className="dropdown-container">
                  <ul className="dropdown">
                    {window.location.pathname !== '/Profile' && (
                      <li>
                        <Link
                          to="/Profile"
                          className={`nav-link ${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"}`}
                          onClick={() => {
                            setIsOpen(false);
                            setIsDropDown(false);
                          }}
                        >
                          {t('navbar.yourProfile')}
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        onClick={() => {
                          handeleLogOut();
                          setIsOpen(false);
                          setIsDropDown(false);
                        }}
                        className={`nav-link ${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"}`}
                      >
                        {t('navbar.logOut')}
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          )}

          {/* Auth Links */}
          {!token && (
            <>
              {window.location.pathname !== '/Login' && (
                <li className="nav-item">
                  <Link
                    to="/Login"
                    className={`nav-link ${window.location.pathname === "/" ? "sec" : "secProfile"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {t('navbar.logIn')}
                  </Link>
                </li>
              )}

              {window.location.pathname !== '/Regester' && (
                <li className="nav-item">
                  <Link
                    to="/Regester"
                    className={`nav-link ${window.location.pathname === "/" ? "sec" : "secProfile"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {t('navbar.signUp')}
                  </Link>
                </li>
              )}
            </>
          )}

          {/* Dark Mode */}
          <li className="nav-item">
            <DarkMoode />
          </li>
        </ul>

        {/* Hamburger Menu */}
        <div
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className="bar"
            style={window.location.pathname === '/' ? { backgroundColor: 'white' } : {}}
          ></span>
          <span
            className="bar"
            style={window.location.pathname === '/' ? { backgroundColor: 'white' } : {}}
          ></span>
          <span
            className="bar"
            style={window.location.pathname === '/' ? { backgroundColor: 'white' } : {}}
          ></span>
        </div>
      </div>
    </nav>
  );
}

export default NaveBare;