import React, { useState } from "react";
import { FaUsersGear } from "react-icons/fa6";
import { HiArrowCircleRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import "./ITRequest.css"; // Import custom CSS file for animations
import ConnectMe from "../../config/connect";

export default function ITRequest() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false); // State to handle hover effect

  return (
    <div
      className="card mb-3 "
      // onClick={() => {
      //   navigate("/ITService");
      // }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: "pointer", borderRadius: "10px" }}
    >
      <div className="card-header d-flex justify-content-between align-items-center ">
        <div className="d-flex align-items-center">
          <FaUsersGear className="me-2" size={24} />
          <h5 className="mb-0">IT Request</h5>
        </div>

      </div>
      <div
  className={`card-body d-flex justify-content-center align-items-center ${isHovered ? "hovered" : ""}`}
  style={{ 
    height: "100%",  // Make sure the parent div covers the full height
    width: "100%",   // Ensure full width
    overflow: "hidden", // Hide any overflow content
    position: "relative" // Helps with absolute positioning if needed
  }}
>
  <video
    src={`${ConnectMe.img_URL}/uploads/videocard/garware.mp4`}
    controls
    autoPlay
    muted
    style={{
      width: "100%",  // Ensure the video takes full width
      height: "100%", // Ensure full height
      objectFit: "cover", // Fills the frame while maintaining aspect ratio
      borderRadius: "5px",
    }}
  >
    Your browser does not support the video tag.
  </video>
</div>
    </div>
  );
}
