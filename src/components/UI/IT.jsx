import React, { useState } from "react";
import { FaLaptopCode } from "react-icons/fa6";
import { HiArrowCircleRight } from "react-icons/hi";

const IT = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="card mb-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaLaptopCode className="me-2" size={24} />
          <h5 className="mb-0">IT Section</h5>
        </div>
        {/* <HiArrowCircleRight size={24} /> */}
      </div>
      <div className="card-body">
        <ul>
          <li>IT Helpdesk</li>
          <li>Software Support</li>
          <li>Hardware Maintenance</li>
        </ul>
      </div>
    </div>
  );
};

export default IT;
