import { useState, useEffect } from "react";

import { HiArrowCircleRight } from "react-icons/hi";
import { AiOutlineSound } from "react-icons/ai";
import { Modal, Spinner } from "react-bootstrap";
import { FaThumbsUp } from "react-icons/fa";
import "./AnnouncementCard.css";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";

export default function AnnouncementCard() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);


  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);




  const fetchAnnouncements = async (page = 1, limit = 3) => {
    try {
      setLoading(true); // Show loader while fetching
      const url = `${ConnectMe.BASE_URL}/csr/latest?page=${page}&limit=${limit}`;
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
  const handleLikeDislike = async (announcementId, isLiked) => {
    showToast(isLiked ? "Unlike success" : "Like success", "success");
    const token = getTokenFromLocalStorage();
    const url = `${ConnectMe.BASE_URL}/csr/${announcementId}/${isLiked ? "unlike" : "like"}`;
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
                ? announcement.likes.filter((userId) => userId !== response.userId)
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
        if (selectedAnnouncement && selectedAnnouncement._id === announcementId) {
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
        fetchAnnouncements()
      }
    } catch (err) {
      setError("Error updating like.");
      fetchAnnouncements()
    }
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

  const formatText = (text) => {
    if (!text) return null;

    // Replace `{hashtag|#|tag}` with `#tag` and style it in blue
    return text
      .replace(/{hashtag\|\\#\|/g, '#') // Replace starting hashtag syntax
      .replace(/}/g, '') // Remove closing syntax
      .replace(/#(\w+)/g, '<span style="color:blue;">#$1</span>') // Make hashtags blue
      .replace(/(\r\n|\n|\r)/gm, '<br>'); // Replace line breaks with HTML <br> tags for proper rendering
  };




  return (
    <div>
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <AiOutlineSound className="me-2" />
            <h5 className="mb-0">CSR</h5>
          </div>
          <a href="#" className="text-decoration-none">
            View All <HiArrowCircleRight />
          </a>
        </div>
        <div className="card-body">
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
                        : "./csrimg.png"
                    }
                    alt="CSR"
                    className="banner-image"
                  />
                </div>


                {/* Announcement Content */}
                <div className="announcement-disc">
                  <p className="card-text">{announcement.title}</p>
                  <p
                  className="card-text fs-6"
                  dangerouslySetInnerHTML={{
                    __html: `${formatText(announcement.description.slice(0, 100))}...`,
                  }}
                ></p>
                  <a
                    href="#"
                    className="text-decoration-none"

                  >
                    Read More +
                  </a>
                  <p
                    className="like-section"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering `handleShow`
                      handleLikeDislike(announcement._id, announcement.likedByUser);
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
                <h6 className="mb-1">{selectedAnnouncement.fullName}</h6>
                <p className="mb-0 text-muted">
                  {selectedAnnouncement.Designation}
                </p>
              </div>
              {/* Right Div */}
              <div>
                <img
                  src={
                    "./user.png"
                  }
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
              <p
                dangerouslySetInnerHTML={{
                  __html: selectedAnnouncement.description.replace(/\n/g, "<br />"),
                }}
              />
            </div>

            {selectedAnnouncement.links.map((link) => (
              <div key={link._id} style={{ marginBottom: "16px", display: "flex", flexDirection: "column" }}>
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#007bff" }}
                >
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <strong style={{ fontSize: "16px", marginRight: "8px" }}>{link.linkTitle}</strong>
                    <span style={{ fontStyle: "italic", color: "#555" }}>{link.link}</span>
                  </div>
                </a>
              </div>
            ))}
            {selectedAnnouncement.location && <p className="mt-3">
              Location:  <strong>{selectedAnnouncement.location}  </strong>
            </p>}



            <p className="mt-3">
              Date: <strong>
                {new Date(selectedAnnouncement.AnnouncementDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </strong>
            </p>




            <div className="row">
              {selectedAnnouncement?.imagePath?.length > 0 &&
                selectedAnnouncement.imagePath?.map((image, index) => (
                  <div key={index} className="col-6 col-sm-3 mb-4 position-relative">
                    <div className="banner-card">
                      <img
                        src={`${ConnectMe.img_URL}${image}`} // Display the existing image
                        alt={`Selected Banner ${index + 1}`}
                        className="banner-image"
                      />
                      {/* Cross icon in the top-right corner */}

                    </div>
                  </div>
                ))}
            </div>

            {/* Like Button */}
            <div className="d-flex align-items-center">
              <FaThumbsUp
                onClick={() => handleLikeDislike(selectedAnnouncement._id, selectedAnnouncement.likedByUser)}
                style={{
                  color: selectedAnnouncement.likedByUser ? "blue" : "gray",
                  cursor: "pointer",
                  marginRight: "8px",
                }}
              />
              <span>  {selectedAnnouncement?.likes?.length} Likes</span> {/* Display likes count */}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
