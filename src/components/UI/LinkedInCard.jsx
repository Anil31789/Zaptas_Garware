import { useEffect, useState, useMemo, useRef } from "react";
import {
  FaLinkedin,
  FaPaperPlane,
  FaRegCommentDots,
  FaThumbsUp,
} from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader"; // Loader library
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import showToast from "../../utils/toastHelper";
import { Carousel } from "react-bootstrap"; // Import Carousel
import "./LinkedInCard.css";
import PostCard from "./postDisplay";
import { useNavigate } from "react-router-dom";

export default function LinkedInCard() {
  const [loadingPostIds, setLoadingPostIds] = useState([]); // Track which posts are being liked/unliked
  const [posts, setPosts] = useState([]);
  const [loggin, setLoggin] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([
    "Great announcement!",
    "Looking forward to this.",
    "Congratulations!",
  ]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loginRequired, setloginRequired] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const currentRequest = useRef(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true); // Show loader
    try {
      const url = `${ConnectMe.BASE_URL}/fetchOrgPosts?start=0&count=5&show=posts,multimedia,likeStatus,text,likeCount,id`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);

      if (response.success) {
        setPosts(response?.data?.posts);
        setloginRequired(response?.data?.requiredLogin);
      } else {
        if (!response.success && response.errorMessage === "loginRequired") {
          setLoggin(true);
          showToast("You need to log in first", "success");
          return;
        }
        showToast("Failed to load posts", "error");
      }
    } catch (error) {
      showToast("Failed to load posts", "error");
      console.error("Error fetching posts:", error.message);
      setPosts([]);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLikeToggle = async (postId, method, name = null) => {
    try {
      if (loginRequired) {
        showToast("Need To Login First", "error");
        return;
      }
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

      if (name == "modelBox") {
        setSelectedPost((prevPost) => {
          if (!prevPost) return prevPost; // Ensure prevPost exists

          // Update the single post object
          return {
            ...prevPost,
            fetchUserLikesStatus: method === "likepost" ? true : false,
            likeCount: {
              totalLikes:
                method === "likepost"
                  ? prevPost.likeCount.totalLikes + 1
                  : method === "disslike"
                    ? prevPost.likeCount.totalLikes - 1
                    : prevPost.likeCount.totalLikes,
            },
          };
        });
      } else {
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
      }

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

  const openPostPopup = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const closePostPopup = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  const addComment = () => {
    if (newComment.trim()) {
      setComments((prevComments) => [...prevComments, newComment]);
      setNewComment("");
    }
  };

  const memoizedPosts = useMemo(() => posts, [posts]);

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaLinkedin className="me-2" />
          <h5 className="mb-0">LinkedIn</h5>
        </div>
        <a
          onClick={() => {
            navigate("/view-all");
          }}
          className="text-decoration-none"
        >
          View All <HiArrowCircleRight />
        </a>
      </div>

      {loading ? (
        <div className="text-center my-4">
          <ClipLoader color="#0073b1" size={50} />
        </div>
      ) : loggin ? (
        <button onClick={handleLinkedInCallback}>Login with LinkedIn</button>
      ) : (
        <div className="card-body card-scroll">
          {/* Carousel for Posts */}
          <Carousel>
            {memoizedPosts.map((post) => (
              <Carousel.Item key={post.id} className="linkekItem">
                <div
                  className="row mb-3"
                  style={{
                    height: "100%", // Full height for the card
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between", // Push the footer to the bottom
                  }}
                >
                  {/* Scrollable Content Section */}
                  <div
                    className="post-content"
                    style={{
                      flex: 1, // Fills available space
                      overflowY: "auto", // Enables vertical scrolling when content overflows
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                    }}
                  >
                    {/* Media Section */}
                    <div
                      className="csr-media col-sm-12 text-center"
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "250px", // Fixed height for media
                        overflow: "hidden", // Crop any extra space
                      }}
                      onClick={() => openPostPopup(post)}
                    >
                      {post.multimedia.type === "images" ? (
                        <img
                          src={post.multimedia.url}
                          alt="LinkedIn Post"
                          style={{
                            width: "100%",
                            height: "100%",
                            // objectFit: "cover", // Ensures the image fills the container
                          }}
                        />
                      ) :
                        <video
                          controls
                          autoPlay
                          muted
                          loop
                          style={{
                            width: "100%",
                            height: "100%",
                            // objectFit: "cover", // Ensures the video fills the container
                          }}
                        >
                          <source src={post.multimedia.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      }
                    </div>

                    {/* Post Text Section */}
                    <div className="announcement-disc col-sm-12 mt-2">
                      <div className="card-text fs-6">
                        <PostCard post={post.text} size={280} />
                      </div>
                    </div>
                  </div>

                  {/* Footer Section with Fixed Like Button */}
                  <div className="like-section">
                    <div className="d-flex  align-items-center my-3">
                      {loginRequired ? (
                        // If loginRequired, show "Login with LinkedIn" button
                        <button
                          onClick={handleLinkedInCallback}
                          className="btn btn-primary btn-lg"
                          style={{
                            display: "flex",
                            alignItems: "center",

                            padding: "10px 20px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            borderRadius: "5px",
                          }}
                        >
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                            alt="LinkedIn"
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                            }}
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

                            cursor: "pointer",
                          }}
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent other interactions
                            handleLikeToggle(
                              post.id,
                              post?.fetchUserLikesStatus
                                ? "disslike"
                                : "likepost"
                            );
                          }}
                        >
                          <FaThumbsUp
                            className={`like-icon ${loadingPostIds.includes(post.id) ? "loading" : ""
                              }`}
                            style={{
                              color: post?.fetchUserLikesStatus
                                ? "blue"
                                : "gray",
                            }}
                          />
                          <span style={{ marginLeft: "5px" }}>
                            {post?.likeCount?.totalLikes}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}

      {/* Modal for LinkedIn Post */}
      <Modal show={showModal} onHide={closePostPopup} size="lg" centered>
        {/* Modal Header */}
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">
            <PostCard post={selectedPost?.text} size={600} />
          </Modal.Title>
        </Modal.Header>

        {/* Modal Body */}
        <Modal.Body className="p-4">
          {/* Multimedia Content */}
          <div
            className="d-flex justify-content-center align-items-center mb-4"
            style={{ width: "100%" }}
          >
            {selectedPost?.multimedia?.type === "image" ? (
              <img
                src={selectedPost.multimedia.url}
                alt="LinkedIn Post"
                className="img-fluid rounded"
                style={{ maxHeight: "400px" }}
              />
            ) : selectedPost?.multimedia?.type === "video" ? (
              <video
                controls
                autoPlay
                muted
                loop
                className="rounded"
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  // objectFit: "cover",
                }}
              >
                <source src={selectedPost.multimedia.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p className="text-muted">
                No multimedia available for this post.
              </p>
            )}
          </div>

          {/* Like and Comment Section */}
          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            {/* Like Button */}
            <div className="d-flex align-items-center justify-content-center my-3">
              {loginRequired ? (
                // If login is required, display the LinkedIn login button
                <button
                  onClick={handleLinkedInCallback}
                  className="btn btn-primary btn-lg d-flex align-items-center"
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    display: "flex",
                  }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                    alt="LinkedIn"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "10px",
                    }}
                  />
                  Login with LinkedIn
                </button>
              ) : (
                // If logged in, display the like button
                <div className="d-flex align-items-center">
                  <FaThumbsUp
                    className={`like-icon fs-5 ${loadingPostIds.includes(selectedPost?.id) ? "loading" : ""
                      }`}
                    style={{
                      color: selectedPost?.fetchUserLikesStatus
                        ? "blue"
                        : "gray",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleLikeToggle(
                        selectedPost.id,
                        selectedPost?.fetchUserLikesStatus
                          ? "disslike"
                          : "likepost",
                        "modelBox"
                      )
                    }
                  />
                  <span className="ms-2 text-secondary">
                    {selectedPost?.likeCount?.totalLikes || 0} Likes
                  </span>
                </div>
              )}
            </div>

            {/* Comment Section */}
            {/* <div
            className="d-flex align-items-center text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => setShowComments(!showComments)}
          >
            <FaRegCommentDots className="fs-5" />
            <span className="ms-2">1 comment</span>
          </div> */}
          </div>

          {/* Comments Section */}
          {/* {showComments && (
          <div className="mt-3">
            {comments.map((comment, index) => (
              <div key={index} className="border rounded p-2 mb-2">
                <p className="mb-1">{comment}</p>
              </div>
            ))}
          </div>
        )} */}
        </Modal.Body>

        {/* Add Comment Box */}
        <Modal.Footer>
          {/* <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Write a comment..."
          />
          <button className="btn btn-primary">
            <FaPaperPlane />
          </button>
        </div> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
