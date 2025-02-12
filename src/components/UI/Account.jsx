import React, { useState } from "react";
import { FaMoneyBillWave } from "react-icons/fa6";
import { HiArrowCircleRight } from "react-icons/hi";

const Accounts = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="card mb-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaMoneyBillWave className="me-2" size={24} />
          <h5 className="mb-0">Accounts Section</h5>
        </div>
        {/* <HiArrowCircleRight size={24} /> */}
      </div>
      <div className="card-body">
        <ul>
          <li>Financial Reports</li>
          <li>Budget Planning</li>
          <li>Payroll Management</li>
        </ul>
      </div>
    </div>
  );
};

export default Accounts;
