import React, { useEffect, useState } from "react";
import { FaAward } from "react-icons/fa";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import SendEmailPopup from "./sendMailPopup";
import "./BirthdayBox.css";








const datadb = [
  {
    "FirstName": "Amit",
    "MiddleName": "Kumar",
    "LastName": "Sharma",
    "CustomField6": "Software Engineer",
    "JoinDate": "2024-02-10",
    "images": {
      "imagePath": "/images/amit.jpg"
    }
  },
  {
    "FirstName": "Priya",
    "MiddleName": "",
    "LastName": "Singh",
    "CustomField6": "Product Manager",
    "JoinDate": "2024-02-09",
    "images": {
      "imagePath": "/images/priya.jpg"
    }
  },
  {
    "FirstName": "Rahul",
    "MiddleName": "Dev",
    "LastName": "Mishra",
    "CustomField6": "UI/UX Designer",
    "JoinDate": "2024-02-08",
    "images": {
      "imagePath": "/images/rahul.jpg"
    }
  },
  {
    "FirstName": "Sneha",
    "MiddleName": "",
    "LastName": "Verma",
    "CustomField6": "HR Executive",
    "JoinDate": "2024-02-07",
    "images": {
      "imagePath": "/images/sneha.jpg"
    }
  },
  {
    "FirstName": "Vikram",
    "MiddleName": "Raj",
    "LastName": "Patil",
    "CustomField6": "Marketing Specialist",
    "JoinDate": "2024-02-06",
    "images": {
      "imagePath": "/images/vikram.jpg"
    }
  }
]



export default function WorkAnniversary() {
  const [workAnniversaries, setWorkAnniversaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchWorkAnniversaries = async () => {
      try {
        setLoading(true);
        const url = `${ConnectMe.BASE_URL}/hrms/work-anniversary`;
        const token = getTokenFromLocalStorage();
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const response = await apiCall("GET", url, headers);
        if (response.success && response?.data?.workAnniversaries?.length > 0) {
          setWorkAnniversaries(response?.data?.workAnniversaries);
        }
        // else{
        //   setWorkAnniversaries(datadb)
        // }
      } catch (err) {
        setWorkAnniversaries(datadb)
        setError("Error fetching work anniversaries.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkAnniversaries();
  }, []);

  useEffect(() => {
    if (workAnniversaries.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % workAnniversaries.length);
      }, 2000); // Auto-change every 2 seconds

      return () => clearInterval(interval);
    }
  }, [workAnniversaries]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="card mb-3" style={{ cursor: "pointer", borderRadius: "10px" }}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaAward className="me-2" size={20} />
          <p className="mb-0">Work Anniversary</p>
        </div>
      </div>
      <div className="card-body">
        {workAnniversaries.length > 0 ? (
          <div className="vertical-carousel">
            <div className="wish-card shadow-sm">
              <div className="user-image">
                <img
                  src={
                    workAnniversaries[currentIndex]?.images?.imagePath
                      ? `${ConnectMe.img_URL}${workAnniversaries[currentIndex]?.images?.imagePath}`
                      : "./user.png"
                  }
                  alt="User"
                  className="rounded-circle"
                />
              </div>
              <div className="wish-content text-center">
                <h5 className="title card-text text-danger fw-bold celebrating-text">
                  {`${workAnniversaries[currentIndex]?.FirstName || ""} ${workAnniversaries[currentIndex]?.MiddleName || ""} ${workAnniversaries[currentIndex]?.LastName || ""
                    }`.trim()}
                </h5>
               {/* <p className="message">{workAnniversaries[currentIndex]?.CustomField6 || "Support"}</p> */}
                <div className="info">
                  <span className="date">
                    <FaAward className="icon" />{" "}
                    {new Date(workAnniversaries[currentIndex]?.JoinDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short"
                    })}

                  </span>
                </div>
              <button
                    className="send-wish-btn mt-2"
                    onClick={() => {
                      setSelectedEmployee(workAnniversaries[currentIndex]);
                      setShowPopup(true);
                    }}
                  >
                    Make a wish!
                  </button>
              </div>
            </div>
          </div>
        ) : (
          <div>No work anniversaries found.</div>
        )}
      </div>
      {showPopup && (
        <SendEmailPopup
          show={showPopup}
          handleClose={() => setShowPopup(false)}
          recipient={selectedEmployee}
          personalName={`${selectedEmployee?.FirstName || ""} ${selectedEmployee?.MiddleName || ""
            } ${selectedEmployee?.LastName || ""}`.trim()}
          type="WorkAnnComments"
        />
      )}
    </div>
  );
}
