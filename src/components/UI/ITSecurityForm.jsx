import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ITSecurityForm() {
  const formRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }
  }, []);

  const data = location.state;

  useEffect(() => {
    if (!data) {
      navigate("/");
    }
  }, [data, navigate]);

  if (!data) {
    return null;
  }

  const formData = {
    employeeName: userDetails?.name,
    requestId:data?.requestId,
    date: data?.requestDate ? new Date(data.requestDate).toLocaleDateString("en-GB") : "N/A",
    department: userDetails?.jobTitle,
    location: "New York",
    designation: "Security Analyst",
    hodName: data?.HODName,
    employeeSignature: userDetails?.name,
    hodSignature: data?.HODName,
    serviceType: data?.serviceType,
    hodJustification: data?.hodApproval?.comment,
    itComments: data?.itApproval?.comment,
    ...(data?.hodApproval?.comment && data?.itApproval?.comment && {
      reviewedBy: data?.itApproval?.name,
      approvedBy: data?.itHeadApproval?.name,
    }),
  };
  console.log(formData,data)

  const handlePrintPDF = async () => {
    const input = formRef.current;

    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("IT_Security_Form.pdf"); // Download PDF
    window.open(pdf.output("bloburl"), "_blank"); // Open PDF in new tab
  };

  return (
    <div className="container mt-4">
      {/* Print Button */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={handlePrintPDF}>
          Print Form (PDF)
        </button>
      </div>

      {/* Printable Section */}
      <div ref={formRef} className="p-4 bg-white rounded shadow border position-relative">
  <div className="text-center position-absolute w-100">
    <h2 className="text-uppercase">IT {formData?.serviceType} Form</h2>
  </div>
  <div className="d-flex justify-content-start">
    <img src="./logo.PNG" alt="Company Logo" className="img-fluid" style={{ maxHeight: "35px" }} />
  </div>
  <br></br>
        <h4 className="border-bottom pb-2">Applicant’s Details</h4>
        <table className="table table-bordered">
          <tbody>
            {[
                { label: "ID", value: formData.requestId },
              { label: "Employee Name", value: formData.employeeName },
              { label: "Date", value: formData.date },
              { label: "Department", value: formData.department },
              { label: "Location", value: formData.location },
              { label: "Designation", value: formData.designation },
              { label: "HOD Name", value: formData.hodName },
            ].map((field, index) => (
              <tr key={index}>
                <td className="fw-bold">{field.label}</td>
                <td>{field.value || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Signatures */}
        <div className="row">
          {[
            { label: "Employee Signature", value: formData.employeeSignature },
            { label: "HOD’s Signature", value: formData.hodSignature },
          ].map((field, index) => (
            <div className="col-md-6 mb-3" key={index}>
              <strong>{field.label}:</strong>
              <div className="border p-3 rounded bg-light text-center">
                {field?.value || ""}
              </div>
            </div>
          ))}
        </div>

        <h4 className="border-bottom pb-2 mt-4">{formData?.serviceType}</h4>
        <table className="table table-bordered">
          <tbody>
            {data?.serviceFields?.length > 0 ? (
              data.serviceFields.map((field, index) => (
                <tr key={index}>
                  <td className="fw-light">{field.fieldConfig}</td>
                  <td className="fw-bold">{field.fieldValue || ""}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center">No service fields available.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Justification */}
        <h4 className="border-bottom pb-2 mt-4">Justification from HOD</h4>
        <p className="border p-3">{formData.hodJustification}</p>

        {/* IT Department Comments */}
        <h4 className="border-bottom pb-2 mt-4">Comments from IT Department</h4>
        <p className="border p-3">{formData.itComments}</p>

        {/* IT Department Review */}
        <h4 className="border-bottom pb-2 mt-4">IT Department</h4>
        <table className="table table-bordered">
          <tbody>
            {[
              { label: "Reviewed By", value: formData.reviewedBy },
              { label: "Approved By", value: formData.approvedBy },
            ].map((field, index) => (
              <tr key={index}>
                <td className="fw-bold">{field.label}</td>
                <td>{field.value || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Notes Section */}
        <div className="mt-4 p-3 bg-light border rounded">
          <h5>Note:</h5>
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
