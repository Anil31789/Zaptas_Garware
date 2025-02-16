import React from "react";

export default function ITSecurityForm() {
  const formData = {
    employeeName: "John Doe",
    date: "16-02-2025",
    department: "IT",
    location: "New York",
    designation: "Security Analyst",
    hodName: "Michael Smith",
    employeeSignature: "signature1.png",
    hodSignature: "signature2.png",
    cctvLocation: "Server Room",
    reason: "Security Audit",
    expectedPeriod: "One Time",
    hodJustification: "Necessary for internal security compliance.",
    itComments: "Approved as per security policy.",
    reviewedBy: "David Johnson",
    approvedBy: "Sophia Brown",
  };
  return (
    <div className="container mt-4">
      <div className="form-container p-4 bg-white rounded shadow border">
        <h3 className="text-center text-uppercase">IT Security Form</h3>

        {/* Applicant’s Data */}
        <h5 className="mt-3">Applicant’s Data</h5>
        <div className="row">
          {[
            { label: "Employee Name", value: formData.employeeName },
            { label: "Date", value: formData.date },
            { label: "Department", value: formData.department },
            { label: "Location", value: formData.location },
            { label: "Designation", value: formData.designation },
            { label: "HOD Name", value: formData.hodName },
          ].map((field, index) => (
            <div className="col-md-6 mb-3" key={index}>
              <strong>{field.label}:</strong> {field.value || "N/A"}
            </div>
          ))}
        </div>

        {/* Signatures */}
        <div className="row">
          <div className="col-md-6">
            <strong>Employee Signature:</strong>
            <div className="border p-3 rounded bg-light text-muted text-center">
              {formData.employeeSignature ? (
                <img
                  src={formData.employeeSignature}
                  alt="Signature"
                  width="100"
                />
              ) : (
                "Signature Not Available"
              )}
            </div>
          </div>
          <div className="col-md-6">
            <strong>HOD’s Signature:</strong>
            <div className="border p-3 rounded bg-light text-muted text-center">
              {formData.hodSignature ? (
                <img src={formData.hodSignature} alt="Signature" width="100" />
              ) : (
                "Signature Not Available"
              )}
            </div>
          </div>
        </div>

        {/* Equipment Request */}
        <h5 className="mt-4">Equipment Request for Access</h5>
        <div className="mb-3">
          <strong>Type of Access:</strong> CCTV Camera
        </div>
        <div className="mb-3">
          <strong>Location of CCTV Camera:</strong>{" "}
          {formData.cctvLocation || "N/A"}
        </div>
        <div className="mb-3">
          <strong>Reason for Access:</strong> {formData.reason || "N/A"}
        </div>
        <div className="mb-3">
          <strong>Expected Period:</strong> {formData.expectedPeriod || "N/A"}
        </div>

        {/* Justification from HOD */}
        <h5 className="mt-4">Justification from HOD</h5>
        <p className="border p-3">{formData.hodJustification || "N/A"}</p>

        {/* Comments from IT Department */}
        <h5 className="mt-4">Comments from IT Department</h5>
        <p className="border p-3">{formData.itComments || "N/A"}</p>

        {/* IT Department Review */}
        <h5 className="mt-4">IT Department</h5>
        <div className="row">
          {[
            { label: "Reviewed By", value: formData.reviewedBy },
            { label: "Approved By", value: formData.approvedBy },
          ].map((field, index) => (
            <div className="col-md-6 mb-3" key={index}>
              <strong>{field.label}:</strong> {field.value || "N/A"}
            </div>
          ))}
        </div>

        {/* Notes Section */}
        <div className="mt-4 p-3 bg-light border rounded">
          <h6>Note:</h6>
          <ul>
            <li>Approval of request is subject to IT security policy.</li>
            <li>HOD’s approval is mandatory and considered risk acceptance.</li>
            <li>Employee must be aware of terms, conditions, and risks.</li>
            <li>Privileges granted must not be shared with others.</li>
            <li>IT Head reserves the right to revoke changes at any time.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
