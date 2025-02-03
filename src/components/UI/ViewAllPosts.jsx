import React, { useEffect, useRef, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";
import ConnectMe from "../../config/connect";
import PostCard from "./postDisplay";
import "./viewPosts.css";
import Loader from "../Loader";
export default function ViewAllPosts() {
  const [posts, setPosts] = useState([]); // All fetched posts
  const [loading, setLoading] = useState(false); // Loading state for the entire list
  const [hasMore, setHasMore] = useState(true); // Check if more posts are available
  const [count, setCount] = useState(6); // Number of posts to fetch per API call
  const [loadingPostIds, setLoadingPostIds] = useState([]); // Track which posts are being liked/unliked
  const currentRequest = useRef(null);
  const [loginRequired, setloginRequired] = useState(false)
  const startRef = useRef(0); // Ref for start index

  // Function to fetch posts
  const fetchPosts = async () => {
    if (!hasMore || loading) return; // Prevent multiple fetches if already loading or no more posts

    setLoading(true); // Set loading state before making the API call

    try {
      const url = `${ConnectMe.BASE_URL}/fetchOrgPosts?start=${startRef.current}&count=${count}&show=posts,multimedia,likeStatus,text,likeCount,id`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);

      if (response.success && response.data.posts.length > 0) {
        setloginRequired(response?.data?.requiredLogin)
        setPosts((prev) => [...prev, ...response.data.posts]); // Append new posts to the existing list
        startRef.current += response.data.posts.length; // Update startRef based on the number of posts received
      } else {
        setHasMore(false); // No more posts to fetch
      }
    } catch (error) {
      showToast("Error loading posts", "error");
    } finally {
      setLoading(false); // Set loading to false after fetching posts
    }
  };

  // Infinite Scroll: Detect when the user reaches the bottom
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      fetchPosts(); // Fetch posts when the user reaches the bottom
    }
  };

  // Initial fetch and scroll listener
  useEffect(() => {
    fetchPosts(); // Fetch the first set of posts
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup scroll listener
  }, []); // Empty dependency array ensures this runs only once on component mount

  const handleLikeToggle = async (postId, method) => {
    try {
      setLoadingPostIds((prevIds) => [...prevIds, postId]); // Add post ID to loading state

      // Cancel the previous request if it's ongoing
      if (currentRequest.current) {
        currentRequest.current.abort();
      }

      // Create a new AbortController for each request
      const controller = new AbortController();
      const signal = controller.signal;

      // Store the controller in the ref to cancel it on future requests
      currentRequest.current = controller;

      // Update the like status locally before making the API call
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              fetchUserLikesStatus: method === "likepost" ? true : false,
              likeCount: {
                totalLikes:
                  method === "likepost"
                    ? post.likeCount.totalLikes + 1
                    : method === "disslike"
                      ? post.likeCount.totalLikes - 1
                      : post.likeCount.totalLikes,
              },
            }
            : post
        )
      );

      const token = getTokenFromLocalStorage();
      const url = `${ConnectMe.BASE_URL}/${method}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const body = JSON.stringify({ postId });

      // Make the API call with the AbortController signal
      await apiCall("POST", url, headers, body, { signal });
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Previous request was cancelled.");
      } else {
        console.error("Error liking/unliking post:", error.message);
      }
    } finally {
      setLoadingPostIds((prevIds) => prevIds.filter((id) => id !== postId)); // Remove post ID from loading state
    }
  };


  const handleLinkedInCallback = async () => {
    try {
      const url = `${ConnectMe.BASE_URL}/auth/linkedin`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);

      if (response.success) {
        showToast("Login Success", "success");
        const authUrl = `${response.data}`;
        window.open(authUrl, "_blank");
      } else {
        showToast("Login Failed", "error");
        console.error("LinkedIn login failed:", response.message);
      }
    } catch (error) {
      showToast("Login Failed", "error");
      console.error("Error during LinkedIn login:", error.message);
    }
  };

  return (
    <div className="container mt-3">
      {posts.map((post, index) => (
        <div key={index} className="card viewall-card mb-2">
          <div className="update-container">
            <a href="" className="update-image">
              <img width="48" src="./logo.png" />
            </a>
            <a href="" className="update-title">
              <span>GHFL [Garware Hi-Tech Films Limited]</span>
            </a>
          </div>
          <PostCard post={post.text} size={180} />
          <div className="card-bodyl mt-1">
            {post.multimedia && (
              <div
                className="csr-media col-sm-12 text-center"
                style={{ cursor: "pointer" }}
              >
                {post.multimedia.type === "image" ? (
                  <img
                    src={post.multimedia.url}
                    alt="LinkedIn Post"
                    style={{ width: "100%", height: "70%" }}
                  />
                ) : (
                  <video width="100%" height="70%" controls autoPlay muted loop>
                    <source src={post.multimedia.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
            <div className="d-flex justify-content-center align-items-center my-3">
              {loginRequired ? (
                // If loginRequired, show "Login with LinkedIn" button
                <button
                  onClick={handleLinkedInCallback}
                  className="btn btn-primary btn-lg"
                  style={{
                    display: "flex",
                    alignItems: "left",
                    justifyContent: "left",
                    padding: "10px 20px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: "5px",
                  }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                    alt="LinkedIn"
                    style={{ width: "20px", height: "20px", marginRight: "10px" }}
                  />
                  Login with LinkedIn
                </button>
              ) : (
                // If logged in, show like button
                <p
                  className="card-like fs-6 m-0"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    
                  }}
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent other interactions
                    handleLikeToggle(
                      post.id,
                      post?.fetchUserLikesStatus ? "disslike" : "likepost"
                    );
                  }}
                >
                  <FaThumbsUp
                    className={`like-icon ${loadingPostIds.includes(post.id) ? "loading" : ""}`}
                    style={{
                      color: post?.fetchUserLikesStatus ? "blue" : "gray",
                    }}
                  />
                  <span style={{ marginLeft: "5px" }}>{post?.likeCount?.totalLikes}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      {loading && <Loader />}
      {!hasMore && <p>No more posts</p>}
    </div>
  );
}
