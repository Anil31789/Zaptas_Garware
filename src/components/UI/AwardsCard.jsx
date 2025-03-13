import { useState, useEffect } from "react";
import { FaThumbsUp, FaPaperPlane, FaMapMarkerAlt, FaAward } from "react-icons/fa"; // Import the mail icon
import { HiArrowCircleRight } from "react-icons/hi";
import { AiOutlineSound } from "react-icons/ai";
import { Modal, Spinner } from "react-bootstrap";
import "./AnnouncementCard.css";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";
import PostCard from "./postDisplay";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";
import AnnouncementModal from "./UniversalModal";
import useAutoScroll from "../../utils/useAutoScroll";
export default function AnnouncementCard() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
    const { scrollRef, pauseScroll, resumeScroll } = useAutoScroll(1, 30, 2000); 
  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCelebration = (e) => {
    e.stopPropagation();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const fetchAnnouncements = async (page = 1, limit = 6) => {
    try {
      setLoading(true); // Show loader while fetching
      const url = `${ConnectMe.BASE_URL}/awards/latest?page=${page}&limit=${limit}`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);
      if (response.success) {
        setAnnouncements(response?.data?.announcements);
      } else {
        setError("Failed to fetch announcements.");
      }
    } catch (err) {
      setError("Error fetching announcements.");
    } finally {
      setLoading(false); // Hide loader after fetching
    }
  };

  // Handle like/unlike
  const handleLikedisslike = async (announcementId, isLiked) => {
    showToast(isLiked ? "Unlike success" : "Like success", "success");
    const token = getTokenFromLocalStorage();
    const url = `${ConnectMe.BASE_URL}/awards/${announcementId}/${isLiked ? "unlike" : "like"
      }`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await apiCall("POST", url, headers);
      if (response.success) {
        // Update the local state to reflect the like/unlike action
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((announcement) => {
            if (announcement._id === announcementId) {
              // Update the likes array and the likesCount locally
              const updatedLikes = isLiked
                ? announcement.likes.filter(
                  (userId) => userId !== response.userId
                )
                : [...announcement.likes, response.userId];

              return {
                ...announcement,
                likes: updatedLikes,
                likesCount: updatedLikes.length, // Update the likes count directly
                likedByUser: !isLiked, // Toggle the likedByUser state
              };
            }
            return announcement; // Return the unchanged announcement if not matching
          })
        );

        // Update the modal if the selected announcement matches
        if (
          selectedAnnouncement &&
          selectedAnnouncement._id === announcementId
        ) {
          setSelectedAnnouncement((prev) => {
            const updatedLikes = isLiked
              ? prev.likes.filter((userId) => userId !== response.userId)
              : [...prev.likes, response.userId];

            return {
              ...prev,
              likes: updatedLikes,
              likesCount: updatedLikes.length, // Update the likes count
              likedByUser: !isLiked, // Toggle the likedByUser state
            };
          });
        }
      } else {
        setError("Failed to update like.");
        fetchAnnouncements();
      }
    } catch (err) {
      setError("Error updating like.");
      fetchAnnouncements();
    }
  };



  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }



  const handleClose = () => setShow(false);
  const handleShow = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShow(true);
  };

  return (
    <div>
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaAward className="me-2" />
            <p className="mb-0">Awards</p>
          </div>
          <a
            className="text-decoration-none"
            onClick={() => {
              navigate("/view-detail", {
                state: {
                  title: "View All Announcements",
                  type: "awards",
                  bannerImg: "./bannerforCSR.jpg",
                },
              });
            }}
          >
            View All <HiArrowCircleRight />
          </a>
        </div>
       <div
        className="card-body card-scroll"
        ref={scrollRef}
        onMouseEnter={pauseScroll}  // Pause scroll when hovering
        onMouseLeave={resumeScroll}  // Resume scroll when hover ends
      >
          {announcements.map((announcement) => (
            <div
              className="mb-3 announcement-card"
              key={announcement._id}
              onClick={(e) => {
             
                handleShow(announcement)
              }} // Open modal when clicking the card
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-start mb-4 flex-column">
                {/* Date Badge */}

                {/* Announcement Content */}
                <div
                  className="announcement-disc pb-2"

                >
                  {/* <p className="card-text"   >
                    {announcement.AwardierName} (
                    {announcement.PersonDesignation})
                  </p> */}
                  <p className="card-text text-danger fw-bold celebrating-text" onClick={handleCelebration}>
                    {announcement.title} 🥳
                  </p>
                  <div className="card-text fs-6">
                    {" "}
                    <PostCard post={announcement.description} size={90} />
                  </div>

                  <div className="d-flex mt-2 align-items-center justify-content-between">
                    {" "}
                    {/* Add `align-items-center` for vertical alignment */}
                    {/* <div className="d-flex align-items-center"> */}
                    {/* <p
                        className="like-section me-3" // Add `me-3` for spacing
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering `handleShow`
                          handleLikedisslike(
                            announcement._id,
                            announcement.likedByUser
                          );
                        }}
                      >
                        <FaThumbsUp
                          style={{
                            color: announcement.likedByUser ? "blue" : "gray",
                            cursor: "pointer",
                          }}
                        />{" "}
                        {announcement?.likes?.length}
                      </p> */}
                    {/* Add the mail icon */}
                    {/* <p
                        className="mail-section"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering `handleShow`
                          // Handle mail click logic here
                        }}
                        style={{ cursor: "pointer", margin: 0 }}
                      >
                        <FaPaperPlane style={{ color: "gray" }} />
                        
                      </p> */}
                    {/* </div> */}
                    <div className="date-badge-container">
                      <span className="date">
                        {new Date(announcement?.AnnouncementDate)?.getDate() || ""}
                        {" "}
                        {new Date(announcement?.AnnouncementDate)?.toLocaleString("default", { month: "short" }) || ""}
                        {" "}
                        {new Date(announcement?.AnnouncementDate)?.getFullYear().toString() || ""}
                      </span>
                      {/* <span className="location">
                        <FaMapMarkerAlt className="location-icon" />
                        {announcement?.location}
                      </span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Modal */}
    
        <AnnouncementModal
          show={show}
          handleClose={handleClose}
          selectedAnnouncement={selectedAnnouncement}
        />
   

    </div>
  );
}
