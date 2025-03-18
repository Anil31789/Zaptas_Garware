import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import showToast from "../utils/toastHelper";
import ConnectMe from "../config/connect";
import { addTokenToLocalStorage, apiCall, getTokenFromLocalStorage } from "../utils/apiCall";
import { useNavigate } from "react-router-dom";

import { motion } from 'framer-motion';


const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [passwordOrOtp, setPasswordOrOtp] = useState("");
  const [isOtpLogin, setIsOtpLogin] = useState(false); // Toggle between password and OTP login
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();




  // useEffect(() => {
  //   AutoLogin()

  // }, [])


  const AutoLogin = async () => {

    const token = getTokenFromLocalStorage(); // Retrieve token from localStorage

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await apiCall("GET", `${ConnectMe.BASE_URL}/sso/verifyToken`, headers, null,  2000, false)

    if (response.success) {
      // Show a success message
      showToast("Login successful!", "success");
      navigate("/");
    } else {
      // Show an error message if login fails
      showToast(response.message || "Login failed. Please try again.", "error");
    }

  }




  const handleSendOtp = async () => {
    if (!emailOrPhone) {
      showToast("Please enter your email address.", "error");
      return;
    }
    setLoading(true);
    try {
      const url = `${ConnectMe.BASE_URL}/sso/sendOtp`;
      const payload = { email: emailOrPhone };
      const headers = { "Content-Type": "application/json" };
      const response = await apiCall("POST", url, headers, payload,  2000, false);

      if (response.success) {
        showToast("OTP sent to your email.", "success");
        setOtpSent(true);
      } else {
        showToast(response.message || "Failed to send OTP.", "error");
      }
    } catch (error) {
      showToast(`Error sending OTP: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!emailOrPhone || !passwordOrOtp) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    setLoading(true);
    try {
      const url = `${ConnectMe.BASE_URL}/sso/login`;
      const payload = isOtpLogin
        ? { email: emailOrPhone, otp: passwordOrOtp }
        : { email: emailOrPhone, password: passwordOrOtp };
      const headers = { "Content-Type": "application/json" };
      const response = await apiCall("POST", url, headers, payload,  2000, false);

      if (response.success) {
        localStorage.removeItem("userDetails");
        localStorage.setItem("userDetails", JSON.stringify(response?.data?.user));
        addTokenToLocalStorage(response?.data?.token);
        showToast("Login successful!", "success");
        navigate("/"); // Redirect to home
      } else {
        showToast(response.message || "Login failed. Please try again.", "error");
      }
    } catch (error) {
      showToast(`Error during login: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <motion.div
            className="p-4 shadow rounded bg-white text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src='./logo.PNG' alt="Garware Hi-Tech Films Logo" className="mb-3" width="150" />
            <h3 className="text-center mb-4 text-primary">Garware Hi-Tech Films Intranet Login</h3>
            <p className="text-muted">A secure gateway to company resources and collaboration.</p>

            <Form>
              {/* Email Input */}
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>
                  <FaEnvelope /> Username
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Domain Username"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                />
              </Form.Group>

              {/* OTP or Password Input */}
              <Form.Group className="mb-3" controlId="formPasswordOrOtp">
                <Form.Label>
                  {isOtpLogin ? <FaKey /> : <FaLock />} {isOtpLogin ? "OTP" : "Password"}
                </Form.Label>
                <Form.Control
                  type={isOtpLogin ? "text" : "password"}
                  placeholder={"Domain Password"}
                  value={passwordOrOtp}
                  onChange={(e) => setPasswordOrOtp(e.target.value)}
                  onKeyDown={handleKeyDown}
                  required
                />
              </Form.Group>

              {/* Send OTP Button */}
              {isOtpLogin && (
                <Button
                  variant="primary"
                  onClick={handleSendOtp}
                  disabled={loading || otpSent}
                  className="w-100 mb-3"
                >
                  {loading && otpSent ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              )}

              {/* Login Button */}
              <Button
                variant="success"
                onClick={handleLogin}
                disabled={loading}
                className="w-100"
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Login"
                )}
              </Button>

              {/* OTP Sent Alert */}
              {otpSent && (
                <Alert variant="info" className="mt-3">
                  OTP has been sent to your email. Please check your inbox.
                </Alert>
              )}
            </Form>
          </motion.div>
        </Col>
      </Row>

      {/* Intranet Benefits Section */}
      <Row className="justify-content-center mt-4">
        <Col md={8} className="text-center">
          <motion.div
            className="p-4 shadow rounded bg-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-primary">How the Intranet Benefits Garware Employees</h4>
            <p className="text-muted">The intranet at Garware Hi-Tech Films serves as a central hub for employees, providing seamless communication, collaboration, and access to essential resources. Benefits include:</p>
            <ul className="list-unstyled text-start">
              <li>🔹 Quick access to company news, announcements, and events</li>
              <li>🔹 Employee directory for easy communication</li>
              <li>🔹 Secure document sharing and storage</li>
              <li>🔹 Self-service portals for HR and IT requests</li>
              <li>🔹 Enhanced teamwork through collaboration tools</li>
              <li>🔹 Improved productivity with a centralized knowledge base</li>
            </ul>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
