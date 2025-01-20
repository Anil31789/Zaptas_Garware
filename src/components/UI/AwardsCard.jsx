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

  const handleCelebration = (e) => {
    e.stopPropagation();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const fetchAnnouncements = async (page = 1, limit = 3) => {
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

  return (
    <div>
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaAward className="me-2" />
            <h5 className="mb-0">Awards</h5>
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
        <div className="card-body card-scroll">
          {announcements.map((announcement) => (
            <div
              className="mb-3 announcement-card"
              key={announcement._id}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering `handleShow`
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
                  <p className="card-text"   >
                    {announcement.AwardierName} (
                    {announcement.PersonDesignation})
                  </p>
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
                    <div className="d-flex align-items-center">
                      <p
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
                      </p>
                      {/* Add the mail icon */}
                      <p
                        className="mail-section"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering `handleShow`
                          // Handle mail click logic here
                        }}
                        style={{ cursor: "pointer", margin: 0 }}
                      >
                        <FaPaperPlane style={{ color: "gray" }} />
                      </p>
                    </div>
                    <div className="date-badge-container">
                      <span className="date">
                        {new Date(announcement?.AnnouncementDate)?.getDate() || ""}
                        {" "}
                        {new Date(announcement?.AnnouncementDate)?.toLocaleString("default", { month: "short" }) || ""}'
                        {new Date(announcement?.AnnouncementDate)?.getFullYear().toString().slice(2) || ""}
                      </span>
                      <span className="location">
                        <FaMapMarkerAlt className="location-icon" />
                        {announcement?.location}
                      </span>
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
            <Modal.Title>{selectedAnnouncement.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              {/* Left Div */}
              <div>
                <h6 className="mb-1">{selectedAnnouncement.AwardierName}</h6>
                <p className="mb-0 text-muted">
                  {selectedAnnouncement.PersonDesignation}
                </p>
              </div>
              {/* Right Div */}
              <div>
                <img
                  src={"./user.png"}
                  alt="User"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            </div>

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

            <p className="mt-3">
              Location: <strong>{selectedAnnouncement.location} </strong>
            </p>

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
  onMouseEnter={(e) => {
    const hoverText = document.createElement("div");
    hoverText.innerText = "Click here to view";
    hoverText.style.position = "absolute";
    hoverText.style.top = "50%";
    hoverText.style.left = "50%";
    hoverText.style.transform = "translate(-50%, -50%)";
    hoverText.style.color = "white";
    hoverText.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
    hoverText.style.padding = "5px 10px";
    hoverText.style.borderRadius = "5px";
    hoverText.style.zIndex = "1";
    hoverText.style.pointerEvents = "none";
    hoverText.classList.add("hover-text"); // Add a class for easy cleanup
    e.target.parentElement.style.position = "relative"; // Ensure the container is relatively positioned
    e.target.parentElement.appendChild(hoverText); // Append hover text
  }}
  onMouseLeave={(e) => {
    const hoverText = e.target.parentElement.querySelector(".hover-text");
    if (hoverText) hoverText.remove(); // Remove the hover text
  }}
/>
                      {/* Cross icon in the top-right corner */}
                    </div>
                  </div>
                ))}
            </div>

            {/* Like Button */}
            <div className="d-flex align-items-center">
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
              />
              <span> {selectedAnnouncement?.likes?.length} Likes</span>{" "}
              {/* Display likes count */}
            </div>
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
