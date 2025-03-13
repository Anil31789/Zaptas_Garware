import { useState, useEffect } from "react";

import { HiArrowCircleRight } from "react-icons/hi";

import { Modal, Spinner } from "react-bootstrap";

import "./AnnouncementCard.css";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";
import PostCard from "./postDisplay";
// import ViewAllPopup from "./ViewAllPopup";
import { useNavigate } from "react-router-dom";

import { IoIosMegaphone } from "react-icons/io";
import AnnouncementModal from "./UniversalModal";
import useAutoScroll from "../../utils/useAutoScroll";

export default function AnnouncementCard() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For full-size image preview
  const navigate = useNavigate();
  const { scrollRef, pauseScroll, resumeScroll } = useAutoScroll(1, 30, 2000);


  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);



  //  End view all popup elements


  const fetchAnnouncements = async (page = 1, limit = 5) => {
    try {
      setLoading(true); // Show loader while fetching
      const url = `${ConnectMe.BASE_URL}/announcements/latest?page=${page}&limit=${limit}`;
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
    const url = `${ConnectMe.BASE_URL}/announcements/${announcementId}/${isLiked ? "unlike" : "like"
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

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  const handleClose = () => setShow(false);
  const handleShow = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShow(true);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <IoIosMegaphone className="me-2" />
            <p className="mb-0">Announcements</p>
          </div>
          <a
            className="text-decoration-none"
            onClick={() => {
              navigate("/view-detail", {
                state: {
                  title: "View All Announcements",
                  type: "announcements",
                  bannerImg: "./bannerforusercsr.jpg",
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
          {announcements?.map((announcement) => (
            <div
              className="mb-3 announcement-card"
              key={announcement._id}
              onClick={() => handleShow(announcement)} // Open modal when clicking the card
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-start mb-4 flex-column">
                {/* Announcement Content */}
                <div className="announcement-disc pb-2">
                  <p className="card-text celebrating-text annouuncTitle">
                    {announcement.title}
                  </p>


                  <div className="card-text fs-6">
                    <PostCard post={announcement.description} size={75} />
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    {/* <p
                      className="like-section"
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
                    {/* Date Badge */}
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
