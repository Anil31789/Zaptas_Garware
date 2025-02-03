import { useEffect, useState } from "react";
import { RiLink } from "react-icons/ri";
import {
  FaHome,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaUsers,
  FaLaptopCode,
  FaUserTie,
  FaBell,
  FaCaretDown,
  FaBox,
  FaFolder,
  FaTag,
} from "react-icons/fa";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiCode, FiMonitor } from "react-icons/fi";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import { IoIosNotifications, IoIosPerson } from "react-icons/io";
import { FaSquareXTwitter } from "react-icons/fa6";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { HiOutlineDesktopComputer, HiOutlineServer, HiOutlineShoppingBag, HiOutlineUserGroup } from "react-icons/hi";
import SendEmailPopup from "./sendMailPopup";



export default function Headers() {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Check if 'userDetails' is available in localStorage
    const storedUserDetails = localStorage.getItem("userDetails");

    // If found, set it in the state
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }

    // Optionally, if the data needs to be reloaded, you can clear localStorage
    // and set new data if needed.
  }, []);

  useEffect(() => {
    fetchQuickLinks();
    fetchNotificationCount();
  }, []);


  // Fetch service types on component mount
  useEffect(() => {
    const fetchServiceTypes = async () => {
      setIsLoading(true);
      try {
        const url = `${ConnectMe.BASE_URL}/it/api/service-types`;
        const token = getTokenFromLocalStorage();
        const headers = { Authorization: `Bearer ${token}` };
        const response = await apiCall("GET", url, headers);

        if (response && response.data) {
          setServiceTypes(response.data);
        } else {
          console.error("Failed to fetch service types");
        }
      } catch (error) {
        console.error("Error fetching service types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceTypes();
  }, []);

  // Hardcoded data with third-level submenus
  const [formData, setFormData] = useState({
    links: [
      {
        id: "1",
        title: "M1",
        // link: "https://www.google.com",
        subMenu: [
          {
            title: "Policy",
            link: "https://maps.google.com",
          },
          {
            title: "HelpDesk",
            link: "https://drive.google.com",
          },
        ],
      },
      {
        id: "2",
        title: "M2",
        link: "https://www.facebook.com",
        subMenu: [
          { title: "Facebook Ads", link: "https://www.facebook.com/ads" },
          { title: "Facebook Messenger", link: "https://www.messenger.com" },
        ],
      },
      {
        id: "3",
        title: "M3",
        link: "https://www.linkedin.com",
        subMenu: [
          {
            title: "LinkedIn Learning",
            link: "https://www.linkedin.com/learning",
          },
          { title: "LinkedIn Jobs", link: "https://www.linkedin.com/jobs" },
        ],
      },
    ],
  });
  const [qlink, setqlink] = useState([
  ]);



  const QuickLinksMenu = () => {
    const addresses = [
      {
        id: "1",
        title: "Locations",
        submenu: [
          {
            type: "Registered Office",
            address: "Naigaon, Post- Waluj, Chhatrapati Sambhajinagar-431133, Maharashtra, India",
            contact: "+91 240 2567400",
            email: "info@garwarehitech.com",
          },
          {
            type: "Corporate Office",
            address: "Garware House, 50-A, Swami Nityanand Marg, Vile Parle (East), Mumbai-400057, Maharashtra",
            contact: "+91 22 66988000",
            email: "info@garwarehitech.com",
          },
          {
            type: "Sales Office",
            address: "Old No. 37, New No. 55, Ambercrest, 4th Floor, Pantheon Rd.Lane, Egmore, Chennai- 600008",
          },
          {
            type: "Sales Office",
            address: "8B, Atma Ram House, 1, Tolstoy Rd, Connaught Place, New Delhi, Delhi- 110001",
          },
          {
            type: "Get In Touch!",
            email: "info@garwarehitech.com",
            contact: "+91 9689968996",
          },
        ],
      },
    ];

    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle d-flex align-items-center"
          href="#"
          id="quicklinksDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="d-flex flex-column align-items-center">
            <RiLink className="navbar-icon me-1" />
            <span className="header1">Quicklinks</span>
          </span>
        </a>
        <ul className="dropdown-menu" aria-labelledby="quicklinksDropdown">
          {addresses.map((location) => (
            <li key={location.id} className="dropdown-submenu">
              <a className="dropdown-item dropdown-toggle" href="#" data-bs-toggle="dropdown">
                {location.title}
              </a>
              <ul className="dropdown-menu">
                {location.submenu.map((item, index) => (
                  <li key={index} className="dropdown-item" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '10px' }}>
                    {item.type && <strong>{item.type}</strong>}
                    {item.address && <p>{item.address}</p>}
                    {item.contact && <p>Contact: {item.contact}</p>}
                    {item.email && <p>Email: <a href={`mailto:${item.email}`}>{item.email}</a></p>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </li>
    );

  };




  const ProductsIcon = () => {
    const links = [
      {
        id: "1",
        title: "Polyester Films(BOPET)",
        subMenu: [
          { title: "Shrink PET Films", link: "https://www.garwarehitechfilms.com/polyester-films/shrink-pet-films" },
          { title: "Lidding", link: "https://www.garwarehitechfilms.com/polyester-films/lidding-films" },
          { title: "Liner", link: "https://www.garwarehitechfilms.com/polyester-films/liner" },
          { title: "Electrical & Electronics", link: "https://www.garwarehitechfilms.com/polyester-films/electrical-and-electronics" },
          { title: "Metallized Films", link: "https://www.garwarehitechfilms.com/polyester-films/metallized-films" },
          { title: "Graphics", link: "https://www.garwarehitechfilms.com/polyester-films/graphics-films" },
          { title: "Thermal", link: "https://www.garwarehitechfilms.com/polyester-films/thermal-films" },
          { title: "Packaging", link: "https://www.garwarehitechfilms.com/polyester-films/packaging-films" },
        ],
      },
      {
        id: "2",
        title: "Paint Protection Films",
        subMenu: [
          { title: "Plus PPF", link: "https://www.garwarehitechfilms.com/paint-protection-films/plus-ppf" },
          { title: "Premium PPF", link: "https://www.garwarehitechfilms.com/paint-protection-films/premium-ppf" },
          { title: "Matte PPF", link: "https://www.garwarehitechfilms.com/paint-protection-films/matte-ppf" },
          { title: "Black PPF", link: "https://www.garwarehitechfilms.com/paint-protection-films/black-ppf" },
          { title: "White PPF", link: "https://www.garwarehitechfilms.com/paint-protection-films/white-ppf" },
          { title: "Titanium PPF", link: "https://www.garwarehitechfilms.com/paint-protection-films/titanium-ppf" },
        ],
      },
      {
        id: "3",
        title: "Architectural Films",
        subMenu: [
          { title: "Platina Films", link: "https://www.garwarehitechfilms.com/architectural-films" },
          { title: "Premium Films", link: "https://www.garwarehitechfilms.com/architectural-films" },
          { title: "Classic Films", link: "https://www.garwarehitechfilms.com/architectural-films" },
        ],
      },
      {
        id: "4",
        title: "Sun Control Films",
        subMenu: [
          { title: "Ice Cool Elite SG", link: "https://www.garwarehitechfilms.com/sun-control-films/ice-cool-elite-sg" },
          { title: "Artic Cool SG", link: "https://www.garwarehitechfilms.com/sun-control-films/artic-cool-sg" },
          { title: "Ice Cool Shield SG", link: "https://www.garwarehitechfilms.com/sun-control-films/ice-cool-shield-sg" },
        ],
      },
    ];

    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle d-flex align-items-center"
          href="#"
          id="productsDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="d-flex flex-column align-items-center">
            <HiOutlineShoppingBag className="navbar-icon me-1" />
            <span className="header1">Our Products</span>
          </span>

        </a>
        <ul className="dropdown-menu" aria-labelledby="productsDropdown">
          {links.map((link) => (
            <li key={link.id} className="dropdown-submenu">
              <a
                className="dropdown-item dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
              >
                {link.title}
              </a>
              <ul className="dropdown-menu">
                {link.subMenu.map((subItem, index) => (
                  <li key={index}>
                    <a
                      className="dropdown-item"
                      href={subItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {subItem.title}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </li>
    );
  };




  const ITServiceDropdown = () => {
    const navigate = useNavigate();


    const [serviceTypes, setServiceTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const fetchServiceTypes = async () => {
        setIsLoading(true);
        try {
          const url = `${ConnectMe.BASE_URL}/it/api/service-types`;
          const token = getTokenFromLocalStorage();
          const headers = { Authorization: `Bearer ${token}` };
          const response = await apiCall("GET", url, headers);

          if (response?.data?.length) {
            setServiceTypes(response.data);
          } else {
            console.error("Failed to fetch service types, using default values.");
            setServiceTypes(sampleServiceTypes); // Fallback to sample data
          }
        } catch (error) {
          console.error("Error fetching service types:", error);
          setServiceTypes(sampleServiceTypes); // Fallback to sample data
        } finally {
          setIsLoading(false);
        }
      };

      fetchServiceTypes();
    }, []);

    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle d-flex align-items-center"
          href="#"
          id="quicklinksDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="d-flex flex-column align-items-center">
            <FiMonitor className="navbar-icon me-1" />
            <span className="header1">IT</span>
          </span>
        </a>
        <ul className="dropdown-menu" aria-labelledby="quicklinksDropdown">
          <li className="dropdown-submenu">
            <a
              className="dropdown-item dropdown-toggle"
              href="#"
              id="itRequestDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              IT Request
            </a>
            <ul className="dropdown-menu">
              {isLoading ? (
                <li className="dropdown-item">Loading...</li>
              ) : (
                serviceTypes.map((link) => (
                  <li key={link.id}>
                    <a
                      className="dropdown-item"
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/ITService", { state: { id: link.id } });
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </li>
        </ul>
      </li>
    );
  };




  const AccountsIcon = () => {
    const links = [
      {
        id: "1",
        title: "Reimbursement Form Formats:",
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
        title: "Income Tax-Related Forms:",
        subMenu: [
          {
            title:
              "Income Tax Declaration proposed investment (Proposed tax-saving investment declarations and regime selection at the beginning of the year).",
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
        title: "LTA Forms:",
        subMenu: [
          {
            title: "Formats for Leave Travel Allowance (LTA).",
            link: `${ConnectMe.img_URL}/uploads/forms/LTAFORM.xls`,
          },
        ],
      },
      {
        id: "4",
        title: "Insurance-Related Forms:",
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
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle d-flex align-items-center"
          href="#"
          id="productsDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="d-flex flex-column align-items-center">
            <AiOutlineUser className="navbar-icon me-1" />
            <span className="header1">Accounts</span>
          </span>

        </a>
        <ul className="dropdown-menu" aria-labelledby="productsDropdown">
          {links.map((link) => (
            <li key={link.id} className="dropdown-submenu">
              <a
                className="dropdown-item dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
              >
                {link.title}
              </a>
              <ul className="dropdown-menu">
                {link.subMenu.map((subItem, index) => (
                  <li key={index}>
                    <a
                      className="dropdown-item"
                      href={subItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {subItem.title}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </li>
    );
  };

  const NotificationIcon = ({ notificationCount, userDetails }) => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("");

    const notifications = [];

    // Create the list of notifications based on the counts
    if (notificationCount?.comment?.totalUnseenBDayComments > 0) {
      notifications.push({
        message: `You have ${notificationCount.comment.totalUnseenBDayComments} new birthday comment(s).`,
        type: "🎂 Birthday",
        popupType: "BDaycomments",
      });
    }
    if (notificationCount?.comment?.totalUnseenWorkAnnComments > 0) {
      notifications.push({
        message: `You have ${notificationCount.comment.totalUnseenWorkAnnComments} new work anniversary comment(s).`,
        type: "🏆 Work Anniversary",
        popupType: "WorkAnnComments",
      });
    }
    if (notificationCount?.comment?.totalUnseenJoinComments > 0) {
      notifications.push({
        message: `You have ${notificationCount.comment.totalUnseenJoinComments} new join comment(s).`,
        type: "👋 New Joiner",
        popupType: "joinComments",
      });
    }
    if (notificationCount?.Itcount > 0) {
      notifications.push({
        message: `You have ${notificationCount.Itcount} pending IT request(s).`,
        type: "💻 IT Request",
        popupType: null, // No popup for IT request
      });
    }

    // Calculate total notifications
    const totalNotifications =
      (notificationCount?.comment?.totalUnseenBDayComments || 0) +
      (notificationCount?.comment?.totalUnseenWorkAnnComments || 0) +
      (notificationCount?.comment?.totalUnseenJoinComments || 0) +
      (notificationCount?.Itcount || 0);

    // Handle notification click (open popup only if it has a popupType)
    const handleNotificationClick = (notification) => {
      if (notification.popupType) {
        setPopupType(notification.popupType);
        setShowPopup(true); // Only show popup for certain notifications
      } else {
        navigate("/service"); // Navigate if no popup is associated
      }
    };

    return (
      <div className="position-relative d-inline-block cursor-pointer">
        {/* Notification Icon */}
        <a
          onClick={() => setShowDropdown(!showDropdown)}
          className="text-dark position-relative cursor-pointer"
        >
          <IoIosNotifications size={25} className="mx-2 cursor-pointer" />
          {totalNotifications > 0 && (
            <span className="badge bg-danger rounded-circle position-absolute top-0 start-100 translate-middle">
              {totalNotifications}
            </span>
          )}
        </a>

        {/* Dropdown Notifications */}
        {showDropdown && (
          <div
            className="dropdown-menu show p-2 position-absolute end-0 mt-2 shadow-lg rounded cursor-pointer"
            style={{
              minWidth: "250px",
              zIndex: 1050,
              backgroundColor: "#fff",
              border: "1px solid #ddd",
            }}
          >
            <h6 className="dropdown-header text-primary fw-bold cursor-pointer">
              🔔 Notifications
            </h6>
            {notifications.length > 0 ? (
              notifications.map((note, index) => (
                <button
                  key={index}
                  className="dropdown-item d-flex align-items-start "
                  onClick={() => handleNotificationClick(note)} // Handle click to open the popup
                >
                  <span className="me-2">{note.type}</span>
                  <div className="flex-grow-1">
                    <p className="mb-0 small text-dark ">{note.message}</p> {/* Add cursor-pointer here */}
                  </div>
                </button>


              ))
            ) : (
              <p className="text-center text-muted small m-2">
                No new notifications
              </p>
            )}
          </div>
        )}

        {/* Send Email Popup */}
        {showPopup && (
          <SendEmailPopup
            show={showPopup} // Popup will only show if showPopup is true
            handleClose={() => setShowPopup(false)} // Close the popup when triggered
            recipient={userDetails}
            personalName={userDetails?.name}
            type={popupType}
          />
        )}
      </div>
    );

  };





  const fetchNotificationCount = async () => {
    try {
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Send query parameters for status and count
      const response = await apiCall(
        "GET",
        `${ConnectMe.BASE_URL}/it/api/getrequests?status=Pending&count=true&data=false`, // Update URL as needed
        headers
      );

      if (response.success) {
        // Set the notification count from the API response
        setNotificationCount(response.data);
      } else {
        setNotificationCount(0); // Reset to 0 if no notifications are found
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
      setNotificationCount(0); // In case of error, reset to 0
    }
  };

  const fetchQuickLinks = async () => {
    try {
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall(
        "GET",
        `${ConnectMe.BASE_URL}/qlink/quick-links`,
        headers
      );
      if (response.success) {
        const fetchedLinks = response?.data?.map((link) => ({
          id: link._id, // Make sure to store the ID for each link
          title: link.title,
          link: link.url,
        }));
        setFormData({ links: fetchedLinks });
      } else {
        console.error("Error fetching quick links.");
      }
    } catch (error) {
      console.error("Error fetching quick links:", error);
      alert("Error fetching quick links");
    }
  };

  const renderThirdLevelSubMenu = (thirdLevelSubMenu) => {
    return (
      <ul className="dropdown-menu">
        {thirdLevelSubMenu.map((item, index) => (
          <li key={index}>
            <a
              className="dropdown-item"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    );
  };


  return (
    <header className="navbar navbar-expand-lg bg-main">
      <div className="container-fluid">
        <a className="navbar-brand" onClick={(() => {
          navigate('/')
        })}>
          <img className="companylogo" src="./public/logo.png" alt="Logo" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Home Link */}
            <li className="nav-item">
              <a className="nav-link" onClick={() => navigate("/")}>
                <div className="d-flex flex-column align-items-center">
                  <AiOutlineHome className="navbar-icon" />
                  <span className="header1">Home</span>
                </div>
              </a>
            </li>

            {/* Quick Links Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                id="quicklinksDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="d-flex flex-column align-items-center">
                  <HiOutlineUserGroup className="navbar-icon me-1" />
                  <span className="header1">HR</span>
                </span>
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="quicklinksDropdown"
              >
                {formData.links.map((link) => (
                  <li key={link.id} className="dropdown-submenu">
                    <a
                      className="dropdown-item"
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.title}
                      {link.subMenu && (
                        <FiChevronDown className="submenu-arrow" />
                      )}
                    </a>
                    {link.subMenu && (
                      <ul className="dropdown-menu">
                        {link.subMenu.map((subLink, index) => (
                          <li key={index} className="dropdown-submenu">
                            <a
                              className="dropdown-item"
                              href={subLink.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {subLink.title}
                            </a>
                            {subLink.thirdLevelSubMenu &&
                              renderThirdLevelSubMenu(
                                subLink.thirdLevelSubMenu
                              )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </li>
            <ITServiceDropdown />
            <AccountsIcon />
            <ProductsIcon />
            <QuickLinksMenu />

          </ul>

          <div className="d-flex social-icons align-items-center">
            {/* <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <FaSquareXTwitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <FaLinkedinIn size={20} />
            </a> */}
            <NotificationIcon notificationCount={notificationCount} userDetails={userDetails} />

            <span className="horizontal-line"></span>

            <div className="user-profile-dropdown dropdown">
              <button
                className="btn btn-link dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={userDetails?.images?.imagePath ? `${ConnectMe.img_URL}${userDetails?.images?.imagePath}` : "./user.png"}
                  alt="Profile"
                  className="profile-img img-fluid rounded-circle border border-2 shadow-sm"
                />
              </button>
              <ul
                className="dropdown-menu p-3"
                aria-labelledby="dropdownMenuButton"
              >
                <li className="d-flex align-items-center mb-3" onClick={() => {
                  navigate("/profile");
                }}>
                  <img
                    src={userDetails?.images?.imagePath ? `${ConnectMe.img_URL}${userDetails?.images?.imagePath}` : "./user.png"}
                    alt="Profile"
                    className="profile-img img-fluid rounded-circle border border-2 shadow-sm"

                  />

                  <div className="d-flex flex-column ms-3" style={{ cursor: "pointer" }}>
                    <span className="profile-name">{userDetails?.name}</span>
                    <span className="profile-degree">
                      {userDetails?.jobTitle}
                    </span>
                  </div>
                </li>

                <li>
                  <a
                    className="btn btn-danger w-50 ms-auto"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>

            {/* <div className="notification-bell">
              <button
                className="bell-icon"
                onClick={() => {
                  navigate("/service");
                }}
              >
                <FaBell />
                {notificationCount > 0 && (
                  <span className="notification-count">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
}
