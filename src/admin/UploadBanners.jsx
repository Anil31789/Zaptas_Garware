import React, { useEffect, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./UploadBanners.css";
import { apiCall, getTokenFromLocalStorage } from "../utils/apiCall";
import ConnectMe from "../config/connect";
import showToast from "../utils/toastHelper";

export default function UploadBanners() {
  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isBannerUpdated, setIsBannerUpdated] = useState(''); // Track banner update
  const [cropper, setCropper] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Store the currently selected file for cropping
  const fileInputRef = React.createRef();

  useEffect(() => {
    fetchBanners();
  }, [isBannerUpdated]); // Only re-fetch when isBannerUpdated changes

  const fetchBanners = async () => {
    try {
      const url = `${ConnectMe.BASE_URL}/banner/getFs?type=Banners`;
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
      console.error("Error fetching banners:", error.message);
    }
  };

  const deleteBanner = async (bannerId) => {
    try {
      const url = `${ConnectMe.BASE_URL}/banner/deletebanners/${bannerId}`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("DELETE", url, headers);

      if (response.success) {
        showToast("Deleted", "success");
        fetchBanners();
      } else {
        showToast("Failed to delete banner", "error");
      }
    } catch (error) {
      console.error("Error deleting banner:", error.message);
    }
  };

  const uploadBanner = async () => {
    if (!cropper) {
      showToast("Please crop the image before uploading", "error");
      return;
    }

    try {
      const croppedImageBlob = await cropper.getCroppedCanvas().toBlob();
      const formData = new FormData();
      formData.append("files", croppedImageBlob, "banner.png");
      formData.append("name", "Banners");

      const url = `${ConnectMe.BASE_URL}/file/upload`;
      const token = getTokenFromLocalStorage();
      const headers = { Authorization: `Bearer ${token}` };

      const response = await apiCall("POST", url, headers, formData);

      if (response.success) {
        showToast("Banner uploaded successfully!", "success");
        setSelectedFile(null); // Clear the selected file
        setIsBannerUpdated(!isBannerUpdated); // Trigger re-fetch
        fileInputRef.current.value = null;
      } else {
        showToast("Failed to upload banner", "error");
      }
    } catch (error) {
      console.error("Error uploading banner:", error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setSelectedFile(fileURL); // Pass the file to the cropper
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    fileInputRef.current.value = null;
  };

  return (
    <div className="upload-banners container">
      <div className="banners-section mb-4">
        <h4>Current Banners</h4>
        <div className="row">
          {banners.length > 0 ? (
            banners.map((banner, index) => (
              <div key={banner._id} className="col-6 col-sm-3 mb-4">
                <div className="banner-card">
                  <img
                    src={`${ConnectMe.img_URL}${banner.imagePath}`}
                    alt={`Banner ${index + 1}`}
                    className="banner-image"
                  />
                </div>
                <div className="banner-actions text-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => deleteBanner(banner._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No banners available.</p>
          )}
        </div>
      </div>

      <div className="banners-section">
        <h4>Upload New Banners</h4>
        <input
          type="file"
          className="form-control upload-input mb-3"
          onChange={handleFileChange}
          ref={fileInputRef}
        />

        {selectedFile && (
          <div className="cropper-container">
            <Cropper
              src={selectedFile}
              style={{ height: 400, width: "100%" }}
              initialAspectRatio={16 / 9}
              aspectRatio={16 / 9}
              guides={false}
              cropBoxResizable={true}
              viewMode={1}
              onInitialized={(instance) => setCropper(instance)}
            />
            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-success btn-sm"
                onClick={uploadBanner}
              >
                Upload
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
