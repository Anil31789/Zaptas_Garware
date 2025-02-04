import { useState, useEffect } from "react";
import { FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import "./BirthdayBox.css";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import SendEmailPopup from "./sendMailPopup";

export default function BirthdayBox() {
  const [birthdayWishes, setBirthdayWishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectEmail, setSelectEmail] = useState(null)
  const [selectName, setSelectName] = useState(null)

  const handleNext = () => {
    if ((currentIndex + 1) * 3 < birthdayWishes.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Fetch birthday wishes using the API
  const fetchBirthdayWishes = async () => {
    try {
      setLoading(true); // Show loader while fetching
      const url = `${ConnectMe.BASE_URL}/hrms/birthday-wishes`; // Replace with actual URL
      const token = getTokenFromLocalStorage(); // Assuming the token is stored in localStorage
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);
      if (response.success) {
        setBirthdayWishes(response?.data?.birthdayWishes);
      } else {
        setError("Failed to fetch birthday wishes.");

      }
    } catch (err) {
      setError("Error fetching birthday wishes.");
      // setBirthdayWishes(sampleData2); // Use sample data in case of error
    } finally {
      setLoading(false); // Hide loader after fetching
    }
  };

  useEffect(() => {
    fetchBirthdayWishes();
  }, []);

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
            <FaBirthdayCake style={{ fontSize: '2.2rem', marginRight: '15px', color: '#ffffff' }} />
            Get Ready for the Big Day: Birthday Eve!
          </div>


          {/* <div className="card-body card-scroll d-flex align-items-center justify-content-center ">
                   <button className="  card-header">
                    <FaBirthdayCake /> &nbsp;Birthday Eves
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
          {birthdayWishes.length > 0 ? (
            <>
              <div className="carousel-item active">
                <div className="row">
                  {birthdayWishes
                    .slice(currentIndex * 4, currentIndex * 4 + 4)
                    .map((wish, index) => (
                      <div className="col-md-3" key={index}>
                        <div className="wish-card shadow-sm" style={{
                          backgroundImage: "url(./birthday-cake.png)",

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
                                 {/* <p className="message">{`Employee Code: ${wish.EmployeeCode}`}</p> */} 
                            <div className="info">
                              <span className="date">
                                <FaBirthdayCake className="icon" />{" "}
                                {new Date(wish.BirthDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",

                                  }
                                )}
                              </span>
                            </div>
                            <div className="d-flex justify-content-center">

                              <button className="send-wish-btn" onClick={(() => {
                                setSelectEmail(wish)
                                setSelectName(`${wish?.FirstName || ''} ${wish?.MiddleName || ''} ${wish?.LastName || ''}`.trim())
                               // setSelectName(`${wish?.FirstName || ''} ${wish?.MiddleName || ''} ${wish?.LastName || ''}`.trim())
                                setShowPopup(true)
                              })}>
                                Make a wish!
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
                    type={`BDaycomments`}
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
