import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaLaptop,
  FaFileInvoiceDollar,
  FaLink,
  FaAngleDown,
  FaPhone,
} from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import "./QuickLink.css"; // Import CSS

const QuickLink = () => {
  const [showHRMenu, setShowHRMenu] = useState(false);
  const [showITMenu, setShowITMenu] = useState(false);
  const [showAccountsMenu, setShowAccountsMenu] = useState(false);
  const [showTelephoneMenu, setShowTelephoneMenu] = useState(false);

  const hrLinks = [
    {
      id: 1,
      title: "Domestic Travel Policy",
      url: "/uploads/policy/hr/hrpolicy.docx",
    },
    {
      id: 2,
      title: "Regional Holiday Calendar",
      url: "/uploads/leaves/Location-wiseHolidayCalendarfor2025.docx",
    },
  ];

  // const telcom = [
  //   {
  //     id: 1,
  //     title: "Telephone",
  //     subMenu: [
  //       {
  //         id: "1.1",
  //         title: "Aurangabad [Waluj]",
  //         subMenu: [
  //           {
  //             id: "1.1.1",
  //             title: "Corporate Office",
  //             link: "/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujCorp.off.docx",
  //           },
  //           {
  //             id: "1.1.2",
  //             title: "Plants",
  //             link: "/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujPlants.docx",
  //           },
  //           {
  //             id: "1.1.3",
  //             title: "Abbreviated Numbers",
  //             link: "/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujAbv.docx",
  //           },
  //           {
  //             id: "1.1.4",
  //             title: "Chikalthana",
  //             link: "/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujCHK.pdf",
  //           },
  //           {
  //             id: "1.1.5",
  //             title: "Mobile Number",
  //             link: "/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–Walujmobile.docx",
  //           },
  //         ],
  //       },
  //       {
  //         id: "1.2",
  //         title: "Aurangabad [Chikalthana]",
  //         subMenu: [
  //           {
  //             id: "1.2.1",
  //             title: "Coordinates",
  //             link: "/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujCHK.docx",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];

  return (
    <div className=" quicklink-card">
      {/* Header */}
      <div className="card-header d-flex align-items-center justify-content-center">
        <FaLink className="me-2" size={24} />
        <h5 className="mb-0">Quick Links</h5>
      </div>

   
      {/* <div className="card-body">
        <ul className="quicklink-list">
          
         
          <li className="quicklink-item">
            <div
              className="quicklink-main"
              onClick={() => setShowHRMenu(!showHRMenu)}
            >
              <HiOutlineUserGroup className="quicklink-icon" /> HR
              <FaAngleDown className={`submenu-icon ${showHRMenu ? "rotate" : ""}`} />
            </div>

            {showHRMenu && (
              <ul className="submenu">
                {hrLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.title}
                    </a>
                  </li>
                ))}

             
                {telcom.map((item) => (
                  <li key={item.id} className="submenu-item">
                    <div
                      className="submenu-title"
                      onClick={() => setShowTelephoneMenu(!showTelephoneMenu)}
                    >
                      <FaPhone className="submenu-icon" /> {item.title}
                      <FaAngleDown className={`submenu-icon ${showTelephoneMenu ? "rotate" : ""}`} />
                    </div>

                    {showTelephoneMenu && (
                      <ul className="nested-submenu">
                        {item.subMenu.map((subItem) => (
                          <li key={subItem.id} className="dropdown-submenu">
                            <div className="submenu-title">{subItem.title}</div>
                            <ul className="nested-submenu">
                              {subItem.subMenu.map((subSubItem) => (
                                <li key={subSubItem.id} className="dropdown-item">
                                  <a href={subSubItem.link} target="_blank" rel="noopener noreferrer">
                                    {subSubItem.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>

       
          <li className="quicklink-item">
            <div
              className="quicklink-main"
              onClick={() => setShowITMenu(!showITMenu)}
            >
              <FaLaptop className="quicklink-icon" /> IT
              <FaAngleDown className={`submenu-icon ${showITMenu ? "rotate" : ""}`} />
            </div>

            {showITMenu && (
              <ul className="submenu">
                <li><Link to="/it/helpdesk">IT Helpdesk</Link></li>
                <li><Link to="/it/network">Network Management</Link></li>
                <li><Link to="/it/software">Software Support</Link></li>
                <li><Link to="/it/hardware">Hardware Maintenance</Link></li>
              </ul>
            )}
          </li>

          
          <li className="quicklink-item">
            <div
              className="quicklink-main"
              onClick={() => setShowAccountsMenu(!showAccountsMenu)}
            >
              <FaFileInvoiceDollar className="quicklink-icon" /> Accounts
              <FaAngleDown className={`submenu-icon ${showAccountsMenu ? "rotate" : ""}`} />
            </div>

            {showAccountsMenu && (
              <ul className="submenu">
                <li><Link to="/accounts/invoices">Invoices</Link></li>
                <li><Link to="/accounts/expenses">Expense Management</Link></li>
                <li><Link to="/accounts/reports">Financial Reports</Link></li>
                <li><Link to="/accounts/taxation">Taxation</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </div> */}
    </div>
  );
};

export default QuickLink;
