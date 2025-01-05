import React from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import TaxInvoice from "./components/pages/TaxInvoice";
import PurchaseBill from "./components/pages/PurchaseBill";
import Quotation from "./components/pages/Quotation";
import Ledger from "./components/pages/Ledger";
import LaborSupply from "./components/pages/LaborSupply";
import Services from "./components/pages/Services";
import Products from "./components/pages/Products";
import SignUp from "./components/pages/SignUp";
import Home from "./components/pages/Home";
import LoginPage from "./components/pages/LoginPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const isLoggedIn = Boolean(localStorage.getItem("userCredentials"));

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Restricted Routes */}
          <Route
            path="/tax-invoice"
            element={isLoggedIn ? <TaxInvoice /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchase-bill"
            element={isLoggedIn ? <PurchaseBill /> : <Navigate to="/login" />}
          />
          <Route
            path="/quotation"
            element={isLoggedIn ? <Quotation /> : <Navigate to="/login" />}
          />
          <Route
            path="/ledger"
            element={isLoggedIn ? <Ledger /> : <Navigate to="/login" />}
          />
          <Route
            path="/labor-supply"
            element={isLoggedIn ? <LaborSupply /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
