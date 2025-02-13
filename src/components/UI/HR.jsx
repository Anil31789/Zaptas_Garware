import React, { useState } from "react";
import { FaUsersGear } from "react-icons/fa6";
import ConnectMe from "../../config/connect";

const HR = () => {
  const [isHovered, setIsHovered] = useState(false);

  const hrLinks = [
    {
      id: 1,
      title: "Domestic Travel Policy",
      url: `${ConnectMe.img_URL}/uploads/policy/hr/hrpolicy.pdf`,
    },
  
    {
      id: 3,
      title: "Regional Holiday Calendar",
      url: `${ConnectMe.img_URL}/uploads/leaves/Location-wiseHolidayCalendarfor2025.pdf`,
    },
  ];

  const telcom = [
    {
      id: 1,
      title: "Telephone",
      subMenu: [
        {
          id: "1.1",
          title: "Aurangabad [Waluj]",
          link: "#",
          subMenu: [
            {
              id: "1.1.1",
              title: "Corporate Office",
              link: `${ConnectMe.img_URL}/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujCorp.off.pdf`,
            },
            {
              id: "1.1.2",
              title: "Plants",
              link: `${ConnectMe.img_URL}/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujPlants.pdf`,
            },
            {
              id: "1.1.3",
              title: "Abbreviated Numbers",
              link: `${ConnectMe.img_URL}/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujAbv.pdf`,
            },
            // {
            //   id: "1.1.4",
            //   title: "Chikalthana",
            //   link: `${ConnectMe.img_URL}/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujCHK.pdf`,
            // },
            {
              id: "1.1.5",
              title: "Mobile Number",
              link: `${ConnectMe.BASE_URL}/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–Walujmobile.pdf`,
            },
          ],
        },
        {
          id: "1.2",
          title: "Aurangabad [Chikalthana]",
          subMenu: [
            {
              id: "1.1.1",
              title: "Coordinates",
              link: `${ConnectMe.img_URL}/uploads/telecomHr/Aurangabad–Waluj/Aurangabad–WalujCHK.pdf`,
            },
       
          ],
        
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
      <div className="card-header d-flex align-items-center">
        <FaUsersGear className="me-2" size={24} />
        <h5 className="mb-0">HR Section</h5>
      </div>
      <div className="card-body">
        <ul>
          {hrLinks.map((link) => (
            <li key={link.id}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.title}
              </a>
            </li>
          ))}
          {telcom.map((item) => (
            <li key={item.id}>
              {item.title}
              <ul>
                {item.subMenu.map((subItem) => (
                  <li key={subItem.id}>
                    {subItem.title}
                    <ul>
                      {subItem.subMenu.map((subSubItem) => (
                        <li key={subSubItem.id}>
                          <a href={subSubItem.link} target="_blank" rel="noopener noreferrer">
                            {subSubItem.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HR;
