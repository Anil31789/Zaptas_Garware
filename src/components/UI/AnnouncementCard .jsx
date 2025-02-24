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

export default function AnnouncementCard() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For full-size image preview
  const navigate = useNavigate();

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
            <h5 className="mb-0">Announcements</h5>
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
        <div className="card-body card-scroll">
          {announcements.map((announcement) => (
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
                    <PostCard post={announcement.description} size={73} />
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
      {selectedAnnouncement && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title className="card-text text-danger fw-bold celebrating-text">{selectedAnnouncement.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <div className="d-flex justify-content-between align-items-center mb-4"> */}
            {/* Left Div */}
            {/* <div>
                <h6 className="mb-1">{selectedAnnouncement.fullName}</h6>
                <p className="mb-0 text-muted">
                  {selectedAnnouncement.Designation}
                </p>
              </div> */}
            {/* Right Div */}
            {/* <div>
                <img
                  src={"./user.png"}
                  alt="User"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            </div> */}

            {/* Description */}
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <div className="card-text fs-6">
                <PostCard post={selectedAnnouncement.description} size={180} />
              </div>
            </div>

            {selectedAnnouncement.links.map((link) => (
              <div
                key={link._id}
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#6d6f72" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <strong style={{ fontSize: "16px", marginRight: "8px" }}>
                      {link.linkTitle}
                    </strong>
                    <span style={{ fontStyle: "italic", color: "#555" }}>
                      {link.link}
                    </span>
                  </div>
                </a>
              </div>
            ))}

            {/* <p className="mt-3">
              Location: <strong>{selectedAnnouncement.location} </strong>
            </p> */}

            <p className="mt-3">
              Date:{" "}
              <strong>
                {new Date(
                  selectedAnnouncement.AnnouncementDate
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </strong>
            </p>

            <div className="row">
              {selectedAnnouncement?.imagePath?.length > 0 &&
                selectedAnnouncement.imagePath?.map((image, index) => (
                  <div key={index} className="col-sm-4 mb-4 position-relative">
                    <div className="model-card">
                      <img
                        src={`${ConnectMe.img_URL}${image}`} // Display the existing image
                        alt={`Selected Banner ${index + 1}`}
                        className="modelcard-image"
                        onClick={() => {
                          handleClose(); // Close the modal or menu
                          setSelectedImage(`${ConnectMe.img_URL}${image}`); // Set the selected image for preview
                        }}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          position: "relative",
                        }}
                        onMouseEnter={(e) => {
                          // Check if hover text already exists
                          if (e.target.parentElement.querySelector(".hover-text")) return;

                          const hoverText = document.createElement("div");
                          hoverText.innerText = "Click here to view";
                          hoverText.style.position = "absolute";
                          hoverText.style.top = "50%";
                          hoverText.style.left = "50%";
                          hoverText.style.transform = "translate(-50%, -50%)";
                          hoverText.style.color = "white";
                          hoverText.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
                          hoverText.style.padding = "10px 20px";
                          hoverText.style.borderRadius = "8px";
                          hoverText.style.fontFamily = "Arial, sans-serif";
                          hoverText.style.fontSize = "16px";
                          hoverText.style.fontWeight = "bold";
                          hoverText.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
                          hoverText.style.transition = "opacity 0.3s ease, transform 0.3s ease";
                          hoverText.style.opacity = "0";
                          hoverText.style.pointerEvents = "none";
                          hoverText.style.zIndex = "10";
                          hoverText.classList.add("hover-text");

                          // Ensure container has relative positioning
                          e.target.parentElement.style.position = "relative";
                          e.target.parentElement.appendChild(hoverText);

                          // Add transition effect
                          setTimeout(() => {
                            hoverText.style.opacity = "1";
                            hoverText.style.transform = "translate(-50%, -50%) scale(1.1)";
                          }, 10);
                        }}
                        onMouseLeave={(e) => {
                          const hoverText = e.target.parentElement.querySelector(".hover-text");

                          if (hoverText) {
                            // Smooth fade-out effect
                            hoverText.style.opacity = "0";
                            hoverText.style.transform = "translate(-50%, -50%) scale(0.9)";

                            // Ensure cleanup after transition ends
                            setTimeout(() => {
                              if (hoverText.parentElement) hoverText.remove();
                            }, 300); // Matches the transition duration
                          }
                        }}
                      />
                      {/* Cross icon in the top-right corner */}
                    </div>
                  </div>
                ))}
            </div>

            {/* Like Button */}
            {/* <div className="d-flex align-items-center">
              <FaThumbsUp
                onClick={() =>
                  handleLikedisslike(
                    selectedAnnouncement._id,
                    selectedAnnouncement.likedByUser
                  )
                }
                style={{
                  color: selectedAnnouncement.likedByUser ? "blue" : "gray",
                  cursor: "pointer",
                  marginRight: "8px",
                }}
              /> */}
            {/* <span> {selectedAnnouncement?.likes?.length} Likes</span>{" "} */}
            {/* Display likes count */}
            {/* </div> */}
          </Modal.Body>
        </Modal>
      )}

      {/* view all popup code  */}

      {selectedImage && (
        <div className="image-preview-overlay" onClick={handleClosePreview}>
          <img
            src={selectedImage}
            alt="Full View"
            className="full-size-image"
          />
        </div>
      )}
    </div>
  );
}
