import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import { useLocation } from "react-router-dom";

const ITServiceRequestForm = () => {
  const location = useLocation();
  const { id } = location.state || {}; // Access the passed _id
  const [formData, setFormData] = useState({

    typeOfService: id,
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
        alert("Service request submitted successfully!");
        setFormData((prevData) => ({
          ...prevData,
          typeOfService: "",
          fieldsData: {},
        }));
      } else {
        console.error("Failed to submit the service request:", response.message);
        alert("Failed to submit the service request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the service request:", error);
      alert("An error occurred while submitting the request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">IT Service Request Form</h3>

      <Form onSubmit={handleSubmit}>
        {/* Requester Details */}
        <div className="mb-4">
          {/* <h4 className="text-primary mb-3">Requester Details</h4> */}
          {/* <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Request Date</Form.Label>
                <Form.Control type="date" value={formData.requestDate} readOnly />
              </Form.Group>
            </Col>
          </Row> */}
        </div>

        {/* Service Request Details */}
        <div className="mb-4">
          <h4 className="text-primary mb-3">Service Request Details</h4>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Type of Service</Form.Label>
                <Form.Control
                  as="select"
                  name="typeOfService"
                  id={formData._id}
                  value={formData.typeOfService}
                  onChange={(e) =>
                    setFormData({ ...formData, typeOfService: e.target.value })
                  }
                  disabled={isLoading}
                >
                  <option value="" disabled>
                    {isLoading ? "Loading..." : "Select a service"}
                  </option>
                  {serviceTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>

          </Row>
        </div>

        {/* Dynamic Fields */}
        {serviceTypes
          .filter((type) => type._id === formData.typeOfService)
          .map((type) => (
            <div key={type._id}>
              {type.fields.map((field) => (
                <Row key={field._id} className="mb-3">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>{field.fieldName}</Form.Label>
                      {field.fieldType === "Boolean" ? (
                        <Form.Check
                          type="checkbox"
                          id={field._id}
                          checked={formData.fieldsData[field._id] || false}
                          onChange={handleCheckboxChange}
                        />
                      ) : (
                        <Form.Control
                          type={field.fieldType === "text" ? "text" : "date"}
                          id={field._id}
                          value={formData.fieldsData[field._id] || ""}
                          onChange={handleInputChange}
                          required={field?.isRequired}
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
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" />
                <span className="ml-2">Submitting...</span>
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ITServiceRequestForm;
