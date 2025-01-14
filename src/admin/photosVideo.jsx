import React, { useEffect, useState, useRef } from "react";
import "./UploadBanners.css";
import { apiCall, getTokenFromLocalStorage } from "../utils/apiCall";
import ConnectMe from "../config/connect";
import { toast } from "react-toastify";
import showToast from "../utils/toastHelper";

export default function PhotosVideos() {
  const [data, setData] = useState([]);
  const [currentType, setCurrentType] = useState("Announcements");
  const [selectedFiles, setSelectedFiles] = useState([]); // Changed from selectedImages to selectedFiles
  const [uploadTypes, setUploadTypes] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchData();
  }, [currentType]);

  useEffect(() => {
    fetchUploadTypes();
  }, []);

  const fetchUploadTypes = async () => {
    try {
      const token = getTokenFromLocalStorage();
      const url = `${ConnectMe.BASE_URL}/admin/type`; // Your API endpoint
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await apiCall("GET", url, headers);
      if (response.success) {
        setUploadTypes(response.data);
      } else {
        toast.error("Failed to fetch upload types");
      }
    } catch (error) {
      console.error("Error fetching upload types:", error.message);
      toast.error("Error fetching upload types");
    }
  };

  const fetchData = async () => {
    try {
      const url = `${ConnectMe.BASE_URL}/photosVideos/${currentType}`;
      const token = getTokenFromLocalStorage();
      const headers = { Authorization: `Bearer ${token}` };

      const response = await apiCall("GET", url, headers);
      if (response.success) {
        setData(response.data?.data || []);
      } else {
        showToast(`Failed to load ${currentType}`, "error");
      }
    } catch (error) {
      console.error(`Error fetching ${currentType}:`, error.message);
      showToast(`Error fetching ${currentType}`, "error");
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const url = `${ConnectMe.BASE_URL}/photosVideos/${itemId}`;
      const token = getTokenFromLocalStorage();
      const headers = { Authorization: `Bearer ${token}` };

      const response = await apiCall("DELETE", url, headers);
      if (response.success) {
        showToast(` deleted successfully`, "success");
        fetchData(); // Refresh the list
      } else {
        showToast(`Failed to delete`, "error");
      }
    } catch (error) {
      console.error(`Error deleting:`, error.message);
      showToast(`Error deleting`, "error");
    }
  };

  const uploadItem = async () => {
    if (selectedFiles.length === 0) {
      showToast(`Please select at least one ${currentType} file.`, "error");
      return;
    }

    try {
      const url = `${ConnectMe.BASE_URL}/file/upload`;
      const token = getTokenFromLocalStorage();
      const headers = { Authorization: `Bearer ${token}` };
      const formData = new FormData();

      for (const file of selectedFiles) {
        if (typeof file === "string") {
          // If it's a URL, fetch and convert to a file
          const response = await fetch(file);
          if (!response.ok) {
            showToast(`Failed to fetch the file from URL: ${file}`, "error");
            return;
          }
          const blob = await response.blob();
          const newFile = new File([blob], `${currentType}.${file.split(".").pop()}`, { type: blob.type });
          formData.append("files", newFile);
        } else {
          formData.append("files", file);
        }
      }

      formData.append("name", currentType);

      const response = await apiCall("POST", url, headers, formData);
      if (response.success) {
        showToast(`${currentType} uploaded successfully!`, "success");
        setSelectedFiles([]);
        fetchData(); // Refresh the list
        if (fileInputRef.current) fileInputRef.current.value = null;
      } else {
        showToast(`Failed to upload ${currentType}`, "error");
      }
    } catch (error) {
      console.error(`Error uploading ${currentType}:`, error.message);
      showToast(`Error uploading ${currentType}: ${error.message}`, "error");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map((file) => URL.createObjectURL(file)); // Updated to handle both image and video files
    setSelectedFiles(files); // Update the selected files state
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const renderButtons = () => {
    const types = uploadTypes;
    return types?.map((type) => (
      <button
        key={type._id}
        className={`btn btn-sm ${currentType === type.name ? "btn-primary" : "btn-outline-primary"}`}
        onClick={() => setCurrentType(type.name)}
      >
        {type.name}
      </button>
    ));
  };

  const renderPreview = (file) => {
    if (file.type.startsWith("image")) {
      return <img src={URL.createObjectURL(file)} alt="Selected" className="banner-image" />;
    } else if (file.type.startsWith("video")) {
      return <video controls className="banner-video"><source src={URL.createObjectURL(file)} type={file.type} />Your browser does not support the video tag.</video>;
    }
    return null;
  };

  return (
    <div className="upload-banners container">
      {/* Type Selector */}
      <div className="type-selector mb-4">{renderButtons()}</div>

      {/* Current Items Section */}
      <div className="banners-section mb-4">
        <h4>Current {currentType.charAt(0).toUpperCase() + currentType.slice(1)}</h4>
        <div className="row">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={item._id} className="col-6 col-sm-3 mb-4">
                <div className="banner-card">
                  <img
                    src={`${ConnectMe.img_URL}${item.imagePath}`}
                    alt={`${currentType} ${index + 1}`}
                    className="banner-image"
                  />
                </div>
                <div className="banner-actions text-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => deleteItem(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No {currentType} available.</p>
          )}
        </div>
      </div>

      {/* Upload New Items Section */}
      <div className="banners-section">
        <h4>Upload New {currentType.charAt(0).toUpperCase() + currentType.slice(1)}</h4>
        <input
          type="file"
          className="form-control upload-input mb-3"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        {selectedFiles.length > 0 && (
          <div className="row">
            {selectedFiles.map((file, index) => (
              <div key={index} className="col-6 col-sm-3 mb-4">
                {renderPreview(file)}
              </div>
            ))}
          </div>
        )}
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-danger btn-sm" onClick={uploadItem}>
            Upload
          </button>
          <button className="btn btn-info btn-sm" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
