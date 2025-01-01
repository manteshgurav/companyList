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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/services" element={<Services />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/tax-invoice" element={<TaxInvoice />} />
          <Route path="/purchase-bill" element={<PurchaseBill />} />
          <Route path="/quotation" element={<Quotation />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/labor-supply" element={<LaborSupply />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
