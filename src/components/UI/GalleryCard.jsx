import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { FaCameraRetro } from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";

export default function GalleryCard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    Announcements: [],
    CsrType: [],
    Awards: [],
  });

  useEffect(() => {
    fetchData("Announcements");
    fetchData("CSR");
    fetchData("Awards");
  }, []);

  const fetchData = async (type) => {
    try {
      const url = `${ConnectMe.BASE_URL}/photosVideos/${type}?limit=6&page=1`; // Fetching up to 6 items for CSR, Announcements, and Awards
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
    navigate(`/photos`, { state: item });
  };

  const renderCarousel = (items, section, rowLimit) => {
    if (!items || items.length === 0) return <p>No {section} available</p>;

    // Limit the number of items to display based on rowLimit
    const limitedItems = items.slice(0, rowLimit); 
    const groupedItems = [];
    
    // Group the items in pairs for 2 items per row
    for (let i = 0; i < limitedItems.length; i += 2) {
      groupedItems.push(limitedItems.slice(i, i + 2)); // Group 2 images per row
    }

    return (
      <div className="carousel-inner">
        {groupedItems.map((row, rowIndex) => (
          <div key={rowIndex} className="row no-gutters">
            {row.map((item) => {
              const imageUrl = item?.images?.[0]?.imagePath
                ? `${ConnectMe.img_URL}${item.images[0].imagePath}`
                : "";

                return (
                  <div key={item._id} className="col-6 mb-0 p-0">
                    <div className="card border-0 shadow-none overflow-hidden h-100 p-0">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          className="d-block w-100"
                          alt={item.title}
                          style={{
                            width: "100%", // Ensure the image spans the full width of its container
                            height: "160px", // Allow height to adjust automatically based on the aspect ratio
                            objectFit: "cover", // Make sure the image covers the container without stretching
                            cursor: "pointer",
                            paddingTop:"10px",
                            padding: "0", // No padding around the image
                            margin: "0", // No margin around the image
                            // paddingLeft:"10px",
                            borderRadius: "10px", // Apply border-radius for rounded corners
                          }}
                          onClick={() => handleTitleClick(item)}
                        />
                      )}
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
          <h5 className="mb-0">Photo/Video Gallery</h5>
        </div>
        <a
          className="text-decoration-none"
          onClick={() => {
            navigate("/photos");
          }}
        >
          View All <HiArrowCircleRight />
        </a>
      </div>
      <div className="card-body p-0">
        <div className="row d-flex flex-column justify-content-center align-content-center">
          {/* CSR Section - Display in a single row */}
          {data.CsrType && data.CsrType.length > 0 && (
            <div className="col text-center mb-2">
              {renderCarousel(data.CsrType, "CSR", 6)} {/* Fetch and display all 6 CSR images */}
            </div>
          )}

          {/* Announcements Section - 2 rows with 2 images per row */}
          {data.Announcements && data.Announcements.length > 0 && (
            <div className="col text-center mb-2">
              {renderCarousel(data.Announcements, "Announcements", 4)} {/* Fetch and display 4 announcement images */}
            </div>
          )}

          {/* Awards Section - 1 row with 2 images */}
          {data.Awards && data.Awards.length > 0 && (
            <div className="col text-center mb-2">
              {renderCarousel(data.Awards, "Awards", 2)} {/* Fetch and display 2 award images */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
