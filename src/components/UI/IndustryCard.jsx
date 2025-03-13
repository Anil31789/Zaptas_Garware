import { useState, useEffect } from "react";

import { HiArrowCircleRight } from "react-icons/hi";
import { AiOutlineSound } from "react-icons/ai";
import { Modal, Spinner } from "react-bootstrap";
import { FaNewspaper, FaThumbsUp } from "react-icons/fa";
import "./AnnouncementCard.css";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";
import PostCard from "./postDisplay";
import { useNavigate } from "react-router-dom";
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
  // const scrollRef = useAutoScroll(1,1); // Smooth scrolling
    const { scrollRef, pauseScroll, resumeScroll } = useAutoScroll(1, 30, 2000); 
  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async (page = 1, limit = 5) => {
    try {
      setLoading(true); // Show loader while fetching
      const url = `${ConnectMe.BASE_URL}/industry/latest?page=${page}&limit=${limit}`;
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
    const url = `${ConnectMe.BASE_URL}/industry/${announcementId}/${isLiked ? "unlike" : "like"
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

  const handleClose = () => setShow(false);
  const handleShow = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShow(true);
  };
  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const formatText = (text) => {
    if (!text) return null;

    // Replace `{hashtag|#|tag}` with `#tag` and style it in #6d6f72
    return text
      .replace(/{hashtag\|\\#\|/g, "#") // Replace starting hashtag syntax
      .replace(/}/g, "") // Remove closing syntax
      .replace(/#(\w+)/g, '<span style="color:#6d6f72;">#$1</span>') // Make hashtags #6d6f72
      .replace(/(\r\n|\n|\r)/gm, "<br>"); // Replace line breaks with HTML <br> tags for proper rendering
  };

  return (
    <div>
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaNewspaper className="me-2" />
            <p className="mb-0">Industry News</p>
          </div>
          <a
            className="text-decoration-none"
            onClick={() => {
              navigate("/view-detail", {
                state: {
                  title: "View All Announcements",
                  type: "industry",
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
              onClick={() => handleShow(announcement)} // Open modal when clicking the card
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-start">
                {/* Date Badge */}

                <div className="csrimg">
                  <img
                    src={
                      announcement?.imagePath[0]
                        ? `${ConnectMe.img_URL}${announcement.imagePath[0]}`
                        : "./logo.png"
                    }
                    alt="CSR"
                    className="banner-image"
                  />
                </div>

                {/* Announcement Content */}
                <div className="announcement-disc">
                  <p className="card-text">{announcement.title}</p>

                  <div className="card-text fs-6">
                    <PostCard post={announcement.description} size={70} />
                  </div>
                  {/* <div className="d-flex justify-content-between mt-2">
                    <p
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
                    </p>
            
                  </div> */}
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
