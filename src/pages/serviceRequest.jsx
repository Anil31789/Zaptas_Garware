import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiCall, getTokenFromLocalStorage } from '../utils/apiCall';
import ConnectMe from '../config/connect';
import showToast from '../utils/toastHelper';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const ServiceRequestPage = () => {
  const location = useLocation();
  const initialTab = location.state?.status || "My Requests"; // Default to "My Requests"
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [communicationType, setCommunicationType] = useState('');
  const [showCommunicationField, setShowCommunicationField] = useState(false);

  useEffect(() => {

    fetchServiceRequests();
  }, [activeTab]);


  const fetchServiceRequests = async () => {
    setLoading(true);
    try {
      const url = `${ConnectMe.BASE_URL}/it/api/getrequests?status=${activeTab}&count=true&data=true`;
      const token = getTokenFromLocalStorage();
      const headers = { Authorization: `Bearer ${token}` };
      const response = await apiCall('GET', url, headers, null, 2000, false);
      if (response?.data?.data) {
        setServiceRequests(response.data.data);
      } else {
        console.error('Failed to fetch service requests');
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (!comment.trim()) {
      showToast('Comment is required before taking action.', 'warning');
      return;
    }

    const modal = document.getElementById('commentModal');
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance?.hide();
    }

    showToast(`Processing ${action} request...`, 'info');

    try {
      const url = `${ConnectMe.BASE_URL}/it/api/servicerequests/${selectedRequest}/${action}`;
      const token = getTokenFromLocalStorage();
      const headers = { Authorization: `Bearer ${token}` };
      const response = await apiCall('PUT', url, headers, { comment,communicationType });

      if (response && response.data) {
        showToast(`Service request ${action}ed successfully!`, 'success');
        setServiceRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== selectedRequest)
        );
        setServiceRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === selectedRequest
              ? { ...request, status: action === 'approve' ? 'Approved' : 'Rejected' }
              : request
          )
        );
        setSelectedRequest(null);
        setComment('');
        await fetchServiceRequests()
      } else {
        showToast(`Failed to ${action} the request.`, 'error');
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      showToast(`An error occurred while ${action}ing the request.`, 'error');
    }
  };

  const openCommentModal = (request) => {
    setSelectedRequest(request._id);
    setComment('');

    // Show the communication type field if hodCommunication is true
    setShowCommunicationField(request?.hodCommunication || false);
    setCommunicationType(''); // Reset the communication type field

    const modal = new bootstrap.Modal(document.getElementById('commentModal'));
    modal.show();
  };





  const ApprovalTimeline = ({ request }) => {
    const approvalSteps = [
      { name: 'User Sends Request', status: 'Approved', comment: 'Request Sent', date: request.requestDate },
      { name: 'HOD Approval', status: request.hodApproval?.status, comment: request.hodApproval?.comment, date: request.hodApproval?.date },
      { name: 'IT Approval', status: request.itApproval?.status, comment: request.itApproval?.comment, date: request.itApproval?.date },
      { name: 'IT Head Approval', status: request.itHeadApproval?.status, comment: request.itHeadApproval?.comment, date: request.itHeadApproval?.date }
    ];

    // Determine the progress percentage based on approvals
    const approvedSteps = approvalSteps.filter(step => step.status === 'Approved').length;
    const progressPercentage = (approvedSteps / approvalSteps.length) * 100;

    return (
      <div className="mt-4">
        {/* Progress Bar */}
        <div className="progress" style={{ height: '5px' }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        {/* Approval Timeline */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          {approvalSteps.map((step, index) => (
            <OverlayTrigger
              key={index}
              placement="top"
              overlay={
                <Tooltip>
                  <strong>{step.comment || 'No comment'}</strong> <br />
                  {step.date ? new Date(step.date).toLocaleString() : 'No date available'}
                </Tooltip>
              }
            >
              <div className="text-center position-relative">
                {step.status === 'Approved' ? (
                  <FaCheckCircle className="text-success fs-3" />
                ) : step.status === 'Rejected' ? (
                  <FaTimesCircle className="text-danger fs-3" />
                ) : (
                  <FaCheckCircle className="text-secondary fs-3 opacity-50" />
                )}
                <p className="small text-muted mt-1">{step.name}</p>
              </div>
            </OverlayTrigger>
          ))}
        </div>
      </div>
    );
  };









  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Service Requests</h2>
      <div className="d-flex justify-content-center mb-4">
        {['Pending', 'Approved', 'Rejected', 'My Requests'].map((tab) => (
          <button
            key={tab}
            className={`btn me-2 ${activeTab === tab ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {serviceRequests.map((request) => (
            <div className="col-md-4 mb-3" key={request._id}>
              <div className="card shadow-sm p-3">

                {/* Header Section */}
                <div className="card-header bg-light text-dark p-2">
                  <h6 className="mb-1 fw-bold">Request ID: {request.requestId}</h6>
                  <p className="mb-1 text-muted small">Employee: {request.EmployeeCode}</p>
                  <p className="mb-1 text-muted small">Type: {request.serviceType}</p>
                </div>

                {/* Details Section */}
                <div className="card-body">
                  <p className="mb-2 fw-bold">Details:</p>
                  <div className="px-2">
                    {request.serviceFields.map((field, index) => (
                      <div key={index} className="d-flex justify-content-between">
                        <p className="mb-1 text-muted small">{field.fieldConfig}:</p>
                        <p className="mb-1 text-dark small">{field.fieldValue}</p>
                      </div>
                    ))}
                  </div>

                  {activeTab === 'Pending' ? (
                    <div className="d-flex justify-content-between mt-3">
                      <button className="btn btn-success btn-sm" onClick={() => openCommentModal(request)}>Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => openCommentModal(request)}>Reject</button>
                    </div>
                  ) : (
                    <p className="text-muted small mt-3">
                      <ApprovalTimeline request={request} />
                    </p>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>



      )}

      <div className="modal fade" id="commentModal" tabIndex="-1" aria-labelledby="commentModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="commentModalLabel">Add Comment</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* Show Communication Type field if hodCommunication is true */}
              {showCommunicationField && (
                <div className="mb-3">
                  <label className="form-label">
                    Communication Type <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={communicationType}
                    onChange={(e) => setCommunicationType(e.target.value)}
                    required
                  >
                    <option value="">Select Communication Type</option>
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              )}

              <label className="form-label">Comment</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter your comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-success" onClick={() => handleAction('approve')} disabled={showCommunicationField && !communicationType}>
                Approve
              </button>
              <button type="button" className="btn btn-danger" onClick={() => handleAction('reject')} disabled={showCommunicationField && !communicationType}>
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestPage;
