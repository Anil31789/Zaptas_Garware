import React, { useState, useCallback, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import PostCard from "./postDisplay";
import ConnectMe from "../../config/connect";










const MediaPreview = React.memo(({ selectedImage, handleClosePreview }) => {
  const videoRef = useRef(null);

  // Stop video playback when closing the preview
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [selectedImage]);

  if (!selectedImage) return null;

  return (
    <div
      className="image-preview-overlay"
      onClick={handleClosePreview} // Only close media preview, not modal
    >
      {selectedImage.toLowerCase().endsWith(".mp4") ? (
        <video
          ref={videoRef}
          src={selectedImage}
          className="full-size-image"
          controls
          autoPlay
        />
      ) : (
        <img src={selectedImage} alt="Full View" className="full-size-image" />
      )}
    </div>
  );
});








const AnnouncementModal = ({ show, handleClose, selectedAnnouncement }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Use useCallback to prevent unnecessary re-renders
  const handleClosePreview = useCallback(() => {
    setSelectedImage(null);
  }, []);

  if (!selectedAnnouncement) return null;

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="card-text text-danger fw-bold celebrating-text">
            {selectedAnnouncement.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Announcement Description */}
          <div
            style={{
              maxHeight: "500px",
              overflowY: "auto",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <div className="card-text fs-6">
              <PostCard post={selectedAnnouncement.description} size={230} />
            </div>
          </div>

          {/* Announcement Links */}
          {selectedAnnouncement.links?.map((link) => (
            <div key={link._id} style={{ marginBottom: "16px" }}>
              <a
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#6d6f72" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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

          {/* Announcement Date */}
          <p className="mt-3">
            Date:{" "}
            <strong>
              {new Date(selectedAnnouncement.AnnouncementDate).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </strong>
          </p>

          {/* Announcement Media (Images & Videos) */}
          <div className="row">
            {selectedAnnouncement?.imagePath?.map((media, index) => {
              const mediaUrl = `${ConnectMe.img_URL}${media}`;
              const isVideo = media.toLowerCase().endsWith(".mp4");

              return (
                <div key={index} className="col-sm-4 mb-4 position-relative">
                  <div className="model-card">
                    {isVideo ? (
                      <video
                        src={mediaUrl}
                        className="modelcard-image"
                        controls
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(mediaUrl);
                          handleClose()
                        }}
                      />
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={`Selected Media ${index + 1}`}
                        className="modelcard-image"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(mediaUrl);
                          handleClose()
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>

      {/* Media Preview Component */}
      {selectedImage && (
        <MediaPreview
          selectedImage={selectedImage}
          handleClosePreview={handleClosePreview}
        />
      )}
    </>
  );
};

export default AnnouncementModal;
