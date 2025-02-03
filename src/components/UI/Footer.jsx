import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import "./Footer.css";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Social Media Icons */}
      <div className="footer-social-icons text-center mb-3">
        <a
          href="https://www.facebook.com/garwareppf01/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon mx-2"
        >
          <FaFacebookF size={20} />
        </a>
        <a
          href="https://x.com/garwarehitech"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon mx-2"
        >
          <FaSquareXTwitter size={20} />
        </a>
        <a
          href="https://www.instagram.com/garwarehitechfilms/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon mx-2"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="https://www.linkedin.com/company/garware-hitech-films-limited/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon mx-2"
        >
          <FaLinkedinIn size={20} />
        </a>
        <a
          href="https://www.youtube.com/channel/UCQ4NRwSDqav6nKDmOXBZ2FA"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon mx-2"
        >
          <FaYoutube size={20} />
        </a>
      </div>
      {/* Copyright Text */}
      <div className="footer-bottom text-center mt-4">
        <p>&copy; 2024 Garware Hi Tech Films Limited. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
