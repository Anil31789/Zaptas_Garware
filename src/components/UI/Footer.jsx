import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaSquareXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left: Company Logo */}
        <div className="footer-logo">
        <img className="companylogo" src="./logo1.png" alt="Logo" />
        </div>

        {/* Center: Social Media Icons */}
        <div className="footer-links">
          <a href="https://www.facebook.com/garwareppf01/" target="_blank" rel="noopener noreferrer">
            <FaFacebookF size={25} />
          </a>
          <a href="https://x.com/garwarehitech" target="_blank" rel="noopener noreferrer">
            <FaSquareXTwitter size={25} />
          </a>
          <a href="https://www.instagram.com/garwarehitechfilms/" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={25} />
          </a>
          <a href="https://www.linkedin.com/company/garware-hitech-films-limited/" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn size={25} />
          </a>
          <a href="https://www.youtube.com/channel/UCQ4NRwSDqav6nKDmOXBZ2FA" target="_blank" rel="noopener noreferrer">
            <FaYoutube size={25} />
          </a>
        </div>
      </div>

      {/* Bottom Left: Copyright Text */}
      <div className="footer-bottom">
        <p>&copy; 2024 Garware Hi Tech Films Limited. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
