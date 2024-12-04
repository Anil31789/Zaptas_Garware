import { useState, useEffect } from "react";
import { FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import "./BirthdayBox.css";
import ConnectMe from "../../config/connect";
import { apiCall } from "../../utils/apiCall";

export default function BirthdayBox() {
  const [birthdayWishes, setBirthdayWishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);

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
      const token = localStorage.getItem("authToken"); // Assuming the token is stored in localStorage
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
    } finally {
      setLoading(false); // Hide loader after fetching
    }
  };

  useEffect(() => {
    fetchBirthdayWishes();
  }, []);

  return (
    <div className="row">
      <div className="col-md-3">
        <div className="card text-center wish">
          <div className="card-header">
            <FaBirthdayCake /> &nbsp; Birthday Wishes
          </div>
          <div className="card-body d-flex align-items-center justify-content-center">
            <button className="btn btn-primary cartbtn">Birthday</button>
          </div>
        </div>
      </div>

      <div
        id="birthdayCarousel"
        className="carousel slide col-md-8"
        data-bs-ride="carousel"
        data-bs-interval="false"
      >
        {/* Carousel Items */}
        <div className="carousel-inner">
          {loading && <div>Loading...</div>}
          {error && <div>{error}</div>}
          {birthdayWishes.length > 0 ? (
            <>
              {/* Display the current slide */}
              <div className="carousel-item active">
                <div className="row">
                  {birthdayWishes
                    .slice(currentIndex * 3, currentIndex * 3 + 3)
                    .map((wish, index) => (
                      <div className="col-md-4" key={index}>
                        <div className="wish-card">
                          <div className="user-image">
                            <img
                              src="./user.png"
                              alt="User"
                              className="rounded-circle"
                            />
                          </div>
                          <div className="wish-content">
                            <h5 className="title">
                              {wish.FirstName} {wish.LastName}
                            </h5>
                            <p className="message">{`Employee Code: ${wish.EmployeeCode}`}</p>
                            <p className="message">{wish.CustomField6}</p>
                            <div className="info">
                           
                              <span className="date">
                                <FaBirthdayCake className="icon" />{" "}
                                {new Date(wish.BirthDate).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            </div>
                            <button className="send-wish-btn">Send Wish</button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div>No birthday wishes found.</div>
          )}
        </div>

        {/* Previous and Next controls */}
        <button
          className="carousel-control-prev"
          type="button"
          onClick={handlePrev}
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          onClick={handleNext}
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );

}
