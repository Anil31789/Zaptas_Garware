import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Spinner, Card, InputGroup } from "react-bootstrap";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import { useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa"; // Bootstrap Icons
import showToast from "../../utils/toastHelper";

const ITServiceRequestForm = () => {
  const location = useLocation();
  const { id } = location.state || {}; // Access the passed _id

  const [formData, setFormData] = useState({
    typeOfService: id || "",
    fieldsData: {}, // Dynamically populated fields based on service type
  });

  const [serviceTypes, setServiceTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch service types on component mount
  useEffect(() => {
    const fetchServiceTypes = async () => {
      setIsLoading(true);
      try {
        const url = `${ConnectMe.BASE_URL}/it/api/service-types?show=fields`;
        const token = getTokenFromLocalStorage();
        const headers = { Authorization: `Bearer ${token}` };
        const response = await apiCall("GET", url, headers);

        if (response && response.data) {
          setServiceTypes(response.data);
        } else {
          console.error("Failed to fetch service types");
        }
      } catch (error) {
        console.error("Error fetching service types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceTypes();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target; // Use `id` instead of `name`
    setFormData((prevData) => ({
      ...prevData,
      fieldsData: {
        ...prevData.fieldsData,
        [id]: value, // Use `_id` as the key
      },
    }));
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target; // Use `id` for checkboxes
    setFormData((prevData) => ({
      ...prevData,
      fieldsData: {
        ...prevData.fieldsData,
        [id]: checked, // Track checkbox state
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = `${ConnectMe.BASE_URL}/it/api/service-requests`;
      const token = getTokenFromLocalStorage();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await apiCall("POST", url, headers, formData);

      if (response && response.success) {
        showToast("Service request submitted successfully!", "success");
        setFormData({ typeOfService: "", fieldsData: {} });
      } else {
        console.error("Failed to submit the service request:", response.message);
        showToast("Failed to submit the service request. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error submitting the service request:", error);
      showToast("An error occurred while submitting the request. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <Card className="shadow-lg border-0 p-4">
        <Card.Body>
          <h3 className="mb-4 text-center text-primary">IT Service Request Form</h3>

          <Form onSubmit={handleSubmit}>
            {/* Service Type Selection */}
            <div className="mb-4">
              <h5 className="text-secondary">Select Type of Service</h5>
              <InputGroup className="mb-3">
                <Form.Select
                  name="typeOfService"
                  id="typeOfService"
                  value={formData.typeOfService}
                  onChange={(e) => setFormData({ ...formData, typeOfService: e.target.value })}
                  disabled={isLoading}
                  className="form-select-lg"
                >
                  <option value="" disabled>
                    {isLoading ? "Loading..." : "Select a service"}
                  </option>
                  {serviceTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </Form.Select>
                <InputGroup.Text>
                  {/* <FaChevronDown /> */}
                </InputGroup.Text>
              </InputGroup>
            </div>

            {/* Dynamic Fields */}
            {serviceTypes
              .filter((type) => type._id === formData.typeOfService)
              .map((type) => (
                <div key={type._id}>
                  <h5 className="text-secondary mb-3">Fill in the Details</h5>
                  {type.fields.map((field) => (
                    <Row key={field._id} className="mb-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            {field.fieldName} {field.isRequired && <span className="text-danger">*</span>}
                          </Form.Label>

                          {/* Boolean (Checkbox) Field */}
                          {field.fieldType === "Boolean" ? (
                            <Form.Check
                              type="checkbox"
                              id={field._id}
                              checked={formData.fieldsData[field._id] || false}
                              onChange={handleCheckboxChange}
                              className="form-check-lg"
                            />
                          ) : field.fieldType === "select" || field.fieldType === "checkbox" ? (
                            // Dropdown (Select) or Multi-Select (Checkbox) Field
                            <Form.Select
                              id={field._id}
                              value={formData.fieldsData[field._id] || ""}
                              onChange={handleInputChange}
                              required={field.isRequired}
                              className="form-control-lg"
                            >
                              <option value="">Select {field.fieldName}</option>
                              {field.options.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))}
                            </Form.Select>
                          ) : (
                            // Text, Number, Email, Date Fields
                            <Form.Control
                              type={
                                field.fieldType === "text"
                                  ? "text"
                                  : field.fieldType === "number"
                                    ? "number"
                                    : field.fieldType === "email"
                                      ? "email"
                                      : "date"
                              }
                              id={field._id}
                              value={formData.fieldsData[field._id] || ""}
                              onChange={handleInputChange}
                              required={field.isRequired}
                              className="form-control-lg"
                            />
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                  ))}
                </div>
              ))}


            {/* Submit Button */}
            <div className="text-center mt-4">
              <Button variant="primary" type="submit" className="btn-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ITServiceRequestForm;
