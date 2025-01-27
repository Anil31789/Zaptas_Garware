import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ViewAllPopup.css";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";
import PostCard from "./postDisplay";
import Loader from "../Loader";
import { FaThumbsUp } from "react-icons/fa";

export default function ViewAllPage() {
  const { state } = useLocation();
  const { title, type = "announcement", bannerImg } = state;
  const [selectedImage, setSelectedImage] = useState(null); // For full-size image preview

  const [posts, setPosts] = useState([]); // All fetched posts
  const [loading, setLoading] = useState(false); // Loading state
  const startRef = useRef(1); // Ref for pagination
  const hasMore = useRef(true); // Ref to track if there are more posts

  const fetchAnnouncements = async (limit = 9) => {
    if (!hasMore.current || loading) return; // Exit if no more posts or already loading

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
        setPosts((prev) => [...prev, ...response.data.announcements]); // Append new posts
        startRef.current += 1; // Increment the page for the next fetch
      } else {
        hasMore.current = false; // No more posts available
        if (response.data.announcements.length === 0) {
          showToast("No more posts available", "info");
        }
      }
    } catch (error) {
      hasMore.current = false; // Stop further API calls on error
      showToast("Error loading posts", "error");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Debounce Function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    // Create a debounced version of the fetchAnnouncements function
    const debouncedFetch = debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        fetchAnnouncements(); // Fetch posts when scrolling to the bottom
      }
    }, 300); // Debounce delay of 300ms

    window.addEventListener("scroll", debouncedFetch);
    return () => window.removeEventListener("scroll", debouncedFetch); // Cleanup on unmount
  }, [fetchAnnouncements]); // Dependency to ensure the function is re-created if fetchAnnouncements changes

  // Initial fetch when the page loads
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleLikedisslike = async (announcementId, isLiked) => {
    showToast(isLiked ? "Unlike success" : "Like success", "success");
    const token = getTokenFromLocalStorage();
    const url = `${ConnectMe.BASE_URL}/${type}/${announcementId}/${
      isLiked ? "unlike" : "like"
    }`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await apiCall("POST", url, headers);
      if (response.success) {
        // Update the local state to reflect the like/unlike action
        setPosts((prevAnnouncements) =>
          prevAnnouncements.map((announcement) => {
            if (announcement._id === announcementId) {
              // Update the likes array and the likesCount locally
              const updatedLikes = isLiked
                ? announcement.likes.filter(
                    (userId) => userId !== response.userId
                  )
                : [...announcement.likes, response.userId];

              return {
                ...announcement,
                likes: updatedLikes,
                likesCount: updatedLikes.length, // Update the likes count directly
                likedByUser: !isLiked, // Toggle the likedByUser state
              };
            }
            return announcement; // Return the unchanged announcement if not matching
          })
        );
      } else {
        showToast("Error loading posts", "error");
        fetchAnnouncements();
      }
    } catch (err) {
      showToast("Error loading posts", "error");
      fetchAnnouncements();
    }
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  return (
    <div className="view-all-page">
      {/* <header className="page-header"><h1>{title}</h1></header> */}
      <div className="banner-img ">
        <div className="bodx-img">
          <img src={bannerImg} alt={title} width={"100%"} />
          {/* </div>
        <div className="box-img">
          <img
            className="img2"
            src={`${ConnectMe.img_URL}${posts[0]?.imagePath[0]}`}
            alt={title}
            width={"100%"}
          />
        </div> */}
        </div>
      </div>
      {posts.length === 0 && !loading && <p>No posts available</p>}
      {posts.length > 0 && (
        <div className="container-fluid">
          <div className="row">
            {posts.map((post) => (
              <React.Fragment key={post._id}>
                <div className="col-md-9 mt-2">
                  <div className="content-box">
                    <h5>{post.title}</h5>
                    <span>
                      {post?.AwardierName} {post?.PersonDesignation}
                    </span>
                    <div className="card-text fs-6">
                      <PostCard post={post.description} size={270} />
                    </div>
                    <div className="additional-info mt-1">
                      {post.links[0]?.link && (
                        <a
                          href={post.links[0]?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Link: {post.links[0]?.link}
                        </a>
                      )}
                      <br />
                      {/* <span>Location: {post.location}</span> &nbsp; */}
                      <span>
                        Date:{" "}
                        {new Date(post.AnnouncementDate).toLocaleDateString()}
                      </span>
                    </div>
                    {/* <p
                      className="like-section"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering `handleShow`
                        handleLikedisslike(post._id, post.likedByUser);
                      }}
                    >
                      <FaThumbsUp
                        style={{
                          color: post.likedByUser ? "blue" : "gray",
                          cursor: "pointer",
                        }}
                      />{" "}
                      {post?.likes?.length}
                    </p> */}
                  </div>
                </div>

                {/* Bootstrap Carousel for Image Slider (4 photos per slide) */}
                {post.imagePath?.length > 0 ? (
                  <div className="col-md-3 mt-2">
                    <div
                      id={`carousel-${post._id}`}
                      className="carousel slide"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-inner">
                        {post.imagePath
                          .reduce((acc, img, index) => {
                            if (index % 1 === 0) acc.push([]); // Create a new slide every 4 images
                            acc[acc.length - 1].push(img); // Push the image to the current slide
                            return acc;
                          }, [])
                          .map((slide, index) => (
                            <div
                              key={index}
                              className={`carousel-item view-all-images ${
                                index === 0 ? "active" : ""
                              }`}
                            >
                              <div className="row">
                                {slide.map((image, imgIndex) => (
                                  <div key={imgIndex} className="col-md-12">
                                    <img
                                      src={`${ConnectMe.img_URL}${image}`}
                                      alt={`slide-${imgIndex}`}
                                      className="d-block w-100 slider-image"
                                      onClick={() =>
                                        setSelectedImage(
                                          `${ConnectMe.img_URL}${image}`
                                        )
                                      } // Set the selected image for preview
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                      {/* Carousel Controls */}
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target={`#carousel-${post._id}`}
                        data-bs-slide="prev"
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target={`#carousel-${post._id}`}
                        data-bs-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </div>
                  </div>
                ) : []}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      {loading && <Loader />} {/* Show loader when fetching data */}
      {selectedImage && (
        <div className="image-preview-overlay" onClick={handleClosePreview}>
          <img
            src={selectedImage}
            alt="Full View"
            className="full-size-image"
          />
        </div>
      )}
    </div>
  );
}
