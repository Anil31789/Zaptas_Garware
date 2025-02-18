import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import {  
  FaHome,  
  FaPlusSquare as FaImagePlus,  
  FaBullhorn as FaMegaphone,  
  FaHandsHelping as FaHandHelping,  
  FaNewspaper,  
  FaImages as FaImage,  
  FaLink,  
  FaCommentAlt as FaMessageSquare,  
  FaAward,  
  FaServer
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <li>
            <FaHome /> <span>Home</span>
          </li>
        </Link>
        <Link to="/admin/upload-banners" style={{ textDecoration: 'none', color: 'inherit' }}>
          <li>
            <FaImagePlus /> <span>Upload Banners</span>
          </li>
        </Link>
        <Link to="/admin/announcements" style={{ textDecoration: 'none', color: 'inherit' }}>
          <li>
            <FaMegaphone /> <span>Announcements</span>
          </li>
        </Link>
        <Link to="/admin/csr" style={{ textDecoration: 'none', color: 'inherit' }}>
          <li>
            <FaHandHelping /> <span>CSR</span>
          </li>
        </Link>
        <Link to="/admin/industry" style={{ textDecoration: 'none', color: 'inherit' }}>
          <li>
            <FaNewspaper /> <span>Industry News</span>
          </li>
        </Link>
        <Link to="/admin/photosVideo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <li>
            <FaImage /> <span>Photos-Videos</span>
          </li>
        </Link>
        <Link to="/admin/qlink" style={{ textDecoration: 'none', color: 'inherit' }}>
          <li>
            <FaLink /> <span>Quick Links</span>
          </li>
        </Link>
        <Link to="/admin/ManagementMessage" style={{ textDecoration: 'none', color: 'inherit' }}>
          <li>
            <FaMessageSquare /> <span>Management Message</span>
          </li>
        </Link>
        <Link to="/admin/awards" style={{ textDecoration: 'none', color: 'inherit' }}>
          <li>
            <FaAward /> <span>Awards</span>
          </li>
        </Link>
        <Link to="/admin/it" style={{ textDecoration: 'none', color: 'inherit' }}>
          <li>
            <FaServer /> <span>IT</span>
          </li>
        </Link>


        <Link to="/admin/telephone" style={{ textDecoration: 'none', color: 'inherit' }}>
          <li>
            <FaServer /> <span>telephone directory</span>
          </li>
        </Link>
      </ul>
    </div>
  );
}
