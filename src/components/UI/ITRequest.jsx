import React, { useState } from "react";
import { FaUsersGear } from "react-icons/fa6";
import { HiArrowCircleRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import "./ITRequest.css"; // Import custom CSS file for animations
import ConnectMe from "../../config/connect";
import { FaFilm, FaPlayCircle } from "react-icons/fa";

export default function ITRequest() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false); // State to handle hover effect

  return (
    <div
      className="card mb-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: "pointer", borderRadius: "10px" }}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaPlayCircle className="me-2" size={24} />
          <h5 className="mb-0">Garware Hi-Tech Films: Innovating Excellence</h5>
        </div>
      </div>
  
      <div
        className={`card-body d-flex justify-content-center align-items-center ${isHovered ? "hovered" : ""}`}
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
            padding: "20px",
          }}
        >
          {/* Heading - Auto Adjusts */}
          <h4
            style={{
              fontSize: "18px", // Responsive size (min: 16px, max: 32px)
              fontWeight: "bold",
              zIndex: 1,
              marginBottom: "20px",
              maxWidth:"100%",
            }}
            className="celebrating-text"
          >
            One Company, Infinite Solutions
          </h4>
  
          {/* Video */}
          <video
            src="./GarwareGoaKochiVideoArvindFinal.mp4"
            controls
            autoPlay
            muted
            style={{
              width: "100%",
              height: "35vh",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          >
            Your browser does not support the video tag.
          </video>
  
          {/* Paragraph - Auto Adjusts */}
          <p
            style={{
              fontSize: "16px", // Responsive text size
              marginTop: "10px",
              maxWidth: "100%", // Ensures proper width
            }}
          >
            Experience the breathtaking views and cultural richness of Goa and Kochi through this captivating visual journey.
          </p>
        </div>
      </div>
    </div>
  );
  
}
