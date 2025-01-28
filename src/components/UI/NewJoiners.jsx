import React, { useCallback, useEffect, useState } from "react";
import "./BirthdayBox.css";
import { FaBirthdayCake, FaHandshake, FaMapMarkerAlt } from "react-icons/fa";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import SendEmailPopup from "./sendMailPopup";

export default function NewJoiners() {
  const [workAnniversaries, setWorkAnniversaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectEmail, setSelectEmail] = useState(null)
  const [selectName, setSelectName] = useState(null)
  const handleNext = () => {
    if ((currentIndex + 1) * 3 < workAnniversaries.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const fetchWorkAnniversaries = async () => {
    try {
      setLoading(true); // Show loader while fetching
      const url = `${ConnectMe.BASE_URL}/hrms/joined-today`; // Replace with actual URL
      const token = getTokenFromLocalStorage(); // Assuming the token is stored in localStorage
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);
      if (response.success && response?.data?.joinedToday?.length > 0) {
        setWorkAnniversaries(response?.data?.joinedToday);
      }
    } catch (err) {
      setError("Error fetching work anniversaries. Showing sample data.");
      // Set sample data in case of error

    } finally {
      setLoading(false); // Hide loader after fetching
    }
  };

  useEffect(() => {
    fetchWorkAnniversaries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className=" wish mb-5">
          <div className="card-header" style={{
            background: 'linear-gradient(90deg, #6d6f72, #a1a3a6)',
            color: '#fff',
            padding: '2px 5px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <FaHandshake
              style={{
                fontSize: '2.2rem',
                marginRight: '15px',
                color: '#ffffff',
              }}
            />
            Welcome Aboard, New Joiners!
          </div>
          {/* <div className="card-body card-scroll d-flex align-items-center justify-content-center">
                  <button className="btn btn-primary cartbtn">
                    Work Anniversary
                  </button>
                </div> */}
        </div>
      </div>

      <div
        id="birthdayCarousel"
        className="carousel slide col-md-12"
        data-bs-ride="carousel"
        data-bs-interval="false"
      >
        {/* Carousel Items */}
        <div className="carousel-inner">
          {workAnniversaries.length > 0 ? (
            <>
              <div className="carousel-item active">
                <div className="row">
                  {workAnniversaries
                    .slice(currentIndex * 4, currentIndex * 4 + 4)
                    .map((wish, index) => (
                      <div className="col-md-3" key={index}>
                        <div className="wish-card shadow-sm">
                          <div className="user-image">
                            <img
                              src={wish?.images?.imagePath ? `${ConnectMe.img_URL}${wish?.images?.imagePath}` : "./user.png"} // Check if `userImage` exists, else fallback to default
                              alt="User"
                              className="rounded-circle"
                            />
                          </div>

                          <div className="wish-content">
                            <h5 className="title card-text text-danger fw-bold celebrating-text">
                              {`${wish?.FirstName || ''} ${wish?.MiddleName || ''} ${wish?.LastName || ''}`.trim()}
                            </h5>
                            <p className="message">{wish.CustomField6 || "Support"}</p>
                            <p className="message">{`Employee Code: ${wish.EmployeeCode}`}</p>
                            <div className="info">
                              <span className="date">
                                <FaHandshake className="icon" />{" "}
                                {new Date(wish.JoinDate).toLocaleDateString(
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
                              {" "}
                              <button className="send-wish-btn" onClick={(() => {
                                setSelectEmail(wish)
                                 setSelectName(`${wish?.FirstName || ''} ${wish?.MiddleName || ''} ${wish?.LastName || ''}`.trim())
                                setShowPopup(true)
                              })}>
                                Comment
                              </button>

                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  {showPopup && <SendEmailPopup
                    show={showPopup}
                    handleClose={() => setShowPopup(false)}
                    recipient={selectEmail}
                    personalName={selectName}
                  // personalName={`${wish?.FirstName || ''} ${wish?.MiddleName || ''} ${wish?.LastName || ''}`.trim()}
                  />}
                </div>
              </div>
            </>
          ) : (
            <div>No new joiners found.</div>
          )}
        </div>

        {/* Previous and Next controls */}
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
    </div>
  );
}
