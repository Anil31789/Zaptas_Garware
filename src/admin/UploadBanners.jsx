import React, { useEffect, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./UploadBanners.css";
import { apiCall, getTokenFromLocalStorage } from "../utils/apiCall";
import ConnectMe from "../config/connect";
import showToast from "../utils/toastHelper";

export default function UploadBanners() {
  const [banners, setBanners] = useState([]);
  const [cropper, setCropper] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropDimensions, setCropDimensions] = useState({ width: 0, height: 0 });
  const fileInputRef = React.createRef();

  useEffect(() => {
    fetchBanners();
  }, []);

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
      showToast("Error fetching banners", "error");
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
        showToast("Banner deleted successfully", "success");
        await fetchBanners();  // ✅ Await fetchBanners to ensure the state updates properly
      } else {
        showToast("Failed to delete banner", "error");
      }
    } catch (error) {
      showToast("Error deleting banner", "error");
    }
  };

  const saveCroppedImage = () => {
    if (!cropper) {
      showToast("Please crop the image before saving", "error");
      return;
    }
    cropper.getCroppedCanvas().toBlob((blob) => {
      setCroppedImage(blob);
      showToast("Image cropped successfully!", "success");
    });
  };

  const uploadBanner = async () => {
    if (!croppedImage) {
      showToast("Please save the cropped image before uploading", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", croppedImage, "banner.png");
      formData.append("name", "Banners");

      const url = `${ConnectMe.BASE_URL}/file/upload`;
      const token = getTokenFromLocalStorage();
      const headers = { Authorization: `Bearer ${token}` };

      const response = await apiCall("POST", url, headers, formData);

      if (response.success) {
        showToast("Banner uploaded successfully!", "success");
        setSelectedFile(null);
        setCroppedImage(null);
        fileInputRef.current.value = null;
        fetchBanners();
      } else {
        showToast("Failed to upload banner", "error");
      }
    } catch (error) {
      showToast("Error uploading banner", "error");
    }
  };

  const handleCropperChange = () => {
    if (cropper) {
      const data = cropper.getData();
      setCropDimensions({ width: data.width, height: data.height });
    }
  };

  return (
    <div className="upload-banners container">
      <div className="banners-section mb-4">
        <h4>Current Banners</h4>
        <div className="row">
          {banners.length > 0 ? (
            banners.map((banner) => (
              <div key={banner._id} className="col-6 col-sm-3 mb-4">
                <div className="banner-card">
                  <img
                    src={`${ConnectMe.img_URL}${banner.imagePath}`}
                    alt="Banner"
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
          accept=".png,.jpg,.jpeg"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
              if (!allowedTypes.includes(file.type)) {
                showToast("Only PNG, JPG, or JPEG files are allowed", "error");
                fileInputRef.current.value = null;
                return;
              }
              setSelectedFile(URL.createObjectURL(file));
              setCroppedImage(null);
            }
          }}
          ref={fileInputRef}
        />

        {selectedFile && (
          <div className="cropper-container">
            <Cropper
              src={selectedFile}
              style={{ height: "500px", width: "auto" }}
              // aspectRatio={16 / 9}   // Maintain the aspect ratio
              viewMode={1}           // Keeps the crop box fixed and doesn't allow it to be moved
              minHeight={500}        // Minimum height fixed to 500px
       
              onInitialized={setCropper}
              onCrop={handleCropperChange} // Listen for crop changes
            />

            <div className="crop-dimensions">
              <p>Width: {cropDimensions.width}px</p>
              <p>Height: {cropDimensions.height}px</p>
            </div>

            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-primary btn-sm" onClick={saveCroppedImage}>
                Save
              </button>
              <button
                className="btn btn-success btn-sm"
                onClick={uploadBanner}
                disabled={!croppedImage}
              >
                Upload
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  setSelectedFile(null);
                  setCroppedImage(null);
                  fileInputRef.current.value = null;
                }}
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
