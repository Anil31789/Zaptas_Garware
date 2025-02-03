import React, { useCallback, useEffect, useState } from "react";
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

  console.log(data,'ol')

  useEffect(() => {
    fetchData("Announcements");
    fetchData("CSR");
    fetchData("Awards");
  }, []);

  const fetchData = async (type) => {
    try {
      const url = `${ConnectMe.BASE_URL}/photosVideos/${type}?limit=3&page=1`;
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
  const renderCarousel = (items, section) => {
    if (!items || items.length === 0) return <p>No {section} available</p>;
  
    return (
      <div id={`${section}-carousel`} className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {items.map((item, index) => {
            // Check if there are images
            if (!item.images || item.images.length === 0) {
              return (
                <div key={item._id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <div className="card border-0 shadow-lg overflow-hidden h-100">
                    <div className="card-body">
                      <h5
                        className="card-title text-center mb-3 text-primary"
                        onClick={() => handleTitleClick(item?.title)}
                        style={{ cursor: "pointer" }} // Ensure pointer cursor
                      >
                        {item.title}
                      </h5>
                      <p className="card-text text-center text-muted">
                        {item.AnnouncementDate ? (
                          <span className="d-block">
                            <strong></strong> {new Date(item.AnnouncementDate).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}
                          </span>
                        ) : item.updatedAt ? (
                          <span className="d-block">
                            <strong>Updated On:</strong> {new Date(item.updatedAt).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}
                          </span>
                        ) : item.createdAt ? (
                          <span className="d-block">
                            <strong>Created On:</strong> {new Date(item.createdAt).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
  
            // Loop through images and create carousel items for each
            return item?.images?.map((image, imgIndex) => {
              const isActive = index === 0 && imgIndex === 0 ? "active" : "";
              const imageUrl = `${ConnectMe.img_URL}${image.imagePath}`; // Use imagePath from the image object
  
              return (
                <div key={`${item._id}-${imgIndex}`} className={`carousel-item ${isActive}`}>
                  <div className="card border-0  overflow-hidden h-100">
                    <img
                      src={imageUrl}
                      className="d-block w-100 rounded-3"
                      alt={item.title}
                      style={{ height: "160px",objectFit:"contain", cursor: "pointer"}} // Ensure pointer cursor
                      onClick={() => handleTitleClick(item)} // Ensure onClick works for images as well
                    />
                    <div className="card-body">
                      <h5
                        className="card-title text-center mb-3 text-primary"
                        onClick={() => handleTitleClick(item?.title)}
                        style={{ cursor: "pointer" }} // Ensure pointer cursor
                      >
                        {item.title}
                      </h5>
                      <p className="card-text text-center text-muted">
                        {item.AnnouncementDate ? (
                          <span className="d-block">
                            <strong></strong> {new Date(item.AnnouncementDate).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}
                          </span>
                        ) : item.updatedAt ? (
                          <span className="d-block">
                            <strong>Updated On:</strong> {new Date(item.updatedAt).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}
                          </span>
                        ) : item.createdAt ? (
                          <span className="d-block">
                            <strong>Created On:</strong> {new Date(item.createdAt).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </div>
              );
            });
          })}
        </div>
  
        {/* Carousel Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target={`#${section}-carousel`}
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target={`#${section}-carousel`}
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
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
        <a className="text-decoration-none" onClick={(()=>{
          navigate("/photos");
        })}>
          View All <HiArrowCircleRight />
        </a>
      </div>
      <div className="card-body card-scroll">
  <div className="row d-flex flex-column justify-content-center align-content-center">
    {/* Announcements Section */}
    {data.Announcements && data.Announcements.length > 0 && (
      <div className="col text-center mb-2  " style={{ height: '400px'}}>
        {renderCarousel(data.Announcements, "Announcements")}
      </div>
    )}

    {/* CSR Section */}
    {data.CSR && data.CSR.length > 0 && (
      <div className="col text-center mb-3 border-bottom" >
        {renderCarousel(data.CSR, "CSR")}
      </div>
    )}

    {/* Awards Section */}
    {data.Awards && data.Awards.length > 0 && (
      <div className="col text-center " style={{ height: '40px'}}>
        {renderCarousel(data.Awards, "Awards")}
      </div>
    )}
  </div>
</div>

    </div>
  );
  
  
}
