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
      // onClick={() => {
      //   navigate("/ITService");
      // }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: "pointer", borderRadius: "10px" }}
    >
      <div className="card-header d-flex justify-content-between align-items-center ">
        <div className="d-flex align-items-center">
          <FaPlayCircle className="me-2" size={24} />
          <h5 className="mb-0">Video</h5>
        </div>

      </div>
      <div
  className={`card-body d-flex justify-content-center align-items-center ${isHovered ? "hovered" : ""}`}
  style={{
    height: "200px",
    width: "100%",
    position: "relative", // Ensure proper positioning of the video inside
    overflow: "hidden", // Prevent overflow issues
  }}
>
  {/* <video
    src="./public/GarwareGoaKochiVideoArvindFinal.mp4"
    controls
    autoPlay
    muted
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover", // Ensures the video fills the container
      position: "absolute",
      top: "0",
      left: "0",
      borderRadius: "5px",
    }}
  >
    Your browser does not support the video tag.
  </video> */}
  <div
  style={{
    position: "relative",
    width: "100%",
    height: "100vh", // Full viewport height
    overflow: "hidden",
  }}
>
  <video
    src="./GarwareGoaKochiVideoArvindFinal.mp4"
    controls
    autoPlay
    muted
    style={{
      width: "100%",
      height: "30%", // Change as needed
      objectFit: "cover", // Ensures the video covers without stretching
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // Centers the video
      borderRadius: "5px",
    }}
  >
    Your browser does not support the video tag.
  </video>
</div>
</div>

    </div>
  );
}
