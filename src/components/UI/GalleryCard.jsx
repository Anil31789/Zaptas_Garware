import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCameraRetro } from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";
import { Modal } from "react-bootstrap";

export default function GalleryCard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    Announcements: [],
    CsrType: [],
    Awards: [],
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData("Announcements");
    fetchData("CSR");
    fetchData("Awards");
  }, []);

  const fetchData = async (type) => {
    try {
      const url = `${ConnectMe.BASE_URL}/photosVideos/${type}?limit=6&page=1`;
      const token = getTokenFromLocalStorage();
      const headers = { Authorization: `Bearer ${token}` };

      const response = await apiCall("GET", url, headers);
      if (response.success) {
        setData((prevData) => ({
          ...prevData,
          [type]: response.data?.data || [],
        }));
      } else {
        showToast(`Failed to load ${type}`, "error");
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error.message);
      showToast(`Error fetching ${type}`, "error");
    }
  };

  const handleImageClick = (item) => {
    setSelectedImages(item?.images || []);
    setSelectedTitle(item?.title || "");
    setShowModal(true);
  };

  const renderCarousel = (items, section, rowLimit) => {
    if (!items || items.length === 0) {
      return <p className="text-center">No {section} available</p>;
    }

    const limitedItems = items.slice(0, rowLimit);
    const groupedItems = [];

    for (let i = 0; i < limitedItems.length; i += 2) {
      groupedItems.push(limitedItems.slice(i, i + 2));
    }

    return (
      <div className="carousel-inner">
        {groupedItems.map((row, rowIndex) => (
          <div key={rowIndex} className="row gx-0">
            {row.map((item) => {
              const imageUrl = item?.images?.[0]?.imagePath
                ? `${ConnectMe.img_URL}${item.images[0].imagePath}`
                : "";

              return (
                <div key={item._id} className="col-6 p-1">
                  <div className="card border-0 shadow-sm overflow-hidden h-100">
                    <div style={{ position: "relative" }}>
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          className="d-block w-100"
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover",
                            cursor: "pointer",
                            borderRadius: "10px",
                          }}
                          onClick={() => handleImageClick(item)}
                        />
                      )}

                      {/* Title Overlay (Single Line) */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          color: "#ffffff",
                          padding: "6px",
                          fontSize: "14px",
                          fontWeight: "500",
                          textAlign: "center",
                          borderBottomLeftRadius: "10px",
                          borderBottomRightRadius: "10px",
                          whiteSpace: "nowrap", // Single line
                          overflow: "hidden", // Hide overflow
                          textOverflow: "ellipsis", // Add "..."
                        }}
                        title={item.title} // Show full title on hover
                      >
                        {item.title}
                      </div>

                      {/* Image Count Badge */}
                      {item?.images?.length > 1 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            zIndex: 10,
                          }}
                        >
                          {item?.images?.length} Images
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="card mb-3">
      {/* Card Header */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaCameraRetro className="me-2" />
          <p className="mb-0">Gallery</p>
        </div>
        <a
          className="text-decoration-none"
          onClick={() => navigate("/photos")}
          style={{ cursor: "pointer" }}
        >
          View All <HiArrowCircleRight />
        </a>
      </div>
      

      {/* Card Body */}
      <div className="card-body card-scroll p-0" style={{ overflowX: "hidden" }}>
        <div className="container-fluid">
          <div className="row d-flex flex-column justify-content-center align-content-center">
            {/* CSR Section */}
            {data.CsrType?.length > 0 && (
              <div className="col text-center mb-2">
                {renderCarousel(data.CsrType, "CSR", 6)}
              </div>
            )}

            {/* Announcements Section */}
            {data.Announcements?.length > 0 && (
              <div className="col text-center mb-2">
                {renderCarousel(data.Announcements, "Announcements", 4)}
              </div>
            )}

            {/* Awards Section */}
            {data.Awards?.length > 0 && (
              <div className="col text-center mb-2">
                {renderCarousel(data.Awards, "Awards", 2)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Larger Image and Related Images */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap justify-content-center">
            {selectedImages.map((img, index) => (
              <img
                key={index}
                src={`${ConnectMe.img_URL}${img.imagePath}`}
                className="m-2"
                alt={selectedTitle}
                style={{
                  maxWidth: "80%",
                  height: "auto",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
