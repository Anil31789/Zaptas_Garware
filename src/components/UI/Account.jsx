import React, { useState } from "react";
import { FaMoneyBillWave } from "react-icons/fa6";
import { AiOutlineUser } from "react-icons/ai";
import ConnectMe from "../../config/connect";

const Accounts = () => {
  const [isHovered, setIsHovered] = useState(false);

  const accountsData = [
    {
      id: "1",
      title: "Reimbursement Form Formats",
      subMenu: [
        {
          title: "Fuel",
          link: `${ConnectMe.img_URL}/uploads/forms/FUELCLAIMFORMAT.xls`,
        },
        {
          title: "Travelling Expenses",
          link: `${ConnectMe.img_URL}/uploads/forms/TESformat.xls`,
        },
        {
          title: "Cash Voucher",
          link: `${ConnectMe.img_URL}/uploads/forms/CASHPAYMENTVOUCHER(003).xlsx`,
        },
      ],
    },
    {
      id: "2",
      title: "Income Tax-Related Forms",
      subMenu: [
        {
          title:
            "Income Tax Declaration proposed investment .",
          link: `${ConnectMe.img_URL}/uploads/forms/INCOMETAXSAVINGSTATEMENTFORFY2024-25_updated.xls`,
        },
        {
          title:
            "Submission of actual investment proofs at the end of the year (physical copies required).",
          link: `${ConnectMe.img_URL}/uploads/forms/form12BAA.docx`,
        },
      ],
    },
    {
      id: "3",
      title: "LTA Forms",
      subMenu: [
        {
          title: "Formats for Leave Travel Allowance (LTA).",
          link: `${ConnectMe.img_URL}/uploads/forms/LTAFORM.xls`,
        },
      ],
    },
    {
      id: "4",
      title: "Insurance-Related Forms",
      subMenu: [
        {
          title: "Group Personal Accident (GPA) Claim Form",
          link: `${ConnectMe.img_URL}/uploads/forms/PAClaimform.pdf`,
        },
        {
          title: "Group Mediclaim (GMC) Claim Form",
          link: `${ConnectMe.img_URL}/uploads/forms/GMCStandard-Cashless-Request-Form.pdf`,
        },
        {
          title: "Group Mediclaim (GMC) Manual for understanding the policy",
          link: `${ConnectMe.img_URL}/uploads/forms/GMCEmployeesUserManual2024-25.pdf`,
        },
      ],
    },
  ];

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
      </div>
      <div className="card-body">
        <ul className="list-unstyled">
          {/* <li className="fw-bold">Accounts</li> */}
          <ul className="ps-3">
            {accountsData.map((category) => (
              <li key={category.id} className="mb-2">
                {category.title}
                <ul className="ps-3">
                  {category.subMenu.map((subItem, index) => (
                    <li key={index}>
                      <a
                        href={subItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        {subItem.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default Accounts;
