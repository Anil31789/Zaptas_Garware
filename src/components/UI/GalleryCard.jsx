import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCameraRetro } from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";
import { Modal } from "react-bootstrap"; // Import Modal from react-bootstrap

export default function GalleryCard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    Announcements: [],
    CsrType: [],
    Awards: [],
  });
  const [selectedImage, setSelectedImage] = useState(null);
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

  const handleTitleClick = (item) => {
    setSelectedImage(item);
    setShowModal(true);
  };

  const renderCarousel = (items, section, rowLimit) => {
    if (!items || items.length === 0) return <p className="text-center">No {section} available</p>;

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
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        className="d-block w-100"
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "125px",
                          objectFit: "cover",
                          cursor: "pointer",
                          borderRadius: "10px",
                        }}
                        onClick={() => handleTitleClick(item)}
                      />
                    )}
                    <div
                      className="card-footer p-2 text-center"
                      style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
                    >
                      <h6 className="card-title text-truncate" style={{ fontSize: "12px", fontWeight: "bold" }}>
                        {item.title}
                      </h6>
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
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaCameraRetro className="me-2" />
          <p className="mb-0">Gallery</p>
        </div>
        <a
          className="text-decoration-none"
          onClick={() => {
            navigate("/photos");
          }}
          style={{ cursor: "pointer" }}
        >
          View All <HiArrowCircleRight />
        </a>
      </div>
      <div className="card-body card-scroll p-0" style={{ overflowX: "hidden" }}>
        <div className="container-fluid">
          <div className="row d-flex flex-column justify-content-center align-content-center">
            {/* CSR Section */}
            {data.CsrType && data.CsrType.length > 0 && (
              <div className="col text-center mb-2">
                {renderCarousel(data.CsrType, "CSR", 6)}
              </div>
            )}

            {/* Announcements Section */}
            {data.Announcements && data.Announcements.length > 0 && (
              <div className="col text-center mb-2">
                {renderCarousel(data.Announcements, "Announcements", 4)}
              </div>
            )}

            {/* Awards Section */}
            {data.Awards && data.Awards.length > 0 && (
              <div className="col text-center mb-2">
                {renderCarousel(data.Awards, "Awards", 2)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for larger image */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedImage?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage?.images?.[0]?.imagePath && (
            <img
              src={`${ConnectMe.img_URL}${selectedImage.images[0].imagePath}`}
              className="img-fluid"
              alt={selectedImage?.title}
              style={{ maxWidth: "100%", borderRadius: "10px" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
