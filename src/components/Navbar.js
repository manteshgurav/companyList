import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import logo from "../images/logo.jpg";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleClick = () => {
    setClick(!click);
    if (!click) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  };

  const closeMobileMenu = () => {
    setClick(false);
    document.body.classList.remove("no-scroll");
  };

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  const handleResize = () => {
    if (window.innerWidth > 960 && click) {
      closeMobileMenu();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userCredentials");
    setIsLoggedIn(false);
    closeMobileMenu();
  };

  useEffect(() => {
    const credentials = localStorage.getItem("userCredentials");
    if (credentials) {
      setIsLoggedIn(true);
    }
    showButton();
    window.addEventListener("resize", showButton);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", showButton);
      window.removeEventListener("resize", handleResize);
      document.body.classList.remove("no-scroll");
    };
  }, [click]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: "78px", height: "auto" }}
            />
          </Link>

          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/services"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Coating Services
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/products"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Coating Products
              </Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link
                  to="/tax-invoice"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Tax Invoice
                </Link>
              </li>
            )}
            <div className="spacer"></div>
            {!isLoggedIn && (
              <li className="nav-item">
                <Link
                  to="/login"
                  className="nav-links-mobile"
                  onClick={closeMobileMenu}
                >
                  <button className="btn btn--outline">Log In</button>
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li className="nav-item">
                <Button
                  buttonStyle="btn--outline"
                  className="nav-links-signup"
                  onClick={handleLogout}
                >
                  LOGOUT
                </Button>
              </li>
            )}
            {/* {!isLoggedIn && button && (
              <li className="nav-item">
                <Button buttonStyle="btn--outline" className="nav-links-signup">
                  <Link to="/login">Log In</Link>
                </Button>
              </li>
            )} */}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
