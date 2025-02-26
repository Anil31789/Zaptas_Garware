import React, { useState } from "react";
import { FaUsersGear } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { MdCorporateFare, MdLocationPin, MdPhoneIphone } from "react-icons/md";
import ConnectMe from "../../config/connect";

const HR = () => {
  const [expanded, setExpanded] = useState({ "1": true }); // Only "Telephone Directory" open

  const toggleMenu = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getIconForTitle = (title) => {
    const lowerTitle = title.toLowerCase();
    // if (lowerTitle.includes("corporate")) return <MdCorporateFare size={18} />;
    // if (lowerTitle.includes("mobile")) return <MdPhoneIphone size={18} />;
    if (lowerTitle.includes("location") || lowerTitle.includes("coordinates"))
      // return <MdLocationPin size={18} />;
    return null;
  };

  const hrLinks = [
    {
      id: 1,
      title: "📄 Domestic Travel Policy",
      url: `${ConnectMe.img_URL}/uploads/policy/hr/hrpolicy.docx`,
    },
    {
      id: 2,
      title: "📅 Regional Holiday Calendar",
      url: `${ConnectMe.img_URL}/uploads/leaves/Location-wiseHolidayCalendarfor2025.docx`,
    },
  ];

  const telcom = [
    {
      id: "1",
      title: "📞 Telephone Directory",
      subMenu: [
        {
          id: "1.1",
          title: "Waluj",
          subMenu: [
            {
              id: "1.1.1",
              title: "🏢 Corporate Office",
              link: `${ConnectMe.img_URL}/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujCorp.off.pdf`,
            },
            {
              id: "1.1.2",
              title: "🏭 Plants",
              link: `${ConnectMe.img_URL}/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujPlants.pdf`,
            },
            {
              id: "1.1.3",
              title: "📞 Abbreviated Numbers",
              link: `${ConnectMe.img_URL}/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujAbv.pdf`,
            },
            {
              id: "1.1.5",
              title: "📲 Mobile Numbers",
              link: `${ConnectMe.img_URL}/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–Walujmobile.pdf`,
            },
          ],
        },
        {
          id: "1.2",
          title: "Chikalthana",
          subMenu: [
            {
              id: "1.2.1",
              title: "📍 Coordinates",
              link: `${ConnectMe.img_URL}/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujCHK.pdf`,
            },
          ],
        },
        {
          id: "1.3",
          title: "Mumbai",
          subMenu: [
            {
              id: "1.3.1",
              title: "🏢 Corporate Office",
              link: `${ConnectMe.img_URL}/uploads/telecomHr/Mumbai/corporateoffice.pdf`,
            },
          ],
        },
        {
          id: "1.4",
          title: "Nashik",
          subMenu: [
            {
              id: "1.4.1",
              title: "📲 Mobile Numbers",
              link: `${ConnectMe.img_URL}/uploads/telecomHr/Nashik/telcom.pdf`,
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="card shadow-lg border-0 mb-3">
      <div className="card-header d-flex">
        <FaUsersGear className="me-2" size={20} />
        <p className="mb-0">HR Section</p>
      </div>
      <div className="card-body">
        {/* HR Policy Links */}
        <ul className="list-group mb-3">
          {hrLinks.map((link) => (
            <li key={link.id} className="list-group-item">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-dark"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>

        {/* Telecom Directory - Only Main Section Open by Default */}
        <div className="accordion" id="telecomAccordion">
          {telcom.map((item) => (
            <div key={item.id} className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button fw-bold ${expanded[item.id] ? "" : "collapsed"}`}
                  type="button"
                  onClick={() => toggleMenu(item.id)}
                  aria-expanded={expanded[item.id]}
                >
                  {item.title}
                </button>
              </h2>
              <div
                className={`accordion-collapse collapse ${expanded[item.id] ? "show" : ""}`}
              >
                <div className="accordion-body">
                  <ul className="list-unstyled">
                    {item.subMenu.map((sub) => (
                      <li key={sub.id} className="mb-2">
                        <div
                          className="d-flex align-items-center text-primary fw-bold"
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleMenu(sub.id)}
                        >
                          {expanded[sub.id] ? (
                            <IoIosArrowDown size={18} />
                          ) : (
                            <IoIosArrowForward size={18} />
                          )}
                          <span className="ms-2">{sub.title}</span>
                        </div>
                        {expanded[sub.id] && (
                          <ul className="list-unstyled ps-4">
                            {sub.subMenu.map((linkItem) => (
                              <li key={linkItem.id} className="mb-1">
                                <a
                                  href={linkItem.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-decoration-none text-dark"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  {getIconForTitle(linkItem.title)}
                                  {linkItem.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HR;
