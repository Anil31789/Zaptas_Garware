import React, { useEffect, useState } from "react";
import { FaLaptopCode } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import { Accordion } from "react-bootstrap";
import { HiArrowCircleRight } from "react-icons/hi";
import {
  FaUserPlus, FaUserMinus, FaNetworkWired, FaMobileAlt, FaCogs, FaVideo, 
  FaUserShield, FaEnvelope, FaLaptop, FaUsers, FaServer, FaTools, FaAt
} from "react-icons/fa";

const IT = () => {
  const navigate = useNavigate();
  const [serviceTypes, setServiceTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      setIsLoading(true);
      try {
        const url = `${ConnectMe.BASE_URL}/it/api/service-types`;
        const token = getTokenFromLocalStorage();
        const headers = { Authorization: `Bearer ${token}` };
        const response = await apiCall("GET", url, headers);

        if (response?.data?.length) {
          setServiceTypes(response.data);
        } else {
          console.error("Failed to fetch service types.");
        }
      } catch (error) {
        console.error("Error fetching service types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceTypes();
  }, []);

  // Service categories with icons
  const itServices = [
    {
      title: "User Management",
      icon: <FaUsers className="me-2 text-primary" />,
      services: ["SAP ID Creation", "Users Deletion", "New Users addition"],
    },
    {
      title: "Network & VPN",
      icon: <FaServer className="me-2 text-success" />,
      services: ["Internet / VPN (Employee)", "Internet / VPN (Guest)"],
    },
    {
      title: "Software & Access",
      icon: <FaTools className="me-2 text-warning" />,
      services: ["Form for New Software", "CCTV Camera Access", "IT Equipment Access"],
    },
    {
      title: "Email Services",
      icon: <FaAt className="me-2 text-danger" />,
      services: ["New Email Creation", "Form for Email on Mobile"],
    },
  ];

  // Icons mapping for services
  const serviceIcons = {
    "SAP ID Creation": <FaUserPlus className="me-2 text-primary" />,
    "Users Deletion": <FaUserMinus className="me-2 text-danger" />,
    "Internet / VPN (Employee)": <FaNetworkWired className="me-2 text-info" />,
    "Form for Email on Mobile": <FaMobileAlt className="me-2 text-success" />,
    "IT Equipment Access": <FaLaptop className="me-2 text-warning" />,
    "Form for New Software": <FaCogs className="me-2 text-secondary" />,
    "CCTV Camera Access": <FaVideo className="me-2 text-dark" />,
    "Internet / VPN (Guest)": <FaUserShield className="me-2 text-primary" />,
    "New Users addition": <FaUserPlus className="me-2 text-success" />,
    "New Email Creation": <FaEnvelope className="me-2 text-danger" />,
  };

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaLaptopCode className="me-2" size={20} />
          <p className="mb-0">IT Services</p>
        </div>
        <a
          className="text-decoration-none"
          onClick={() => navigate("/service", { state: { status: "My Requests" } })}
        >
          My Requests <HiArrowCircleRight />
        </a>
      </div>
      <div className="card-body">
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

        {isLoading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <Accordion defaultActiveKey="0">
            {/* IT Services (default open) */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>IT Services</Accordion.Header>
              <Accordion.Body>
                <Accordion>
                  {itServices.map((category, index) => (
                    <Accordion.Item eventKey={`sub-${index}`} key={index}>
                      <Accordion.Header>
                        {category.icon} {category.title}
                      </Accordion.Header>
                      <Accordion.Body>
                        <ul className="list-unstyled">
                          {category.services.map((service, i) => (
                            <li key={i} className="mb-1 d-flex align-items-center">
                              {serviceIcons[service] || <FaLaptop className="me-2 text-muted" />}
                              <a
                                href="#"
                                className="text-decoration-none"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate("/ITService", { state: { name: service } });
                                }}
                              >
                                {service}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default IT;
