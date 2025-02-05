import { Carousel } from "react-bootstrap";
import ConnectMe from "../../config/connect";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import showToast from "../../utils/toastHelper";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch banners from the API
  const fetchBanners = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Loader />
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>No banners available.</p>
      </div>
    );
  }

  return (
    <Carousel controls interval={3000} style={{ margin: "auto" }}>
      {banners.map((banner, index) => (
        <Carousel.Item key={banner._id}>
          <div style={{ textAlign: "center" }}>
            <img
              src={`${ConnectMe.img_URL}${banner.imagePath}`}
              alt={`Banner ${index + 1}`}
              style={{
                width: "100%", // Set width to 100% of the container
                height: "500px", // Fixed height of 500px
                objectFit: "fill", // Ensures the image fills the space properly
                borderRadius: "10px", // Optional: Adds a smooth rounded look
              }}
            />
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
