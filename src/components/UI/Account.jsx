import React, { useState } from "react";
import { FaMoneyBillWave } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { AiOutlineFileText } from "react-icons/ai";
import ConnectMe from "../../config/connect";

const Accounts = () => {
  const [expanded, setExpanded] = useState({});

  const toggleMenu = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const accountsData = [
    {
      id: "1",
      title: "💰 Reimbursement Form Formats",
      subMenu: [
        {
          id: "1.1",
          title: "🚗 Fuel",
          link: `${ConnectMe.img_URL}/uploads/forms/FUELCLAIMFORMAT.xls`,
        },
        {
          id: "1.2",
          title: "✈️ Travelling Expenses",
          link: `${ConnectMe.img_URL}/uploads/forms/TESformat.xls`,
        },
        {
          id: "1.3",
          title: "💵 Cash Voucher",
          link: `${ConnectMe.img_URL}/uploads/forms/CASHPAYMENTVOUCHER(003).xlsx`,
        },
      ],
    },
    {
      id: "2",
      title: "📑 Income Tax-Related Forms",
      subMenu: [
        {
          id: "2.1",
          title: "📋 Income Tax Declaration",
          link: `${ConnectMe.img_URL}/uploads/forms/INCOMETAXSAVINGSTATEMENTFORFY2024-25_updated.xls`,
        },
        {
          id: "2.2",
          title: "📁 Actual Investment Proof Submission",
          link: `${ConnectMe.img_URL}/uploads/forms/form12BAA.docx`,
        },
      ],
    },
    {
      id: "3",
      title: "📜 LTA Forms",
      subMenu: [
        {
          id: "3.1",
          title: "🛫 Leave Travel Allowance (LTA) Format",
          link: `${ConnectMe.img_URL}/uploads/forms/LTAFORM.xls`,
        },
      ],
    },
    {
      id: "4",
      title: "🛡️ Insurance-Related Forms",
      subMenu: [
        {
          id: "4.1",
          title: "📝 Group Personal Accident (GPA) Claim Form",
          link: `${ConnectMe.img_URL}/uploads/forms/PAClaimform.pdf`,
        },
        {
          id: "4.2",
          title: "🏥 Group Mediclaim (GMC) Claim Form",
          link: `${ConnectMe.img_URL}/uploads/forms/GMCStandard-Cashless-Request-Form.pdf`,
        },
        {
          id: "4.3",
          title: "📘 GMC Manual (Policy Understanding)",
          link: `${ConnectMe.img_URL}/uploads/forms/GMCEmployeesUserManual2024-25.pdf`,
        },
      ],
    },
  ];
  return (
    <div className="card shadow-lg border-0 mb-3">
      <div className="card-header d-flex align-items-center">
        <FaMoneyBillWave className="me-2" size={20} />
        <p className="mb-0">Accounts Section</p>
      </div>
      <div className="card-body">
        {accountsData.map((category) => (
          <div key={category.id} className="mb-2">
            <button
              className="fw-bold d-flex align-items-center border-0 bg-transparent w-100 text-start py-2"
              type="button"
              onClick={() => toggleMenu(category.id)}
              aria-expanded={expanded[category.id]}
            >
              {/* Dynamic Arrow Change */}
              {expanded[category.id] ? (
                <IoIosArrowDown size={18} className="me-2" />
              ) : (
                <IoIosArrowForward size={18} className="me-2" />
              )}
              <span>{category.title}</span>
            </button>
            {expanded[category.id] && (
              <ul className="list-unstyled ps-4">
                {category.subMenu.map((subItem) => (
                  <li key={subItem.id} className="mb-1">
                    <a
                      href={subItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none text-dark d-flex align-items-center"
                    >
                      <span>{subItem.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default Accounts;
