import React, { useState, useEffect } from "react";
import {  FaRegMoon } from "react-icons/fa";
import { IoSunnySharp } from "react-icons/io5";
function DarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDark(true);
      setDarkMode();
    } else {
      setLightMode();
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      setLightMode();
      localStorage.setItem("theme", "light");
    } else {
      setDarkMode();
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
  };

  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="dark-toggle"
      aria-label="Toggle dark mode"
    >
      {dark ? (
        <FaRegMoon className="icon moon" />
      ) : (
        <IoSunnySharp  className="icon sun" />
      )}
    </button>
  );
}

export default DarkMode;
