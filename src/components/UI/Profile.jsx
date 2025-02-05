import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col, Image, Card } from "react-bootstrap";
import { FaCamera, FaTrash } from "react-icons/fa";
import showToast from "../../utils/toastHelper";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import UpdatePassword from "./updatePassComponent";

const UserProfile = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [updatedPhoto, setUpdatedPhoto] = useState(null);
  const [userDetailsLocal, setUserDetailsLocal] = useState(null);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      setUserDetailsLocal(JSON.parse(storedUserDetails));
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUpdatedPhoto(imageUrl);
      setSelectedImages([file]);
    }
  };

  const handleRemovePhoto = () => {
    setUpdatedPhoto(null);
    setSelectedImages([]);
    setUserDetails({ ...userDetails, profilePicture: "https://placehold.co/150" });
  };

  const handleSubmit = async () => {
    try {
      if (updatedPhoto) {
        setUserDetails({ ...userDetails, profilePicture: updatedPhoto });
      }

      const uploadResponse = await uploadImageAnnouncement();
      const imageId = uploadResponse?.data?.idForUnderverslaUpload;

      if (!imageId) {
        alert("Failed to upload the image. Please try again.");
        return;
      }

      const url = `${ConnectMe.BASE_URL}/hrms/update-images`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const requestBody = { imageId: imageId[0] };

      const response = await apiCall("PUT", url, headers, JSON.stringify(requestBody));

      if (response.success) {
        alert("User profile image updated successfully!");
        localStorage.removeItem("userDetails");
        localStorage.setItem("userDetails", JSON.stringify(response?.data));
      } else {
        showToast(response.message, "error");
      }
    } catch (err) {
      console.error("Error updating user image:", err);
    }
  };

  const uploadImageAnnouncement = async () => {
    if (selectedImages.length === 0) {
      showToast("Please select at least one image.", "error");
      return;
    }

    try {
      const url = `${ConnectMe.BASE_URL}/file/upload`;
      const token = getTokenFromLocalStorage();
      const formData = new FormData();

      for (const image of selectedImages) {
        if (typeof image === "string") {
          const response = await fetch(image);
          if (!response.ok) {
            showToast(`Failed to fetch the image from URL: ${image}`, "error");
            return;
          }
          const blob = await response.blob();
          const file = new File([blob], "banners.png", { type: blob.type });
          formData.append("files", file);
        } else {
          formData.append("files", image);
        }
      }
      formData.append("name", "ProfilePhoto");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await apiCall("POST", url, headers, formData);

      if (response.success) {
        showToast("Uploaded successfully!", "success");
        return response;
      } else {
        showToast("Failed to upload", "error");
      }
    } catch (error) {
      console.error("Error uploading:", error.message);
      showToast(`Error uploading: ${error.message || "An unexpected error occurred"}`, "error");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-start">
        {/* Left Column for Profile Image */}
        <Col md={4} sm={12}>
          <Card className="p-4 shadow-lg text-center d-flex align-items-center" style={{ borderRadius: "12px" }}>
            <Image
              src={
                updatedPhoto || `${ConnectMe.img_URL}${userDetailsLocal?.images?.imagePath}` || "./user.png"
              }
              roundedCircle
              width="130"
              height="130"
              alt="User Profile"
              className="mb-3"
            />
            <div>
              <label htmlFor="file-upload" className="btn btn-primary btn-sm">
                <FaCamera size={16} /> Update Photo
              </label>
              <input id="file-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
            </div>
            {updatedPhoto && (
              <Button variant="danger" size="sm" className="mt-2" onClick={handleRemovePhoto}>
                <FaTrash size={14} /> Remove
              </Button>
            )}
            <Button variant="success" size="sm" className="mt-3 px-4" onClick={handleSubmit}>
  Save
</Button>

          </Card>
        </Col>

        {/* Right Column for User Details */}
        <Col md={7} sm={12}>
          <Card className="p-4 shadow-lg" style={{ borderRadius: "12px" }}>
            <h4 className="text-primary">User Details</h4>
            <hr />
            <div className="mb-3">
              <strong>Full Name:</strong> <br />
              {userDetailsLocal?.name}
            </div>
            <div className="mb-3">
              <strong>Email:</strong> <br />
              {userDetailsLocal?.email || "N/A"}
            </div>
            {userDetailsLocal?.employeeCode && (
              <div className="mb-3">
                <strong>Employee Code:</strong> <br />
                {userDetailsLocal?.employeeCode}
              </div>
            )}
            {userDetailsLocal?.EmployeeID && (
              <div className="mb-3">
                <strong>Employee ID:</strong> <br />
                {userDetailsLocal?.EmployeeID}
              </div>
            )}
            {userDetailsLocal?.jobTitle && (
              <div className="mb-3">
                <strong>Designation:</strong> <br />
                {userDetailsLocal?.jobTitle}
              </div>
            )}
          </Card>
        </Col>
      </Row>
      {/* <Row className="mt-4">
        <Col md={12}>
          <UpdatePassword email={userDetailsLocal?.email} />
        </Col>
      </Row> */}
    </Container>
  );
};

export default UserProfile;
