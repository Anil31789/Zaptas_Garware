import React, { useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import "./ITRequest.css"; // Import CSS file for animations

export default function ITRequest() {
  const [isHovered, setIsHovered] = useState(false); // State to handle hover effect

  return (
    <div
      className="card mb-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: "pointer" }}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaPlayCircle className="me-2" size={20} />
          <p className="mb-0">Garware Hi-Tech Films</p>
        </div>
      </div>

      <div
        className={`card-body card-scroll d-flex justify-content-center align-items-center ${
          isHovered ? "hovered" : ""
        }`}
        style={{
          height: "200px",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "10px",
          }}
        >
          {/* Heading with live animation */}
          <h4 className="celebrating-text animated-live">
            One Company, Infinite Possibilities
          </h4>

          {/* Video */}
          <video
  src="./GarwareGoaKochiVideoArvindFinal.mp4"
  controls
  autoPlay
  muted
  loop
  style={{
    width: "120%",
    height: "35vh",
    objectFit: "cover",
    borderRadius: "5px",
  }}
>
  Your browser does not support the video tag.
</video>


          {/* Paragraph - Auto Adjusts */}
          <p style={{ fontSize: "14px", marginTop: "3px", maxWidth: "100%" }}>
            Experience the breathtaking views and cultural richness of Goa and
            Kochi through this captivating visual journey.
          </p>
        <a href="https://www.bseindia.com/stock-share-price/garware-polyester-ltd/garwarpoly/500655/" target="_blank" className="celebrating-text blinking-link">Today's GHFL share price</a>
        </div>
      </div>
    </div>
  );
}
