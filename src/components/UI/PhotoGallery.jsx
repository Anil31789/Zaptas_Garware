import React, { useEffect, useState, useRef } from "react";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";

export default function PhotoGallery() {
  const [activeTab, setActiveTab] = useState("Announcements");
  const [data, setData] = useState({ Announcements: [], CsrType: [], Awards: [] });
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef(null);
  const [totalPages, setTotalPages] = useState(null);

  // ✅ Fetch data when activeTab changes
  useEffect(() => {
    setPage(1);
    setData((prevData) => ({ ...prevData, [activeTab]: [] }));
    fetchData(1);
  }, [activeTab]);

  // ✅ Intersection Observer for Infinite Scroll
  useEffect(() => {
    observer.current = new IntersectionObserver(handleScroll, { threshold: 1.0 });
    if (document.getElementById("scroll-trigger")) {
      observer.current.observe(document.getElementById("scroll-trigger"));
    }
    return () => observer.current?.disconnect();
  }, [data]);

  // ✅ Fetch Data Function
  const fetchData = async (pageNum) => {
    if (loading || (totalPages !== null && pageNum > totalPages)) return;
    setLoading(true);

    try {
      const url = `${ConnectMe.BASE_URL}/photosVideos/${activeTab}?limit=9&page=${pageNum}`;
      const token = getTokenFromLocalStorage();
      const headers = { Authorization: `Bearer ${token}` };

      const response = await apiCall("GET", url, headers);
      if (response.success) {
        const newData = response.data?.data || [];

        if (newData.length === 0) return;

        // ✅ Sort data in descending order by date
        newData.sort((a, b) => {
          const dateA = new Date(a.AnnouncementDate || a.updatedAt || a.createdAt);
          const dateB = new Date(b.AnnouncementDate || b.updatedAt || b.createdAt);
          return dateB - dateA;
        });

        setData((prevData) => ({
          ...prevData,
          [activeTab]: [...prevData[activeTab], ...newData],
        }));
        setPage(pageNum);
        setTotalPages(response.data.totalPages);
      } else {
        showToast(`Failed to load ${activeTab}`, "error");
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error.message);
      showToast(`Error fetching ${activeTab}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Infinite Scroll Handler
  const handleScroll = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading) {
      fetchData(page + 1);
    }
  };

  // ✅ Styles
  const imageStyle = {
    cursor: "pointer",
    objectFit: "cover",
    height: "250px",
    width: "100%",
    transition: "transform 0.3s ease-in-out",
  };

  const cardStyle = {
    transition: "transform 0.3s ease-in-out",
  };

  const cardHoverStyle = {
    transform: "scale(1.03)",
  };

  const navLinkStyle = {
    borderRadius: "30px",
    padding: "10px 20px",
  };

  const navLinkActiveStyle = {
    backgroundColor: "#007bff",
    borderRadius: "30px",
    color: "white",
  };

  return (
    <div className="container py-5">
      {/* ✅ Tab Navigation */}
      <ul className="nav nav-pills justify-content-end mb-4">
        {["Announcements", "CSR", "Awards"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""} text-capitalize fs-6`}
              onClick={() => setActiveTab(tab)}
              style={activeTab === tab ? navLinkActiveStyle : navLinkStyle}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* ✅ Image Cards */}
      <div className="row g-4">
        {data[activeTab]?.flatMap((item) =>
          item?.images?.map((img, imgIndex) => (
            <div key={`${item._id}-${imgIndex}`} className="col-12 col-sm-6 col-md-4">
              <div
                className="card border-0 shadow-lg overflow-hidden h-100"
                style={cardStyle}
                onMouseEnter={(e) => (e.currentTarget.style.transform = cardHoverStyle.transform)}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
              >
                {/* ✅ Image */}
                <img
                  src={`${ConnectMe.img_URL}${img.imagePath}`}
                  alt="Gallery Item"
                  className="img-fluid rounded zoom-effect shadow-sm"
                  style={imageStyle}
                  onClick={() => setSelectedImage(`${ConnectMe.img_URL}${img.imagePath}`)}
                />

                {/* ✅ Card Content */}
                <div className="card-body">
                  <h5
                    className="card-title text-center mb-3 text-primary"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </h5>

                  {/* ✅ Date Display */}
                  <p className="card-text text-center text-muted">
                    {item.AnnouncementDate ? (
                      <span className="d-block">
                        {new Date(item.AnnouncementDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : item.updatedAt ? (
                      <span className="d-block">
                        Updated On:{" "}
                        {new Date(item.updatedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : item.createdAt ? (
                      <span className="d-block">
                        Created On:{" "}
                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Infinite Scroll Loader */}
      <div id="scroll-trigger" className="text-center my-3">
        {loading && <div className="spinner-border text-primary" role="status"></div>}
      </div>

      {/* ✅ Modal for Enlarged Image */}
      {selectedImage && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          onClick={() => setSelectedImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-transparent border-0 shadow-lg">
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-3"
                onClick={() => setSelectedImage(null)}
              ></button>
              <img
                src={selectedImage}
                alt="Enlarged View"
                className="img-fluid rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
      {selectedImage && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}
