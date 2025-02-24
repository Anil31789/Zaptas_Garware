import React, { useEffect, useState } from "react";
import { FaLaptopCode } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import { HiArrowCircleRight } from "react-icons/hi";
import { FaUserPlus, FaUserMinus, FaNetworkWired, FaMobileAlt, FaServer, FaCogs, FaVideo, FaUserShield, FaEnvelope, FaLaptop } from "react-icons/fa";

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

  // Map each service name to a corresponding icon
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
    "new email creation 2 test": <FaEnvelope className="me-2 text-danger" />,
  };

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaLaptopCode className="me-2" size={20} />
          <h5 className="mb-0">IT Services</h5>
        </div>
        <a
          className="text-decoration-none"
          onClick={() => navigate("/service", { state: { status: "My Requests" } })}
        >
          My Requests <HiArrowCircleRight />
        </a>
      </div>
      <div className="card-body">
        <ul className="list-unstyled">
          <ul className="ps-3">
            {isLoading ? (
              <li className="text-muted">Loading...</li>
            ) : (
              serviceTypes.map((service) => (
                <li key={service.id} className="mb-1 d-flex align-items-center">
                  {serviceIcons[service.name] || <FaServer className="me-2 text-muted" />}
                  <a
                    href="#"
                    className="text-decoration-none"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/ITService", { state: { id: service._id } });
                    }}
                  >
                    {service.name}
                  </a>
                </li>
              ))
            )}
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default IT;
