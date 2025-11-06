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
  const [isWide, setIsWide] = useState(window.innerWidth > 768);



  const [isLanguageDropDown, setIsLanguageDropDown] = useState(false);
  const languageDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsWide(true);
      } else {
        setIsWide(false);
      }
    };

    window.addEventListener('resize', handleResize);


    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    // Force direction to remain static (LTR) for desktop, but allow RTL for mobile menu
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
      {isWide ? (
        <div className={`nav-container`}>
          {/* Logo */}
          <Link className="nav-logo" to={"/"}><img src={imag2} alt="Logo" /></Link>

          {/* Navigation Links */}
          <ul
            className={`nav-menu ${isOpen ? "active" : ""}`}
            data-lang={i18n.language} // Add data attribute for language
          >
            {/* Regular menu items */}
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


            {/* Language Switcher - Now as regular list item */}
            <li className="nav-item" ref={languageDropdownRef}>
              <span
                className={`dropdown-icon ${window.location.pathname !== '/' ? "dropdown__2" : "dropdown__"}`}
                onClick={() => setIsLanguageDropDown(prev => !prev)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: window.location.pathname === "/" ? "2px solid white" : "2px solid gray",
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {i18n.language === 'en' ? 'English' : 'العربية'}
                </span>

              </span>

              {isLanguageDropDown && (
                <div className="dropdown-container">
                  <ul className="dropdown">
                    <li>
                      <span
                        className={`nav-link ${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"}`}
                        onClick={() => {
                          changeLanguage('en');
                          setIsLanguageDropDown(false);
                        }}
                        style={{
                          display: 'block',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textDecoration: 'none',
                          color: "black"
                        }}
                      >
                        English
                      </span>
                    </li>
                    <li>
                      <span
                        className={`nav-link ${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"}`}
                        onClick={() => {
                          changeLanguage('ar');
                          setIsLanguageDropDown(false);
                        }}
                        style={{
                          display: 'block',
                          // padding: '10px 16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textDecoration: 'none',
                          marginTop: "-5px",
                          color: "black"
                        }}
                      >
                        العربية
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            {/* User Dropdown - Now as regular list items in mobile */}
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


                      {window.location.pathname !== '/myOrder' && (
                        <li>
                          <Link
                            to="/myOrder"
                            className={`nav-link ${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"}`}
                            onClick={() => {
                              setIsOpen(false);
                              setIsDropDown(false);
                            }}
                          >
                            {t('navbar.MyOrder') || "MY Order" }
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

        </div>
      ) : (
        <>
          <div
            className={`nav-overlay ${isOpen ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          ></div>

          <div className={`nav-container`}>
            {/* Logo */}
            <Link className="nav-logo" to={"/"}><img src={imag2} alt="Logo" /></Link>

            {/* Navigation Links */}
            <ul
              className={`nav-menu ${isOpen ? "active" : ""}`}
              data-lang={i18n.language} // Add data attribute for language
            >
              {/* Regular menu items */}
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


              {/* User Dropdown - Now as regular list items in mobile */}




              {token && (
                <>
                  {window.location.pathname !== '/Profile' && (
                    <li className="nav-item">
                      <Link
                        to="/Profile"
                        className={`nav-link ${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {t('navbar.yourProfile')}
                      </Link>
                    </li>
                  )}


                  <li className="nav-item">
                    <Link
                      onClick={() => {
                        handeleLogOut();
                        setIsOpen(false);
                      }}
                      className={`nav-link ${window.location.pathname !== '/' ? "navbarLinksProfile" : "custom-link"}`}
                    >
                      {t('navbar.logOut')}
                    </Link>
                  </li>
                </>
              )}


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


              {/* Language Switcher - Now as regular list item */}
              <li className="nav-item">
                <div
                  className={`language-switcher ${window.location.pathname !== '/' ? "language_select2" : "language_select"}`}
                  style={{
                    display: "flex",
                    gap: "10px",
                    cursor: "pointer",
                    color: window.location.pathname === '/' ? "white" : "inherit",
                    alignItems: "center",
                    border: "0",
                    fontWeight: "600"
                  }}
                >
                  <span
                    onClick={() => changeLanguage('en')}
                    style={{
                      opacity: i18n.language === 'en' ? 1 : 0.5,
                      textDecoration: i18n.language === 'en' ? 'none' : 'none',
                      transition: "0.3s"
                    }}
                  >
                    English
                  </span>

                  <span style={{ color: window.location.pathname === '/' ? 'white' : 'black' }}>|</span>

                  <span
                    onClick={() => changeLanguage('ar')}
                    style={{
                      opacity: i18n.language === 'ar' ? 1 : 0.5,
                      textDecoration: i18n.language === 'ar' ? 'none' : 'none',
                      transition: "0.3s"
                    }}
                  >
                    العربية
                  </span>
                </div>
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

        </>
      )}





    </nav>
  );
}

export default NaveBare;