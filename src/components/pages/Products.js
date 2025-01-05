import React from "react";
import "../../App.css";
import "./Product.css";

export default function Services() {
  return (
    <div className="services-container">
      <h1 className="services-title">Our Services</h1>
      <div className="services-content">
        <h2>Industrial Works in Coating and Painting</h2>

        <h3>Service Details</h3>
        <div className="service-detail">
          <h4>Anti-Corrosive Coatings</h4>
          <p>
            <strong>Cost:</strong> ₹50,000 - ₹1,00,000
          </p>
          <p>
            <strong>Duration:</strong> 2-3 days
          </p>
          <p>
            <strong>Advance Payment:</strong> 30% of total cost
          </p>
        </div>

        <div className="service-detail">
          <h4>Epoxy and Polyurethane Coatings</h4>
          <p>
            <strong>Cost:</strong> ₹80,000 - ₹1,50,000
          </p>
          <p>
            <strong>Duration:</strong> 3-5 days
          </p>
          <p>
            <strong>Advance Payment:</strong> 40% of total cost
          </p>
        </div>

        <div className="service-detail">
          <h4>Fire-Resistant Coatings</h4>
          <p>
            <strong>Cost:</strong> ₹60,000 - ₹1,20,000
          </p>
          <p>
            <strong>Duration:</strong> 2-4 days
          </p>
          <p>
            <strong>Advance Payment:</strong> 35% of total cost
          </p>
        </div>

        <div className="service-detail">
          <h4>Specialty Coatings</h4>
          <p>
            <strong>Cost:</strong> ₹70,000 - ₹1,30,000
          </p>
          <p>
            <strong>Duration:</strong> 3-4 days
          </p>
          <p>
            <strong>Advance Payment:</strong> 40% of total cost
          </p>
        </div>

        <div className="service-detail">
          <h4>Surface Preparation & Painting</h4>
          <p>
            <strong>Cost:</strong> ₹40,000 - ₹80,000
          </p>
          <p>
            <strong>Duration:</strong> 2-3 days
          </p>
          <p>
            <strong>Advance Payment:</strong> 25% of total cost
          </p>
        </div>
      </div>
    </div>
  );
}
