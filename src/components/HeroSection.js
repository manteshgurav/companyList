import React from "react";
import "../App.css";
import { Button } from "./Button";
import "./HeroSection.css";

function HeroSection() {
  return (
    <div className="hero-container">
      <video src="/videos/video-2.mp4" autoPlay loop muted />
      <div className="hero-content">
        <h1>K M Enterprises</h1>
        <p>Experts in Coatings & Industrial Works</p>
        <div className="hero-btns">
          <Button
            className="btns"
            buttonStyle="btn--outline"
            buttonSize="btn--large"
          >
            GET STARTED
          </Button>
          <Button
            className="btns"
            buttonStyle="btn--primary"
            buttonSize="btn--large"
            onClick={() => console.log("Contact Us")}
          >
            CONTACT US <i className="fas fa-phone-alt" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
