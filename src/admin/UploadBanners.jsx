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

        <div className="image-info mt-3">
          <p><strong>Banner Size:</strong> 1440px (Width) x 482px (Height)</p>
          <p><strong>Aspect Ratio:</strong> 3:1 (Width:Height)</p>
        </div>
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
              aspectRatio={3 / 1}  // Force 3:1 aspect ratio
              viewMode={1}          // Restrict movement but allow zoom
              minCropBoxWidth={1440} // Minimum crop width fixed to 1440px
              minCropBoxHeight={482} // Minimum crop height fixed to 482px
              zoomable={true}        // Allow zooming in and out
              scalable={false}       // Disable scaling beyond limits
              movable={false}        // Prevent moving the crop box
              cropBoxMovable={false} // Lock the crop box position
              cropBoxResizable={false} // Prevent resizing crop box
              minCanvasHeight={1}  // Ensure minimum canvas height
              minCanvasWidth={3}  // Ensure minimum canvas width
              onInitialized={setCropper}
            />





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
