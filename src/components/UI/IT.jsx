import React, { useEffect, useState } from "react";
import { FaUserPlus, FaUserMinus, FaKey } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import { HiArrowCircleRight } from "react-icons/hi";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";

const IT = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Home Page Options
  const homeOptions = [
    {
      title: "User Creation/Deletion",
      icon: <FaUserPlus className="me-2 text-primary" size={20} />, // Icon for user creation/deletion
      route: "/ITService",
      state: { name: "User Management" },
    },
    {
      title: "Access Requirement/Revoke",
      icon: <FaKey className="me-2 text-warning" size={20} />, // Icon for access management
      route: "/ITService",
      state: { name: "Access Management" },
    },
  ];

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">IT Services</h5>
        <a
          className="text-decoration-none"
          onClick={() => navigate("/service", { state: { status: "My Requests" } })}
        >
          My Requests <HiArrowCircleRight />
        </a>
      </div>
      <div className="card-body">
        {/* Home Page Options */}
        <div className="mb-4">
          <h6 className="mb-3">Quick Actions</h6>
          <div className="row">
            {homeOptions.map((option, index) => (
              <div className="col-md-6 mb-3" key={index}>
                <button
                  className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                  onClick={() => navigate(option.route, { state: option.state })}
                >
                  {option.icon} {option.title}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* IT Policies Section */}
        <div className="mb-3">
          <ul className="list-group">
            <li className="list-group-item">
              <a
                href={`${ConnectMe.img_URL}/uploads/policy/hr/hrpolicy.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-dark fw-bold"
              >
                📑 IT Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IT;
