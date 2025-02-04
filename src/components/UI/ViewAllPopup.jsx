import React, { useEffect, useState, useRef } from "react";
import { FaThumbsUp } from "react-icons/fa";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";
import PostCard from "./postDisplay";
import Loader from "../Loader";
import "bootstrap/dist/css/bootstrap.min.css";
import './ViewAllPopup.css'; // Assuming a custom CSS file for extra styles
import { useLocation } from "react-router-dom";

export default function ViewAllPage() {
  const { state } = useLocation();
  const { title, type = "announcement", bannerImg } = state;
  const [selectedImage, setSelectedImage] = useState(null); // For full-size image preview
  const [posts, setPosts] = useState([]); // All fetched posts
  const [loading, setLoading] = useState(false); // Loading state
  const [showOtherImages, setShowOtherImages] = useState(false); // State to toggle visibility of other images
  const [currentPostImages, setCurrentPostImages] = useState([]); // Store images of the clicked post
  const startRef = useRef(1); // Ref for pagination
  const hasMore = useRef(true); // Ref to track if there are more posts

  const fetchAnnouncements = async (limit = 9) => {
    if (!hasMore.current || loading) return;

    try {
      setLoading(true);
      const url = `${ConnectMe.BASE_URL}/${type}/latest?page=${startRef.current}&limit=${limit}`;
      const token = getTokenFromLocalStorage();

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);

      if (response.success && response.data.announcements.length > 0) {
        setPosts((prev) => [...prev, ...response.data.announcements]);
        startRef.current += 1;
      } else {
        hasMore.current = false;
        if (response.data.announcements.length === 0) {
          showToast("No more posts available", "info");
        }
      }
    } catch (error) {
      hasMore.current = false;
      showToast("Error loading posts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleLikedisslike = async (announcementId, isLiked) => {
    showToast(isLiked ? "Unlike success" : "Like success", "success");
    const token = getTokenFromLocalStorage();
    const url = `${ConnectMe.BASE_URL}/${type}/${announcementId}/${isLiked ? "unlike" : "like"}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await apiCall("POST", url, headers);
      if (response.success) {
        setPosts((prevAnnouncements) =>
          prevAnnouncements.map((announcement) => {
            if (announcement._id === announcementId) {
              const updatedLikes = isLiked
                ? announcement.likes.filter(
                  (userId) => userId !== response.userId
                )
                : [...announcement.likes, response.userId];

              return {
                ...announcement,
                likes: updatedLikes,
                likesCount: updatedLikes.length,
                likedByUser: !isLiked,
              };
            }
            return announcement;
          })
        );
      } else {
        showToast("Error loading posts", "error");
      }
    } catch (err) {
      showToast("Error loading posts", "error");
    }
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  // Toggle the visibility of other images for the specific post
  const toggleOtherImages = (postId) => {
    if (currentPostImages.length === 0 || currentPostImages !== postId) {
      setCurrentPostImages(postId);
    }
    setShowOtherImages((prev) => !prev);
  };

  return (
    <div className="view-all-page container">
      {/* Banner Section */}
      <div className="banner-img my-4">
        <div className="text-center">
          <img src={bannerImg} alt={title} className="img-fluid rounded shadow" />
        </div>
      </div>

      {/* Post List */}
      {posts.length === 0 && !loading && <p className="text-center">No posts available</p>}
      {posts.length > 0 && (
        <div className="row">
          {posts.map((post) => (
            <div key={post._id} className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow-lg border-light rounded">
                <div className="card-body d-flex flex-column">
                  {/* Left-aligned Post Content */}
                  <div className="post-content mb-3">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">
                      <strong>{post?.AwardierName} {post?.PersonDesignation}</strong>
                    </p>
                    <div className="card-text fs-6">
                      <PostCard post={post.description} size={270} />
                    </div>
                  </div>

                  {/* Right-aligned Main Image */}
                  {post.imagePath?.length > 0 && (
                    <div className="main-image-container text-center">
                      <img
                        src={`${ConnectMe.img_URL}${post.imagePath[0]}`}
                        alt="Main Post Image"
                        className="img-fluid rounded shadow-sm"
                        style={{
                          cursor: "pointer",
                          maxWidth: "350px",
                          objectFit: "contain", // Ensures the image fits within the container without distortion
                        }}
                        onClick={() => setSelectedImage(`${ConnectMe.img_URL}${post.imagePath[0]}`)}
                      />
                    </div>
                  )}
                </div>

                {/* Thumbnail Images Section */}
                {post.imagePath?.length > 1 && (
                  <div className="mt-3">
                    <button onClick={() => toggleOtherImages(post._id)} className="btn btn-outline-primary btn-sm">
                      {showOtherImages && currentPostImages === post._id
                        ? "Hide other images"
                        : `Show ${post.imagePath.length - 1} more images`}
                    </button>

                    {showOtherImages && currentPostImages === post._id && (
                      <div className="row mt-3">
                        {post.imagePath.slice(1).map((image, index) => (
                          <div key={index} className="col-4 col-md-2 mb-3" >
                            <img
                              src={`${ConnectMe.img_URL}${image}`}
                              alt={`thumbnail-${index}`}
                              className="img-thumbnail shadow-sm"
                              style={{
                                cursor: "pointer",
                                objectFit: "contain", // Ensure thumbnail images also scale well
                              }}
                              onClick={() => setSelectedImage(`${ConnectMe.img_URL}${image}`)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && <Loader />}

      {/* Image Preview (Lightbox Effect) */}
      {selectedImage && (
        <div className="image-preview-overlay" onClick={handleClosePreview}>
          <div className="text-center">
            <img
              src={selectedImage}
              alt="Full View"
              className="img-fluid rounded"
              style={{
                objectFit: "contain", // Ensure full image fits within the preview window
                maxHeight: "90vh", // Limit height to ensure it doesn't overflow
              }}
            />
            <button className="close-preview btn btn-danger" onClick={handleClosePreview}>X</button>
          </div>
        </div>
      )}
    </div>
  );
}
