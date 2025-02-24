import React, { useEffect, useState } from "react";
import { FaLaptopCode } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import { HiArrowCircleRight } from "react-icons/hi";

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
          <li className="fw-bold">IT Request</li>
          <ul className="ps-3">
            {isLoading ? (
              <li className="text-muted">Loading...</li>
            ) : (
              serviceTypes.map((service) => (
                <li key={service.id} className="mb-1">
                  {/* •{" "} */}
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
