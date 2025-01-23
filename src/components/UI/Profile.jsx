import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col, Image, Card, Spinner } from 'react-bootstrap';
import { FaCamera, FaTrash } from 'react-icons/fa';
import showToast from '../../utils/toastHelper';
import ConnectMe from '../../config/connect';
import { apiCall, getTokenFromLocalStorage } from '../../utils/apiCall';
import UpdatePassword from './updatePassComponent';

const UserProfile = () => {
    const [selectedImages, setSelectedImages] = useState([]); // Array for selected images
    const [userDetails, setUserDetails] = useState({});
    const [updatedPhoto, setUpdatedPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
 
   

    const fetchWorkAnniversaries = async () => {
        try {
            setLoading(true); // Show loader while fetching
            const url = `${ConnectMe.BASE_URL}/hrms/userProfile`; // Replace with actual URL
             const token = getTokenFromLocalStorage(); // Assuming the token is stored in localStorage
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const response = await apiCall("GET", url, headers);
            if (response.success) {
                setUserDetails(response?.data);
            }
        } catch (err) {
            showToast("Error fetching work anniversaries. Showing sample data.", "error");
            // Set sample data in case of error

        } finally {
            setLoading(false); // Hide loader after fetching
        }
    };

    useEffect(() => {
        fetchWorkAnniversaries();
    }, []);

    // Handle profile picture update
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a temporary URL for the selected image
            const imageUrl = URL.createObjectURL(file);
            setUpdatedPhoto(imageUrl); // Temporarily display the new photo
            setSelectedImages([file]); // Store the selected file in the array (as only one image can be selected)
        }
    };

    const handleRemovePhoto = () => {
        setUpdatedPhoto(null); // Clear the temporary photo
        setSelectedImages([]); // Clear the selected images array
        setUserDetails({ ...userDetails, profilePicture: 'https://placehold.co/150' }); // Reset to default profile picture
    };

    const handleSubmit = async () => {
        try {
            // Ensure a photo is updated
            if (updatedPhoto) {
                setUserDetails({
                    ...userDetails,
                    profilePicture: updatedPhoto,
                });
            }

            alert('Profile updated successfully!');

            // Upload the image and get the image ID
            const uploadResponse = await uploadImageAnnouncement();
            const imageId = uploadResponse?.data?.idForUnderverslaUpload;

            // Check if imageId is retrieved successfully
            if (!imageId) {
                alert('Failed to upload the image. Please try again.');
                return;
            }

            // Define the API URL and headers
            const url = `${ConnectMe.BASE_URL}/hrms/update-images`; // Replace with actual backend URL
            const token = getTokenFromLocalStorage();
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            // Prepare the request body
            const requestBody = {
                imageId: imageId[0], // Pass the uploaded image ID
            };

            // Make the API call
            const response = await apiCall('PUT', url, headers, JSON.stringify(requestBody));

            // Handle the response
            if (response.success) {
                alert('User profile image updated successfully!');

            } else {
                showToast(response.message, 'error');
            }
        } catch (err) {
            console.error('Error updating user image:', err);
        }
    };


    const uploadImageAnnouncement = async () => {
        if (selectedImages.length === 0) {
            showToast('Please select at least one image.', 'error');
            return;
        }

        try {
            const url = `${ConnectMe.BASE_URL}/file/upload`;
            const token = getTokenFromLocalStorage();
            const formData = new FormData();
            for (const image of selectedImages) {
                if (typeof image === 'string') {
                    const response = await fetch(image);
                    if (!response.ok) {
                        showToast(`Failed to fetch the image from URL: ${image}`, 'error');
                        return;
                    }
                    const blob = await response.blob();
                    const file = new File([blob], 'banners.png', { type: blob.type });

                    formData.append('files', file);
                } else {
                    formData.append('files', image);
                }
            }
            formData.append('name', 'ProfilePhoto');

            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await apiCall('POST', url, headers, formData);
            if (response.success) {
                showToast('Banner uploaded successfully!', 'success')
                console.log(response)
                return response
            } else {
                showToast("Failed to upload banner", 'error')
            }
        } catch (error) {
            console.error('Error uploading banner:', error.message);
            showToast(`Error uploading banner: ${error.message || 'An unexpected error occurred'}`, 'error');
        }
    };
    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6} sm={12}>
                    <div className="text-center">
                        {/* Display Profile Photo */}
                        <Image
                            src={updatedPhoto || `${ConnectMe.img_URL}${userDetails?.user?.images?.imagePath}` || "./user.png"} // Default fallback image
                            roundedCircle
                            width="150"
                            height="150"
                            alt="User Profile"
                        />
                        <div className="mt-2">
                            {/* File Input for Photo */}
                            <label htmlFor="file-upload" className="btn btn-primary">
                                <FaCamera size={20} /> Update Photo
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handlePhotoChange}
                            />
                            {/* Remove Photo Button */}
                            {updatedPhoto && (
                                <Button variant="danger" className="mt-2" onClick={handleRemovePhoto}>
                                    <FaTrash size={16} /> Remove Photo
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Display User Details */}
                    <div className="mt-4">
                        {/* Full Name */}
                        <div className="mb-3">
                            <strong>Full Name:</strong> <br />
                            {`${userDetails?.employeeDetails?.FirstName || ""} ${userDetails?.employeeDetails?.MiddleName || ""} ${userDetails?.employeeDetails?.LastName || ""}`.trim()}
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <strong>Email:</strong> <br />
                            {userDetails?.user?.email || "N/A"}
                        </div>
                        {/* Employee Code */}
                        {userDetails?.employeeDetails?.EmployeeCode && (
                            <div className="mb-3">
                                <strong>Employee Code:</strong> <br />
                                {userDetails.employeeDetails.EmployeeCode}
                            </div>
                        )}
                        {/* Employee ID */}
                        {userDetails?.user?.EmployeeID && (
                            <div className="mb-3">
                                <strong>Employee ID:</strong> <br />
                                {userDetails?.user?.EmployeeID}
                            </div>
                        )}

                        {/* CustomField6 */}
                        {userDetails?.employeeDetails?.CustomField6 && (
                            <div className="mb-3">
                                <strong>Designation:</strong> <br />
                                {userDetails.employeeDetails.CustomField6}
                            </div>
                        )}

                        {/* Update Button */}
                        <Button variant="success" type="button" className="mt-4" onClick={handleSubmit}>
                            Update Profile Photo
                        </Button>
                    </div>
                </Col>
            </Row>
            <UpdatePassword email={userDetails?.user?.email}/>
        </Container>
    );
};

export default UserProfile;
