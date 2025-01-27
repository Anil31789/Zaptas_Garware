import React, { useEffect, useState } from "react";
import "./BirthdayBox.css";
import { FaAward, FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import SendEmailPopup from "./sendMailPopup";

export default function WorkAnniversary() {
  const [workAnniversaries, setWorkAnniversaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectEmail, setSelectEmail] = useState(null)
  const [selectName, setSelectName] = useState(null)
  const sampleData = [
    {
      FirstName: "John",
      MiddleName: "",
      LastName: "Doe",
      EmployeeCode: "E12345",
      JoinDate: "2015-05-20",
      CustomField6: "5 Years of Excellence",
    },
    {
      FirstName: "Jane",
      MiddleName: "Ann",
      LastName: "Smith",
      EmployeeCode: "E67890",
      JoinDate: "2018-03-15",
      CustomField6: "3 Years of Excellence",
    },
    {
      FirstName: "Emily",
      MiddleName: "",
      LastName: "Davis",
      EmployeeCode: "E11223",
      JoinDate: "2020-07-10",
      CustomField6: "2 Years of Excellence",
    },
  ];

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
      const url = `${ConnectMe.BASE_URL}/hrms/work-anniversary`; // Replace with actual URL
      const token = getTokenFromLocalStorage(); // Assuming the token is stored in localStorage
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);
      if (response.success && response?.data?.workAnniversaries.length > 0) {
        setWorkAnniversaries(response.data.workAnniversaries);
      } else {
        // setWorkAnniversaries(sampleData); // Use sample data if no data is returned
      }
    } catch (err) {
      // setWorkAnniversaries(sampleData); // Use sample data if an error occurs
      setError("Error fetching work anniversaries.");
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



  const calculateYearsOfExcellence = (joinDate) => {
    const today = new Date();
    const joinDateObj = new Date(joinDate);
    const years = today.getFullYear() - joinDateObj.getFullYear();
    const months = today.getMonth() - joinDateObj.getMonth();

    // Calculate the total number of months passed
    const totalMonths = years * 12 + months;

    if (totalMonths < 12) {
      // If less than a year, display the months
      if (totalMonths >= 3 && totalMonths <= 5) {
        return `${totalMonths} months of excellence`; // Adjust for 3-5 months
      } else {
        return "0 years of excellence"; // For less than 3 months
      }
    }

    // If the number of months exceeds 12, return the years
    return `${years} years of excellence`;
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="wish mb-5">
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
            <FaAward style={{ fontSize: '2.2rem', marginRight: '15px', color: '#ffffff' }} />

            One Year Down, Many More to Go! Work Anniversary
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
              {/* Display the current slide */}
              <div className="carousel-item active">
                <div className="row">
                  {workAnniversaries
                    .slice(currentIndex * 4, currentIndex * 4 + 4)
                    .map((wish, index) => (
                      <div className="col-md-3" key={index}>
                        <div className="wish-card shadow-sm" style={{
                          backgroundImage: "url(./wrokann.png)",

                        }}>
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
                            {/* <p className="message">{wish.CustomField6}</p> */}
                            <p className="message">{`Employee Code: ${wish.EmployeeCode}`}</p>
                            <div className="info">
                              <span className="date">
                                <FaAward className="icon" />{calculateYearsOfExcellence(wish.JoinDate)}

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
            <div>No work anniversaries found.</div>
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
