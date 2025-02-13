import { useState, useEffect } from "react";
import { FaBirthdayCake } from "react-icons/fa";
import "./BirthdayBox.css";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import SendEmailPopup from "./sendMailPopup";

// Sample Data (Updated with BirthDate)
const datadb = [
  {
    FirstName: "Amit",
    MiddleName: "Kumar",
    LastName: "Sharma",
    CustomField6: "Software Engineer",
    BirthDate: "2024-02-10",
    images: { imagePath: "/images/amit.jpg" }
  },
  {
    FirstName: "Priya",
    MiddleName: "",
    LastName: "Singh",
    CustomField6: "Product Manager",
    BirthDate: "2024-02-09",
    images: { imagePath: "/images/priya.jpg" }
  },
  {
    FirstName: "Rahul",
    MiddleName: "Dev",
    LastName: "Mishra",
    CustomField6: "UI/UX Designer",
    BirthDate: "2024-02-08",
    images: { imagePath: "/images/rahul.jpg" }
  },
  {
    FirstName: "Sneha",
    MiddleName: "",
    LastName: "Verma",
    CustomField6: "HR Executive",
    BirthDate: "2024-02-07",
    images: { imagePath: "/images/sneha.jpg" }
  },
  {
    FirstName: "Vikram",
    MiddleName: "Raj",
    LastName: "Patil",
    CustomField6: "Marketing Specialist",
    BirthDate: "2024-02-06",
    images: { imagePath: "/images/vikram.jpg" }
  }
];

export default function BirthdayBox() {
  const [birthdayWishes, setBirthdayWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchBirthdayWishes = async () => {
      setLoading(true); // Ensure loading is true before fetching data
      try {
        const url = `${ConnectMe.BASE_URL}/hrms/birthday-wishes`;
        const token = getTokenFromLocalStorage();
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
  
        const response = await apiCall("GET", url, headers);
  
        if (response.success && response?.data?.birthdayWishes?.length > 0) {
          setBirthdayWishes(response?.data?.birthdayWishes);
        } else {
          // If API returns empty or unsuccessful, use datadb
          setBirthdayWishes(datadb);
        }
      } catch (err) {
        console.error("Error fetching birthday wishes:", err);
        setBirthdayWishes(datadb); // Ensure fallback data is set
        setError("Error fetching birthday wishes.");
      } finally {
        setLoading(false); // Ensure loading is false after fetch attempt
      }
    };
  
    fetchBirthdayWishes();
  }, []);
  

  // Auto-loop every 2 seconds
  useEffect(() => {
    if (birthdayWishes.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % birthdayWishes.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [birthdayWishes]);

  const handleNext = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % birthdayWishes.length);
  const handlePrev = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + birthdayWishes.length) % birthdayWishes.length);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="card mb-3 birthday-card" style={{ cursor: "pointer", borderRadius: "10px" }}>
      {/* Card Header */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaBirthdayCake className="me-2" size={24} />
          <h5 className="mb-0">Birthday Wishes</h5>
        </div>
      </div>

      {/* Vertical Carousel */}
      <div className="card-body d-flex flex-column align-items-center">
        {birthdayWishes.length > 0 ? (
          <div className="vertical-carousel-container">
            <button className="carousel-control-up" onClick={handlePrev}>▲</button>
            <div className="vertical-carousel">
              <div className="wish-card shadow-sm">
                <div className="user-image">
                  <img
                    src={
                      birthdayWishes[currentIndex]?.images?.imagePath
                        ? `${ConnectMe.img_URL}${birthdayWishes[currentIndex]?.images?.imagePath}`
                        : "/images/default-user.png"
                    }
                    alt="User"
                    className="rounded-circle"
                  />
                </div>
                <div className="wish-content text-center">
                  <h5 className="title card-text text-danger fw-bold celebrating-text">
                    {`${birthdayWishes[currentIndex]?.FirstName || ""} ${birthdayWishes[currentIndex]?.MiddleName || ""} ${birthdayWishes[currentIndex]?.LastName || ""}`.trim()}
                  </h5>
                  <p className="message">{birthdayWishes[currentIndex]?.CustomField6 || "Support"}</p>
                  <div className="info">
                    <span className="date">
                      <FaBirthdayCake className="icon" />{" "}
                      {new Date(birthdayWishes[currentIndex]?.BirthDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <button
                    className="send-wish-btn mt-2"
                    onClick={() => {
                      setSelectedEmployee(birthdayWishes[currentIndex]);
                      setShowPopup(true);
                    }}
                  >
                    Make a wish!
                  </button>
                </div>
              </div>
            </div>
            <button className="carousel-control-down" onClick={handleNext}>▼</button>
          </div>
        ) : (
          <div>No birthdays today.</div>
        )}
      </div>

      {/* Send Email Popup */}
      {showPopup && (
        <SendEmailPopup
          show={showPopup}
          handleClose={() => setShowPopup(false)}
          recipient={selectedEmployee}
          personalName={`${selectedEmployee?.FirstName || ""} ${selectedEmployee?.MiddleName || ""} ${selectedEmployee?.LastName || ""}`.trim()}
          type="BDaycomments"
        />
      )}
    </div>
  );
}
