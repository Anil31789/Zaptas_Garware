import React, { useCallback, useEffect, useState } from "react";
import "./Announcements.css";
import { apiCall, getTokenFromLocalStorage } from "../utils/apiCall";
import ConnectMe from "../config/connect";
import showToast from "../utils/toastHelper";
import { FaPlusCircle, FaTimesCircle } from 'react-icons/fa';
export default function CalenderHoliday() {
  const [selectedImages, setSelectedImages] = useState([]); // Initializing the state for selected images
  const [existingAnnouncements, setExistingAnnouncements] = useState([]);
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
    images: [],
    department: "",
    fullName: "",
    Designation: "",
    name: 'CsrType',
    links: [{ linkTitle: '', link: '' }],
    startDate: '',
    endDate: ""
  });



  const handleChange = (e) => {
    const { id, value, type } = e.target;

    // If the input is a file input, handle it separately
    if (type === "file") {
      const files = Array.from(e.target.files); // Convert FileList to an array
      const fileUrls = files.map((file) => URL.createObjectURL(file)); // Generate preview URLs


      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...files], // Append new files to existing images
      }));


      setSelectedImages((prev) => [...prev, ...fileUrls]); // Append new URLs to existing selected images
    } else {
      // Handle regular text inputs
      setFormData({
        ...formData,
        [id]: value, // Update value for regular text inputs
      });
    }

  };




  const handleSubmit = async (e) => {
    e.preventDefault();


    const dataToSave = {
      fullName: formData.fullName,
      title: formData.title,
      location: formData.location,
      description: formData.description,
      Designation: formData.Designation,
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      department:formData.department
    };


    const token = getTokenFromLocalStorage();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const url = `${ConnectMe.BASE_URL}/calendar/holidays`;
    const result = await apiCall('POST', url, headers, JSON.stringify(dataToSave));

    if (result.success) {
      showToast('Uploaded Successfully', 'success')
      setFormData({
        title: "",
        location: "",
        description: "",
        images: [],
        fullName: "",
        Designation: "",
        name: 'announcement',
        links: [{ linkTitle: '', link: '' }],
        startDate: ''
      });
      setSelectedImages([])
    } else {
      console.error('Error saving announcement:', result.message);
    }
  };





  const fetchExistingAnnouncements = async (page = 1, limit = 3) => {
    try {
      setLoading(true); // Show loader while fetching
      const url = `${ConnectMe.BASE_URL}/calendar/holidaysadmin?page=${page}&limit=${limit}`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);
      if (response.success) {
        if (response.data.announcements.length > 0) {
          setExistingAnnouncements(response.data.announcements);

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

  // Load more announcements on scroll
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
  }, [page]);;


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
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()

    try {


      // Prepare the data to update
      const dataToUpdate = {
        updates: {
          fullName: selectedAnnouncement.fullName,
          title: selectedAnnouncement.title,
          location: selectedAnnouncement.location,
          description: selectedAnnouncement.description,
          Designation: selectedAnnouncement.Designation,
          name: selectedAnnouncement.name,
          startDate: selectedAnnouncement.startDate,
          endDate: selectedAnnouncement.endDate,
          department:selectedAnnouncement.department
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
      const url = `${ConnectMe.BASE_URL}/calendar/holidays/${selectedAnnouncement._id}`;

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

    const url = `${ConnectMe.BASE_URL}/csr/${_id}`;
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
          <h4>Current Holidays</h4>
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
            <div
              className="d-flex justify-content-between align-items-center" // Flexbox layout
              style={{ fontSize: '20px' }}
            >
              <span>Edit Holiday</span>
              <div
                onClick={() => setSelectedAnnouncement(null)}
                style={{ cursor: 'pointer' }}
              >
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
                   {/* <div className="mb-3">
                <label htmlFor="manager" className="form-label">Your Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-control"
                  required
                  value={selectedAnnouncement.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">

                <label htmlFor="manager" className="form-label">Your Designation</label>
                <input
                  type="text"
                  className="form-control"
                  id="Designation"
                  name="Designation"
                  value={selectedAnnouncement.Designation}
                  onChange={handleInputChange}
                />
              </div> */}


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
                <label htmlFor="location" className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  name="location"
                  value={selectedAnnouncement.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">Department</label>
                <input
                  type="text"
                  className="form-control"
                  id="department"
                  name="department"
                  value={selectedAnnouncement.department}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="AnnouncementDate" className="form-label">start Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="startDate"
                  value={selectedAnnouncement.startDate.substring(0, 10)} // Only the date part
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="AnnouncementDate" className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  name="endDate"
                  value={selectedAnnouncement.endDate.substring(0, 10)} // Only the date part
                  onChange={handleInputChange}
                />
              </div>






              <button type="submit" className="btn btn-success">Save Changes</button>
            </form>
          </div >
        )
        }
      </div >

      <hr></hr>
      {/* New Announcements Section */}


      {
        selectedAnnouncement == null &&
        <div className="new-announcements">
          <h4>New Holiday</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title"> Title</label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter announcement title"
              />
            </div>

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

            <div className="form-group">
              <label htmlFor="date">Start Date</label>
              <input type="date" id="startDate" value={formData.startDate}
                onChange={handleChange}
                placeholder="29 Nov 2024" />
            </div>
            <div className="form-group">
              <label htmlFor="date">End Date</label>
              <input type="date" id="endDate" value={formData.endDate}
                onChange={handleChange}
                placeholder="29 Nov 2024" />
            </div>



            <div className="form-group">
              <label htmlFor="date">For Certain Department else leave blank</label>
              <input type="text" id="department" value={formData.department}
                onChange={handleChange}
                placeholder="All" />
            </div>


            <div className="form-group">
              <label htmlFor="date">For Certain Location else leave blank</label>
              <input type="text" id="location" value={formData.location}
                onChange={handleChange}
                placeholder="All" />
            </div>



            {/* 
            <div className="form-group">
              <label htmlFor="location">For Which Location Holiday is for?</label>
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







            <div className="form-actions">
              <button type="submit" className="save-btn">
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
