import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import PostCard from "./postDisplay";

const SendEmailPopup = ({ show, handleClose, personalName, recipient,type }) => {


    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 10;

    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        // Check if 'userDetails' is available in localStorage
        const storedUserDetails = localStorage.getItem("userDetails");

        // If found, set it in the state
        if (storedUserDetails) {
            setUserDetails(JSON.parse(storedUserDetails));
        }

        // Optionally, if the data needs to be reloaded, you can clear localStorage
        // and set new data if needed.
    }, []);
    const observer = useRef();

    useEffect(() => {
        const fetchInitialComments = async () => {
            setPage(1); // Reset to page 1 on component mount
            setComments([]); // Clear existing comments
            setHasMore(true);
            await fetchComments(1);
        };
        fetchInitialComments();
    }, []);

    const fetchComments = async (pageNumber) => {
        if (!hasMore || loading) return;
        setLoading(true);
        setError("");

        try {
            const url = `${ConnectMe.BASE_URL}/comment/bday/comment?employeeCode=${recipient?.EmployeeCode || recipient?.employeeCode}&page=${pageNumber}&limit=${limit}&type=${type}`;
            const token = getTokenFromLocalStorage();
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const response = await apiCall("GET", url, headers, [], 2000, false);
            if (response.success && response.data.comments.length > 0) {
                setComments((prev) => [...prev, ...response.data.comments]);
                if (response.data.comments.length < limit) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError("Failed to fetch comments. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim() === "") return;

        setLoading(true);
        setError("");
        try {
            const url = `${ConnectMe.BASE_URL}/comment/bday/comment?type=${type}`;
            const token = getTokenFromLocalStorage();
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };
            const data = {
                employeeCode: recipient?.EmployeeCode || recipient?.employeeCode,
                comment: newComment,
            };

            const response = await apiCall("POST", url, headers, data);
            if (response.success) {
                const addedComment = {
                    comment: newComment,
                    createdDate: new Date().toISOString(),
                    user: {
                        name: userDetails?.name || "Anonymous",
                        designation: userDetails?.jobTitle || "Employee",
                        images: {
                            imagePath: userDetails?.images?.imagePath
                                ? `${ConnectMe.img_URL}${userDetails?.images?.imagePath}`
                                : "./user.png",
                        },
                    },
                };

                setComments((prev) => [addedComment, ...prev]); // Add the new comment at the top
                setNewComment(""); // Clear the input
            } else {
                setError("Failed to post the comment. Please try again.");
            }
        } catch (err) {
            setError("Error posting comment. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    const lastCommentRef = (node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    };

    useEffect(() => {
        if (page > 1) fetchComments(page);
    }, [page]);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Comments for <strong>{personalName}</strong>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                {error && <p className="text-danger">{error}</p>}
                <div className="comments-sec">
                    <div className="comments-list">
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div
                                    key={index}
                                    className="comment-item d-flex align-items-start mb-3 p-3 rounded"
                                    style={{
                                        backgroundColor: "#f8f9fa",
                                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                    }}
                                    ref={index === comments.length - 1 ? lastCommentRef : null}
                                >
                                    <img
                                        src={comment?.user?.images?.imagePath || "https://placehold.co/50"}
                                        alt={comment?.user?.name || "User"}
                                        className="rounded-circle me-3"
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{comment?.user?.name || "Anonymous"}</strong>
                                                <br />
                                                <small className="text-muted">{comment?.user?.designation || "Employee"}</small>
                                            </div>
                                            <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                                                {formatTimeAgo(comment?.createdDate)}
                                            </span>
                                        </div>
                                        <p className="mb-1" style={{ color: "#333" }}>
                                        <PostCard post= {comment?.comment} size={60} />
                                           
                                        </p>

                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No comments yet.</p>
                        )}
                        {loading && (
                            <div className="text-center my-3">
                                <Spinner animation="border" size="sm" />
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer
                style={{
                    position: "sticky",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#fff",
                    padding: "10px 15px",
                    boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Form className="d-flex align-items-center w-100">
                    <img
                        src={userDetails?.images?.imagePath ? `${ConnectMe.img_URL}${userDetails?.images?.imagePath}` : "./user.png"}
                        alt={userDetails?.name}
                        className="rounded-circle me-2"
                        style={{ width: "40px", height: "40px" }}
                    />
                    <Form.Control
                        as="textarea"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="me-2"
                        style={{
                            borderRadius: "20px",
                            paddingLeft: "15px",
                            minHeight: "40px", // Adjusted height to be closer to the input field size
                            resize: "none", // Disables resizing of the textarea
                            height: "auto", // Allows the textarea to grow as the user types
                        }}
                    />


                    <Button
                        variant="primary"
                        onClick={handleAddComment}
                        style={{ borderRadius: "20px" }}
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : "Post"}
                    </Button>
                </Form>
            </Modal.Footer>
        </Modal>
    );
};

export default SendEmailPopup;
