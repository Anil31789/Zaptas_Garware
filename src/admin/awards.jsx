import React, { useCallback, useEffect, useState } from "react";
import "./Announcements.css";
import { apiCall, getTokenFromLocalStorage } from "../utils/apiCall";
import ConnectMe from "../config/connect";
import showToast from "../utils/toastHelper";
import { FaPlusCircle, FaTimesCircle } from 'react-icons/fa';
export default function AwardsPage() {
  const [selectedImages, setSelectedImages] = useState([]); // Initializing the state for selected images
  const [existingAnnouncements, setExistingAnnouncements] = useState([]);
  const [limit] = useState(3); // Fixed number of items per page
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For full-size image preview

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    AwardierName: "",
    PersonDesignation: "",
    images: [],
    fullName: "",
    Designation: "",
    name: 'awards',
    links: [{ linkTitle: '', link: '' }],
    AnnouncementDate: ''
  });



  const handleChange = (e) => {
    const { id, value, type } = e.target;

    if (type === "file") {
      const files = Array.from(e.target.files);

      // Allowed file types
      const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "video/mp4"];

      const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
      if (invalidFiles.length > 0) {
        showToast("Only PNG, JPG, JPEG, or MP4 files are allowed", "error");
        return;
      }

      // Generate preview URLs including file type
      const fileData = files.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type,
      }));

      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...files], // Store the actual files
      }));

      setSelectedImages((prev) => [...prev, ...fileData]); // Store URLs and types
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };



  const removeImage = (index, name = null) => {


    if (name == 'update') {
      setSelectedAnnouncement((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index), // Remove the specific file from form data
        imagePath: prev.imagePath.filter((_, i) => i !== index), // Remove the specific file from form data
      }));

    }
    else {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index)); // Remove the specific image URL
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index), // Remove the specific file from form data
      }));
    }

  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader
    let imageId = null;

    try {
      // Check if formData.images exist and are not empty
      if (formData.images && formData.images.length > 0) {
        imageId = await uploadImageAnnouncement();
      }

      const dataToSave = {
        fullName: formData.fullName,
        title: formData.title,
        AwardierName: formData?.AwardierName,
        PersonDesignation: formData?.PersonDesignation,
        location: formData.location,
        description: formData.description,
        Designation: formData.Designation,
        name: formData.name,
        links: formData.links,
        AnnouncementDate: formData.AnnouncementDate,
        images: imageId?.data?.idForUnderverslaUpload || null,
      };

      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const url = `${ConnectMe.BASE_URL}/awards/create`;
      const result = await apiCall('POST', url, headers, JSON.stringify(dataToSave));

      if (result.success) {
        showToast('Uploaded Successfully', 'success');
        setFormData({
          title: "",
          location: "",
          description: "",
          images: [],
          fullName: "",
          Designation: "",
          AwardierName: "",
          PersonDesignation: "",
          name: 'awards',
          links: [{ linkTitle: '', link: '' }],
          AnnouncementDate: ''
        });
        setSelectedImages([]);
      } else {
        console.error('Error saving announcement:', result.message);
        showToast('Upload failed!', 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setLoading(false); // Stop loader
    }
  };



  const uploadImageAnnouncement = async () => {
    if (selectedImages.length === 0) {
      showToast('Please select at least one image or video.', 'error');
      return;
    }

    try {
      const url = `${ConnectMe.BASE_URL}/file/upload`;
      const token = getTokenFromLocalStorage();

      const formData = new FormData();

      for (const media of selectedImages) {
        if (media.url.startsWith("blob:")) {
          // Fetch the blob from the object URL
          const response = await fetch(media.url);
          if (!response.ok) {
            showToast(`Failed to fetch media from URL: ${media.url}`, 'error');
            return;
          }
          const blob = await response.blob();

          // Extract file extension based on media type
          const extension = media.type.split("/")[1];
          const fileName = `banner.${extension}`;

          const file = new File([blob], fileName, { type: blob.type });
          formData.append('files', file);
        } else {
          // If it's already a file object, append directly
          formData.append('files', media);
        }
      }

      formData.append('name', 'awards');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const response = await apiCall('POST', url, headers, formData);
      if (response.success) {
        showToast('Banner uploaded successfully!', 'success');
        console.log(response);
        return response;
      } else {
        showToast('Failed to upload banner', 'error');
      }
    } catch (error) {
      console.error('Error uploading banner:', error.message);
      showToast(`Error uploading banner: ${error.message || 'An unexpected error occurred'}`, 'error');
    }
  };


  const handleAddLink = (name = null) => {

    if (name == 'linkUpdate') {
      const lastLink =
        selectedAnnouncement.links[selectedAnnouncement.links.length - 1];

      // Ensure the last link is completely filled
      if (!lastLink.linkTitle || !lastLink.link) {
        alert("Please fill in both the Link Title and Link before adding a new one.");
        return;
      }

      // Add a new link object to the links array
      setSelectedAnnouncement((prevAnnouncement) => ({
        ...prevAnnouncement,
        links: [...prevAnnouncement.links, { linkTitle: "", link: "" }],
      }));
    } else {
      const lastLink = formData.links[formData.links.length - 1];
      if (!lastLink.linkTitle || !lastLink.link) {
        alert('Please fill in both the Link Title and Link before adding a new one.');
        return;
      }

      setFormData({
        ...formData,
        links: [...formData.links, { linkTitle: '', link: '' }], // Add new empty link pair
      });
    }


  };

  // Remove a specific link field set
  const handleRemoveLink = (index, name = null) => {
    if (name == 'linkUpdate') {
      const newLinks = selectedAnnouncement.links.filter((_, i) => i !== index);
      setSelectedAnnouncement({ ...selectedAnnouncement, links: newLinks });
    }
    else {
      const newLinks = formData.links.filter((_, i) => i !== index);
      setFormData({ ...formData, links: newLinks });
    }
  };



  const handleAddLinkchange = (index, e) => {
    const { name, value } = e.target;
    const newLinks = [...formData.links];
    newLinks[index][name] = value; // Update the value of the specific input field at that index
    setFormData({ ...formData, links: newLinks });
    console.log(formData)
  };


  const fetchExistingAnnouncements = async (page) => {
    try {
      setLoading(true); // Show loader while fetching
      const url = `${ConnectMe.BASE_URL}/awards/latest?page=${page}&limit=${limit}`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);
      if (response.success) {
        if (response.data.announcements.length > 0) {
          setExistingAnnouncements((prev) => [...prev, ...response.data.announcements]); // Append new data
        } else {
          setHasMore(false); // No more data to load
        }
      } else {
        setError("Failed to fetch announcements.");
      }
    } catch (err) {
      setError("Error fetching announcements.");
    } finally {
      setLoading(false); // Hide loader after fetching
    }
  };

  const handleScroll = useCallback(
    (e) => {
      const { scrollLeft, scrollWidth, clientWidth } = e.target;
      if (scrollLeft + clientWidth >= scrollWidth - 10 && !loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchExistingAnnouncements(page);
  }, [page]);



  const handleUpdateClick = (announcement) => {
    // Toggle visibility of the form
    if (selectedAnnouncement?._id === announcement._id) {
      setSelectedAnnouncement(null); // Hide form if the same announcement is clicked
    } else {
      setSelectedAnnouncement(announcement); // Show form for the new announcement
    }
  };


  const handleInputChange = (e, index = null, fieldName = null) => {
    const { name, value } = e.target;
    if (index !== null && fieldName) {
      // Update specific link in the links array
      setSelectedAnnouncement((prevAnnouncement) => {
        const updatedLinks = [...prevAnnouncement.links]; // Create a shallow copy of the links array
        updatedLinks[index] = {
          ...updatedLinks[index],
          [fieldName]: value, // Update the specific field in the link object
        };

        return {
          ...prevAnnouncement,
          links: updatedLinks, // Replace links with the updated array
        };
      });
    } else {
      // Update other fields in selectedAnnouncement
      setSelectedAnnouncement((prevAnnouncement) => ({
        ...prevAnnouncement,
        [name]: value,
      }));
    }

    console.log(selectedAnnouncement)
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()

    try {
      let imageId = null;

      // Check if images are provided in the selectedAnnouncement object
      if (selectedImages && selectedImages.length > 0) {
        // Upload images and get the image ID
        const uploadResponse = await uploadImageAnnouncement();
        imageId = uploadResponse?.data?.idForUnderverslaUpload || null;
      }

      // Prepare the data to update
      const dataToUpdate = {
        updates: {
          fullName: selectedAnnouncement.fullName,
          title: selectedAnnouncement.title,
          location: selectedAnnouncement.location,
          description: selectedAnnouncement.description,
          AwardierName: selectedAnnouncement.AwardierName,
          PersonDesignation: selectedAnnouncement.PersonDesignation,
          Designation: selectedAnnouncement.Designation,
          name: selectedAnnouncement.name,
          links: selectedAnnouncement.links?.filter(
            (link) => link.linkTitle && link.link // Ensure valid links only
          ),
          AnnouncementDate: selectedAnnouncement.AnnouncementDate,
          images: imageId || selectedAnnouncement.images, // Use uploaded image ID or retain existing images
        },
      };


      // Retrieve token from local storage
      const token = getTokenFromLocalStorage();

      // Prepare request headers
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Define the API endpoint
      const url = `${ConnectMe.BASE_URL}/awards/${selectedAnnouncement._id}`;

      // Make the API call using PUT method
      const result = await apiCall('PUT', url, headers, JSON.stringify(dataToUpdate));

      // Handle API response
      if (result.success) {
        showToast('Updated Successfully', 'success');
        setSelectedAnnouncement(null); // Reset the selected announcement
        setSelectedImages([]); // Clear selected images
      } else {
        console.error('Error updating announcement:', result.message);
        showToast(result.message || 'Failed to update announcement', 'error');
      }
    } catch (error) {
      console.error('An error occurred while updating the announcement:', error);
      showToast('An unexpected error occurred. Please try again.', 'error');
    }
  };





  const deleteAnnouncemnt = async (data) => {
    const { _id } = data
    const token = getTokenFromLocalStorage();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const url = `${ConnectMe.BASE_URL}/awards/${_id}`;
    const result = await apiCall('DELETE', url, headers);
    if (result.success) {

      showToast('Deleted Successfully', 'success')
      fetchExistingAnnouncements()
      setSelectedImages([])
    } else {
      console.error('Error saving announcement:', result.message);
    }
  }


  return (
    <div className="admin-announcements">
      <div className="container mt-4">
        <div className="border p-3">
          {error && <div className="alert alert-danger">{error}</div>}
          <div
            className="d-flex"
            style={{
              overflowX: "auto",  // Ensures horizontal scrolling
              maxWidth: "100%",    // Ensures the parent container doesn't exceed available width
              flexWrap: "nowrap",  // Prevents wrapping of cards, keeping them in a single row
            }}
            onScroll={handleScroll}
          >
            {existingAnnouncements.map((announcement) => (
              <div
                className="card me-3"
                key={announcement._id}
                style={{
                  minWidth: "300px", // Set width of each card
                  flexShrink: 0,     // Prevents shrinking of cards
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">{announcement.title}</h5>
                  <div className="mt-2">
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleUpdateClick(announcement)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteAnnouncemnt(announcement)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {loading && <p className="text-muted ms-3">Loading more...</p>}
            {!hasMore && <p className="text-muted ms-3">No more announcements.</p>}
          </div>
        </div>

        {selectedAnnouncement && (
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '20px' }}>
              <span>Edit Awards</span>
              <div onClick={() => setSelectedAnnouncement(null)} style={{ cursor: 'pointer' }}>
                <FaTimesCircle style={{ color: 'red' }} />
              </div>
            </div>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={selectedAnnouncement.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="4"
                  value={selectedAnnouncement.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="AnnouncementDate" className="form-label">Award Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="AnnouncementDate"
                  name="AnnouncementDate"
                  value={selectedAnnouncement.AnnouncementDate.substring(0, 10)} // Only the date part
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                {/* Render existing images if no new images are selected */}
                {selectedImages.length === 0 && selectedAnnouncement.imagePath?.length > 0 &&
                  selectedAnnouncement.imagePath.map((el, index) => (
                    <div key={index} className="mb-2">
                      <label htmlFor="profile-image">Images</label>
                      <img
                        src={`${ConnectMe.img_URL}${el}`} // Display the existing image
                        alt={`Existing Banner ${index + 1}`}
                        className="banner-image"
                      />
                      <div
                        className="delete-icon"
                        onClick={() => removeImage(index, 'update')} // Remove the specific image
                        style={{ cursor: 'pointer' }}
                      >
                        <FaTimesCircle style={{ color: 'red', fontSize: '24px' }} />
                      </div>
                    </div>
                  ))
                }

                {/* File input for selecting new images */}
                <input
                  type="file"
                  id="profile-image"
                  onChange={handleChange}
                  multiple // Allow multiple file uploads
                  className="form-control"
                />

                ** Note: It will replace existing CSR Image
              </div>
              <div className="row">
  {/* Display existing images/videos */}
  {selectedImages.length === 0 &&
    selectedAnnouncement.imagePath?.length > 0 &&
    selectedAnnouncement.imagePath.map((el, index) => {
      const fileUrl = `${ConnectMe.img_URL}${el}`;
      const isVideo = /\.(mp4|avi|mov|mkv)$/i.test(fileUrl);

      return (
        <div key={index} className="col-6 col-sm-3 mb-4 position-relative">
          <label htmlFor="profile-media">Media</label>
          {isVideo ? (
            <video controls className="banner-image">
              <source src={fileUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={fileUrl} alt={`Existing Media ${index + 1}`} className="banner-image" />
          )}
          <div
            className="delete-icon"
            onClick={() => removeImage(index, "update")}
            style={{ cursor: "pointer" }}
          >
            <FaTimesCircle style={{ color: "red", fontSize: "24px" }} />
          </div>
        </div>
      );
    })}

  {/* Display newly added images/videos */}
  {selectedImages.length > 0 &&
    selectedImages.map((file, index) => {
      const isVideo = file.type.startsWith("video/");

      return (
        <div key={index} className="col-6 col-sm-3 mb-4 position-relative">
          <label htmlFor="new-media">New Media</label>
          {isVideo ? (
            <video controls className="banner-image">
              <source src={file.url} type={file.type} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={file.url} alt={`Selected Media ${index + 1}`} className="banner-image" />
          )}
          <div
            className="delete-icon"
            onClick={() => removeImage(index)}
            style={{ cursor: "pointer" }}
          >
            <FaTimesCircle style={{ color: "red", fontSize: "24px" }} />
          </div>
        </div>
      );
    })}
</div>




              <button type="submit" className="btn btn-success" disabled={loading}>Save Changes</button>
            </form>
          </div>
        )}
      </div>


      <hr></hr>
      {/* New Announcements Section */}


      {
        selectedAnnouncement == null &&
        <div className="new-announcements">
          <h4>New Award</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Award Title</label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter Award title"
              />
            </div>
            {/* 
           {/* 
            <div className="form-group">
              <label htmlFor="manager">Your Full Name</label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Kushagra Kamal"
              />
            </div> */}

            {/* <div className="form-group">
              <label htmlFor="manager">Your Designation</label>
              <input
                type="text"
                id="Designation"
                value={formData.Designation}
                onChange={handleChange}
                placeholder="Assistant Manager - Accounts"
              />
            </div> */}
            {/* <div className="form-group">
              <label htmlFor="manager">Whom to Award His/Her full name</label>
              <input
                type="text"
                id="AwardierName"
                value={formData.AwardierName}
                onChange={handleChange}
                placeholder="Kushagra kamal"
              />
            </div> */}
            {/* <div className="form-group">
              <label htmlFor="manager">Person Designation</label>
              <input
                type="text"
                id="PersonDesignation"
                value={formData.PersonDesignation}
                onChange={handleChange}
                placeholder="Assistant Manager - Accounts"
              />
            </div> */}

            <div className="form-group">
              <label htmlFor="date">Award Date</label>
              <input type="date" id="AnnouncementDate" value={formData.AnnouncementDate}
                onChange={handleChange}
                placeholder="29 Nov 2024" />
            </div>

            {/* <div className="form-group">
              <label htmlFor="location">For Which Location Award is for?</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Chhatrapati Sambhajinagar (Maharashtra)"
              />
            </div> */}

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                required
                onChange={handleChange}
                placeholder="Enter description"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="profile-image">Images  </label>
              <input
                type="file"
                id="profile-image"
                onChange={handleChange}
                multiple // Allow multiple file selection
              />
            </div>


            <div className="row">
              {selectedImages && selectedImages.length > 0 &&
                selectedImages.map((file, index) => (
                  <div key={index} className="col-6 col-sm-3 mb-4 position-relative">
                    <div className="banner-card">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={file.url} // Use the URL from the selectedImages array
                          alt={`Selected Banner ${index + 1}`}
                          className="banner-image"
                        />
                      ) : file.type.startsWith("video/") ? (
                        <video controls className="banner-image">
                          <source src={file.url} type={file.type} />
                          Your browser does not support the video tag.
                        </video>
                      ) : null}

                      {/* Cross icon in the top-right corner */}
                      <div
                        className="delete-icon"
                        onClick={() => removeImage(index)} // Remove the specific image or video
                        style={{ cursor: "pointer" }}
                      >
                        <FaTimesCircle style={{ color: "red", fontSize: "24px" }} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>




            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                Save
              </button>
              <button type="reset" className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      }
    </div >
  );
}
