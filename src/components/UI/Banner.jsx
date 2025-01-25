import { useState, useEffect } from "react";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";
import Loader from "../../components/Loader"; // Import the Loader component
import "./Banner.css";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch banners from the API
  const fetchBanners = async () => {
    setLoading(true); // Set loading to true before API call
    try {
      const url = `${ConnectMe.BASE_URL}/banner/getFs?type=Banners&active=true`;
      const token = getTokenFromLocalStorage();

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);
      if (response.success) {
        setBanners(response.data);
      } else {
        setBanners([]);
        showToast("Failed to load banners", "error");
      }
    } catch (error) {
      setBanners([]);
      showToast("Failed to load banners", "error");
    } finally {
      setLoading(false); // Stop loading after API call
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="banner-loader-container">
        <Loader /> {/* Show loader while banners are being fetched */}
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="no-banner-message">
        <p>No banners available.</p>
      </div>
    );
  }

  return (
    <div
      id="bannerCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="3000" // Set the auto-slide interval to 3 seconds
    >
      {/* Carousel Indicators */}
      <div className="carousel-indicators">
        {banners.map((banner, index) => (
          <button
            key={banner._id}
            type="button"
            data-bs-target="#bannerCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Carousel Items */}
      <div className="carousel-inner">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={`${ConnectMe.img_URL}${banner.imagePath}`}
              className="d-block w-100"
              alt={`Banner ${index + 1}`}
            />
            <div className="carousel-caption d-none d-md-block">
              {/* Uncomment these if you have title and description */}
              {/* <h5>{banner.title || `Slide ${index + 1}`}</h5>
              <p>{banner.description || `Description for slide ${index + 1}`}</p> */}
            </div>
          </div>
        ))}
      </div>

      {/* Previous and Next controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#bannerCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#bannerCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
