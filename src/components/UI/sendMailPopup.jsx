import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";

const SendEmailPopup = ({ show, handleClose, recipient, personalName }) => {
    const [emailContent, setEmailContent] = useState({
        subject: "",
        message: "",
    });

    const [userDetails, setUserDetails] = useState(null);

    // Function to capitalize the first letter of each sentence or word where necessary
    const capitalize = (text) => {
        if (!text) return "";
        return text
            .split("\n")
            .map((sentence) =>
                sentence
                    .trim()
                    .replace(/^(\w)(.*)/, (_, firstLetter, rest) => firstLetter.toUpperCase() + rest)
            )
            .join("\n");
    };

    // Function to get the full name of the user
    const getFullName = () => {
        const firstName = userDetails?.firstName || "";
        const middleName = userDetails?.middleName || "";
        const lastName = userDetails?.lastName || "";

        return [firstName, middleName, lastName].filter(Boolean).join(" ") || "[Your Name]";
    };

    const predefinedTemplates = {
        birthday: {
            subject: "Happy Birthday Wishes!",
            message: `Dear ${personalName},\n\nWishing you a wonderful birthday filled with joy and success. Have an amazing day!\n\nBest regards,\n${getFullName()}`,
        },
        workAnniversary: {
            subject: "Congratulations on Your Work Anniversary!",
            message: `Dear ${personalName},\n\nCongratulations on your work anniversary! Your dedication and contributions are truly appreciated. Here's to many more successful years!\n\nBest regards,\n${getFullName()}`,
        },
        joiningDay: {
            subject: "Happy Joining Day!",
            message: `Dear ${personalName},\n\nHappy Joining Day! Thank you for being such a valuable part of our team. Looking forward to many more years of success together.\n\nBest regards,\n${getFullName()}`,
        },
        awards: {
            subject: "Congratulations on Your Achievement!",
            message: `Dear ${personalName},\n\nCongratulations on receiving this well-deserved award! Your hard work and achievements inspire us all. Keep shining!\n\nBest regards,\n${getFullName()}`,
        },
    };

    const handleSelectTemplate = (templateKey) => {
        const template = predefinedTemplates[templateKey];
        setEmailContent({
            subject: template.subject,
            message: capitalize(template.message),
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailContent((prevContent) => ({
            ...prevContent,
            [name]: name === "message" ? capitalize(value) : value,
        }));
    };

    const handleSendEmail = async () => {
        const { subject, message } = emailContent;
    
        // Construct the email body
        const emailData = {
            to: recipient, // The recipient email
            subject: subject, // The subject from the form
            message: message, // The message from the form
            // userEmail: userDetails?.email, // User's email (optional, depending on backend logic)
        };
    
        // Call the API to send the email

         const token = getTokenFromLocalStorage(); // Assuming the token is stored in localStorage
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const response = await apiCall(
            "POST",
            `${ConnectMe.BASE_URL}/it/api/send-email`, 
            headers,
            emailData
        );
    
        // Check response status
        if (response?.status) {
            console.log("Email sent successfully!");
        } else {
            console.error("Failed to send email:", response?.message || "Unknown error");
        }
        // Close the modal after sending the email
        handleClose();
    };
    

    useEffect(() => {
        if (!show) {
            setEmailContent({ subject: "", message: "" });
        }

        const storedUserDetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(storedUserDetails);
    }, [show]);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Send an Email or Wish</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Recipient */}
                    <Form.Group className="mb-3">
                        <Form.Label>To</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Recipient's email"
                            value={recipient || ""}
                            disabled
                            className="bg-light"
                            
                        />
                    </Form.Group>

                    {/* Subject */}
                    <Form.Group className="mb-3">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter email subject"
                            name="subject"
                            value={emailContent.subject}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Message */}
                    <Form.Group className="mb-3">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Write your message or wish here..."
                            name="message"
                            value={emailContent.message}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Predefined Templates */}
                    <div className="mb-3">
                        <Form.Label>Choose a Template</Form.Label>
                        <div className="d-flex flex-wrap gap-2">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleSelectTemplate("birthday")}
                            >
                                Birthday Wish
                            </Button>
                            <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleSelectTemplate("workAnniversary")}
                            >
                                Work Anniversary
                            </Button>
                            <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => handleSelectTemplate("joiningDay")}
                            >
                                Joining Day
                            </Button>
                            <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => handleSelectTemplate("awards")}
                            >
                                Awards
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSendEmail}
                    className="d-flex align-items-center"
                >
                    <FaPaperPlane className="me-2" />
                    Send
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SendEmailPopup;
