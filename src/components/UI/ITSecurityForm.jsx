import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function ITSecurityForm() {
  const formRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => {
      console.log("Form Ref:", formRef.current); // Debugging: Check if ref is attached
      return formRef.current || document.createElement("div"); // Fallback to avoid null
    },
    documentTitle: "IT Security Form",
    pageStyle: "@page { size: auto; margin: 20mm; }",
  });

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
      {/* Print Button */}
      <button className="btn btn-primary mb-3" onClick={handlePrint}>
        Print Form
      </button>

      {/* Printable Section */}
      <div ref={formRef} className="form-container p-4 bg-white rounded shadow border">
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
          {[
            { label: "Employee Signature", value: formData.employeeSignature },
            { label: "HOD’s Signature", value: formData.hodSignature },
          ].map((field, index) => (
            <div className="col-md-6" key={index}>
              <strong>{field.label}:</strong>
              <div className="border p-3 rounded bg-light text-muted text-center">
                {field.value ? <img src={field.value} alt="Signature" width="100" /> : "Signature Not Available"}
              </div>
            </div>
          ))}
        </div>

        {/* Access Details */}
        <h5 className="mt-4">Equipment Request for Access</h5>
        <div className="mb-3"><strong>Type of Access:</strong> CCTV Camera</div>
        <div className="mb-3"><strong>Location of CCTV Camera:</strong> {formData.cctvLocation || "N/A"}</div>
        <div className="mb-3"><strong>Reason for Access:</strong> {formData.reason || "N/A"}</div>
        <div className="mb-3"><strong>Expected Period:</strong> {formData.expectedPeriod || "N/A"}</div>

        {/* Justification */}
        <h5 className="mt-4">Justification from HOD</h5>
        <p className="border p-3">{formData.hodJustification || "N/A"}</p>

        {/* IT Department Comments */}
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