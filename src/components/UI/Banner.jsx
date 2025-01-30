import { useState, useEffect } from "react";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";
import Loader from "../../components/Loader"; // Import the Loader component
import { Carousel } from "react-bootstrap"; // Importing Carousel component
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
    <Carousel controls interval={3000} className="banner-carousel">
      {banners.map((banner, index) => (
        <Carousel.Item key={banner._id}>
          <div className="carousel-item-content">
            <img
              src={`${ConnectMe.img_URL}${banner.imagePath}`}
              className="d-block w-100"
              alt={`Banner ${index + 1}`}
            />
            <div className="carousel-caption d-none d-md-block">
              {/* You can uncomment these if you want to show titles and descriptions */}
              {/* <h5>{banner.title || `Slide ${index + 1}`}</h5>
              <p>{banner.description || `Description for slide ${index + 1}`}</p> */}
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
