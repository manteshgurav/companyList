import React from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import TexInvoiceTable from "./components/pages/TexInvoiceTable";
import QuotationTable from "./components/pages/QuotationTable";
import MaterialInTable from "./components/pages/MaterialInTable";
import MaterialOutTable from "./components/pages/MaterialOutTable";
import Services from "./components/pages/Services";
import Products from "./components/pages/Products";
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
            element={
              isLoggedIn ? <TexInvoiceTable /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/quotationTable"
            element={isLoggedIn ? <QuotationTable /> : <Navigate to="/login" />}
          />
          <Route
            path="/materialInTable"
            element={
              isLoggedIn ? <MaterialInTable /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/materialOutTable"
            element={
              isLoggedIn ? <MaterialOutTable /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
