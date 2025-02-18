import React, { useState, useEffect } from 'react';
import ConnectMe from '../config/connect';
import { apiCall } from '../utils/apiCall';
import showToast from '../utils/toastHelper';
import './ServiceTypePage.css';

const ServiceTypePage = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [newServiceType, setNewServiceType] = useState({ name: '', description: '', fields: [] });
  const [newField, setNewField] = useState({ fieldName: '', fieldType: '', isRequired: false });
  const [showModal, setShowModal] = useState(false);

  const getTokenFromLocalStorage = () => localStorage.getItem('authToken');

  useEffect(() => {
    const fetchServiceTypes = async () => {
      const token = getTokenFromLocalStorage();
      const headers = { Authorization: `Bearer ${token}` };
      const response = await apiCall('GET', `${ConnectMe.BASE_URL}/it/api/service-types?show=fields`, headers);
      if (response && response.data) {
        setServiceTypes(response.data);
      } else {
        console.error('Failed to fetch service types');
        showToast('Failed to fetch service types', 'error');
      }
    };
    fetchServiceTypes();
  }, []);

  const handleAddServiceType = async () => {
    if (!newServiceType.name) {
      showToast('Please enter a service type name.', 'error');
      return;
    }

    const token = getTokenFromLocalStorage();
    const headers = { Authorization: `Bearer ${token}` };
    const response = await apiCall('POST', `${ConnectMe.BASE_URL}/it/api/service-type`, headers, newServiceType);

    if (response?.success) {
      setServiceTypes([...serviceTypes, response.data]);
      setNewServiceType({ name: '', description: '', fields: [] });
      setShowModal(false);
      showToast('Service type added successfully', 'success');
    } else {
      showToast('Failed to add service type', 'error');
    }
  };

  const handleAddField = () => {
    if (!newField.fieldName || !newField.fieldType) {
      showToast('Please provide both field name and field type.', 'error');
      return;
    }

    setNewServiceType({
      ...newServiceType,
      fields: [...newServiceType.fields, newField],
    });
    showToast('Field added', 'success');
    setNewField({ fieldName: '', fieldType: '', isRequired: false });
  };

  const handleDeleteServiceType = async (serviceId) => {
    const token = getTokenFromLocalStorage();
    const headers = { Authorization: `Bearer ${token}` };
    const response = await apiCall('DELETE', `${ConnectMe.BASE_URL}/it/api/service-type/${serviceId}`, headers);

    if (response?.success) {
      setServiceTypes(serviceTypes.filter(service => service._id !== serviceId));
      showToast('Service type deleted successfully', 'success');
    } else {
      showToast('Failed to delete service type', 'error');
    }
  };

  const handleDeleteField = (fieldIndex) => {
    setNewServiceType({
      ...newServiceType,
      fields: newServiceType.fields.filter((_, index) => index !== fieldIndex),
    });
    showToast('Field removed', 'info');
  };

  return (
    <div className="service-type-page container-fluid">
      <h1 className="text-center my-4">Service Types Management</h1>

      {/* Add Service Type Button */}
      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add New Service Type
        </button>
      </div>

      {/* Add Service Type Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Service Type</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Service Type Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Service Type Name"
                    value={newServiceType.name}
                    onChange={(e) => setNewServiceType({ ...newServiceType, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Service Type Description:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Service Type Description"
                    value={newServiceType.description}
                    onChange={(e) => setNewServiceType({ ...newServiceType, description: e.target.value })}
                  />
                </div>

                {/* Add Field Section */}
                <div className="card my-4">
                  <div className="card-header">
                    <h5 className="mb-0">Add Field</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-2">
                      <label className="form-label">Field Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Field Name"
                        value={newField.fieldName}
                        onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Field Type:</label>
                      <select
                        className="form-select"
                        value={newField.fieldType}
                        onChange={(e) => setNewField({ ...newField, fieldType: e.target.value })}
                        required
                      >
                        <option value="">Select Field Type</option>
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="date">Date</option>
                        <option value="select">Dropdown (Multiple Options)</option>
                        <option value="checkbox">Checkbox (Multiple Options)</option>
                      </select>
                    </div>

                    {(newField.fieldType === "select" || newField.fieldType === "checkbox") && (
                      <div className="mb-2">
                        <label className="form-label">Options (comma-separated):</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Option1, Option2, Option3"
                          value={newField.options?.join(", ")}
                          onChange={(e) => setNewField({ ...newField, options: e.target.value.split(",").map(opt => opt.trim()) })}
                        />
                      </div>
                    )}

                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={newField.isRequired}
                        onChange={(e) => setNewField({ ...newField, isRequired: e.target.checked })}
                        id="isRequiredCheck"
                      />
                      <label className="form-check-label" htmlFor="isRequiredCheck">
                        Is Required
                      </label>
                    </div>

                    <button className="btn btn-secondary" onClick={handleAddField}>
                      Add Field
                    </button>
                  </div>
                </div>

                {/* Display Added Fields */}
                <div className="mb-3">
                  <h5>Added Fields</h5>
                  <ul className="list-group">
                    {newServiceType.fields.map((field, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {field.fieldName} ({field.fieldType}) {field.isRequired && '(Required)'}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteField(index)}>
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={handleAddServiceType}>
                  Submit Service Type
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display Existing Service Types */}
      <div className="row">
        {serviceTypes.map(service => (
          <div className="col-md-4 mb-4" key={service._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{service.name}</h5>
                <p className="card-text">{service.description}</p>
                <h6>Fields:</h6>
                <ul className="list-group list-group-flush">
                  {service.fields.map((field, index) => (
                    <li key={index} className="list-group-item">
                      {field.fieldName} ({field.fieldType}) {field.isRequired && '(Required)'}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-footer text-center">
                <button className="btn btn-danger" onClick={() => handleDeleteServiceType(service._id)}>
                  Delete Service Type
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceTypePage;
