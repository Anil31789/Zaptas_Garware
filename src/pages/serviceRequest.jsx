import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { apiCall, getTokenFromLocalStorage } from '../utils/apiCall';
import ConnectMe from '../config/connect';
import showToast from '../utils/toastHelper';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ServiceRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab = location.state?.status || 'My Requests'; // Default tab
  const formRef = useRef(null);
  
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [communicationType, setCommunicationType] = useState('');
  const [showCommunicationField, setShowCommunicationField] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

    // Hide modal (assuming bootstrap modal is available globally)
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
      const response = await apiCall('PUT', url, headers, { comment, communicationType });

      if (response && response.data) {
        showToast(`Service request ${action}ed successfully!`, 'success');
        setServiceRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === selectedRequest
              ? { ...request, status: action === 'approve' ? 'Approved' : 'Rejected' }
              : request
          )
        );
        setSelectedRequest(null);
        setComment('');
        await fetchServiceRequests();
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
    setCommunicationType('');
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

    const approvedSteps = approvalSteps.filter(step => step.status === 'Approved').length;
    const progressPercentage = (approvedSteps / approvalSteps.length) * 100;

    return (
      <div className="mt-4">
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

  const handlePrint = async () => {
    if (!formRef.current) {
      alert("Form not found!");
      return;
    }

    const canvas = await html2canvas(formRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Open PDF in new tab
    const pdfBlob = pdf.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL, "_blank");
  };

  // Filter service requests based on search query
  const filteredRequests = serviceRequests.filter((request) =>
    request.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.EmployeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <div>
          {[
            { label: 'Pending', variant: 'warning' },
            { label: 'Approved', variant: 'success' },
            { label: 'Rejected', variant: 'danger' },
            { label: 'My Requests', variant: 'info' }
          ].map(({ label, variant }) => (
            <button
              key={label}
              className={`btn me-2 btn-${activeTab === label ? variant : `outline-${variant}`}`}
              onClick={() => setActiveTab(label)}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Search Bar */}
        <input
          type="text"
          className="form-control w-25"
          placeholder="Request Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {filteredRequests.map((request) => (
            <div className="col-md-4 mb-3" key={request._id}>
              <div className="card border rounded shadow-sm">
                {/* Header Section */}
                <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center p-3">
                  <div>
                    <h6 className="mb-1 fw-semibold text-dark">Request ID: {request.requestId}</h6>
                    <p className="mb-1 small text-muted">Employee: {request.EmployeeCode}</p>
                    <p className="mb-0 small text-muted">{request.serviceType}</p>
                  </div>
                  <FaInfoCircle 
                    size={20} 
                    className="text-secondary cursor-pointer" 
                    onClick={() => navigate('/securityform', { state: request })} 
                  />
                </div>

                {/* Details Section with fixed height and scroll */}
                <div className="card-body overflow-auto" style={{ maxHeight: '100px' }}>
                  <p className="fw-bold text-secondary mb-2">Details:</p>
                  <div className="px-2">
                    {request.serviceFields.map((field, index) => (
                      <div key={index} className="d-flex justify-content-between border-bottom py-2">
                        <span className="text-muted small">{field.fieldConfig}:</span>
                        <span className="text-dark small">{field.fieldValue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Section */}
                <div className="card-footer bg-light p-3 d-flex justify-content-between align-items-center">
                  {activeTab === 'Pending' ? (
                    <>
                      <button className="btn btn-outline-success btn-sm px-3" onClick={() => openCommentModal(request)}>Approve</button>
                      <button className="btn btn-outline-danger btn-sm px-3" onClick={() => openCommentModal(request)}>Reject</button>
                    </>
                  ) : (
                    <div className="text-muted small">
                      <ApprovalTimeline request={request} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Print Button (if needed) */}
      {/* <div className="mt-4">
        <button className="btn btn-primary" onClick={handlePrint}>Print</button>
      </div> */}

      {/* Comment Modal */}
      <div className="modal fade" id="commentModal" tabIndex="-1" aria-labelledby="commentModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="commentModalLabel">Add Comment</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* Communication Type field if applicable */}
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
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={() => handleAction('approve')}
                disabled={showCommunicationField && !communicationType}
              >
                Approve
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={() => handleAction('reject')}
                disabled={showCommunicationField && !communicationType}
              >
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
