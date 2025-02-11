import React, { useEffect, useState } from "react";
import { FaHandshake } from "react-icons/fa";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import SendEmailPopup from "./sendMailPopup";
import "./BirthdayBox.css"; // Ensure styles are imported

export default function NewJoiners() {
  const [newJoiners, setNewJoiners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch new joiners data
  const fetchNewJoiners = async () => {
    try {
      setLoading(true);
      const url = `${ConnectMe.BASE_URL}/hrms/joined-today`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);
      if (response.success && response?.data?.joinedToday?.length > 0) {
        setNewJoiners(response?.data?.joinedToday);
      }
    } catch (err) {
      setError("Error fetching new joiners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewJoiners();
  }, []);

  const handleNext = () => {
    if ((currentIndex + 1) * 4 < newJoiners.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div
      className="card mb-3"
      style={{ cursor: "pointer", borderRadius: "10px" }}
    >
      {/* Card Header */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaHandshake className="me-2" size={24} />
          <h5 className="mb-0">New Joiners</h5>
        </div>
      </div>

      {/* Card Body - Carousel */}
      <div className="card-body">
        {newJoiners.length > 0 ? (
          <div
            id="newJoinersCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="false"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="row">
                  {newJoiners
                    .slice(currentIndex * 4, currentIndex * 4 + 4)
                    .map((joiner, index) => (
                      <div className="col-md-3" key={index}>
                        <div className="wish-card shadow-sm">
                          <div className="user-image">
                            <img
                              src={joiner?.images?.imagePath
                                ? `${ConnectMe.img_URL}${joiner?.images?.imagePath}`
                                : "./user.png"}
                              alt="User"
                              className="rounded-circle"
                            />
                          </div>

                          <div className="wish-content">
                            <h5 className="title card-text text-danger fw-bold celebrating-text">
                              {`${joiner?.FirstName || ""} ${joiner?.MiddleName || ""} ${joiner?.LastName || ""}`.trim()}
                            </h5>
                            <p className="message">{joiner.CustomField6 || "Support"}</p>
                            <div className="info">
                              <span className="date">
                                <FaHandshake className="icon" />{" "}
                                {new Date(joiner.JoinDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="d-flex justify-content-center">
                              <button
                                className="send-wish-btn"
                                onClick={() => {
                                  setSelectedEmployee(joiner);
                                  setShowPopup(true);
                                }}
                              >
                                Make a wish!
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Previous & Next Buttons */}
            <button
              className="carousel-control-prev"
              type="button"
              onClick={handlePrev}
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              onClick={handleNext}
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        ) : (
          <div>No new joiners found.</div>
        )}
      </div>

      {/* Send Email Popup */}
      {showPopup && (
        <SendEmailPopup
          show={showPopup}
          handleClose={() => setShowPopup(false)}
          recipient={selectedEmployee}
          personalName={`${selectedEmployee?.FirstName || ""} ${
            selectedEmployee?.MiddleName || ""
          } ${selectedEmployee?.LastName || ""}`.trim()}
          type="joinComments"
        />
      )}
    </div>
  );
}
