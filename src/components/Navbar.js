import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import logo from '../images/logo.jpg';
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

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

  useEffect(() => {
    showButton();
    window.addEventListener("resize", showButton);
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
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
              style={{ width: "50px", height: "auto" }}
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
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/products"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/tax-invoice"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Tax Invoice
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/purchase-bill"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Purchase Bill
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/quotation"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Quotation
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/ledger"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Ledger
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/labor-supply"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Labor Supply
              </Link>
            </li>
            {!button && (
              <li>
                <Link
                  to="/sign-up"
                  className="nav-links-mobile"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </li>
            )}
          </ul>
          {button && <Button buttonStyle="btn--outline">SIGN UP</Button>}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
