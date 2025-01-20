import React from "react";
import "./Sidebar.css";
import {
  FaTachometerAlt,
  FaImages,
  FaUsers,
  FaServicestack,
  FaFileInvoice,
  FaCog,
  FaSignOutAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";





export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/upload-banners" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>upload-banners</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/announcements" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>Announcements</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/csr" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>CSR</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/industry" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>Industry News</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/photosVideo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>Photos-Videos</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/qlink" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>Quick Links</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/ManagementMessage" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>Management Message</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/awards" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>Awards</span>
          </Link>
        </li>
        {/* <li>
          <Link to="/admin/CalenderHoliday" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>CalenderHoliday</span>
          </Link>
        </li> */}
        <li>
          <Link to="/admin/it" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>IT</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
