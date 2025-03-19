import React, { useEffect, useState, useRef } from "react";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";

export default function PhotoGallery() {
  const [activeTab, setActiveTab] = useState("Announcements");
  const [data, setData] = useState({ Announcements: [], CsrType: [], Awards: [] });
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedItemImages, setSelectedItemImages] = useState([]);
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

  // ✅ Open Modal (Set images of same title)
  const openModal = (images, index) => {
    setSelectedItemImages(images);
    setSelectedImageIndex(index);
  };

  // ✅ Handle Left/Right Navigation within Same Title
  const handleNextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) =>
        prevIndex + 1 < selectedItemImages.length ? prevIndex + 1 : 0
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) =>
        prevIndex - 1 >= 0 ? prevIndex - 1 : selectedItemImages.length - 1
      );
    }
  };

  // ✅ Handle Key Navigation
  const handleKeyDown = (e) => {
    if (selectedImageIndex !== null) {
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "Escape") setSelectedImageIndex(null);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, selectedItemImages]);

  // ✅ Styles
  const imageStyle = {
    cursor: "pointer",
    objectFit: "cover",
    height: "250px",
    width: "100%",
    transition: "transform 0.3s ease-in-out",
  };

  const thumbnailStyle = {
    cursor: "pointer",
    objectFit: "cover",
    height: "60px",
    width: "60px",
    marginRight: "5px",
    borderRadius: "8px",
    border: "2px solid #ddd",
    transition: "transform 0.2s ease-in-out",
  };

  return (
    <div className="container py-5">
      {/* ✅ Tab Navigation */}
      <ul className="nav nav-pills justify-content-end mb-4">
        {["Announcements", "CSR", "Awards"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* ✅ Image Cards */}
      <div className="row g-4">
        {data[activeTab]?.map((item) => (
          <div key={item._id} className="col-12 col-sm-6 col-md-4">
            <div className="card border-0 shadow-lg">
              {item.images?.length > 0 && (
                item.images[0].imagePath.toLowerCase().endsWith('.mp4') ? (
                  <video
                    src={`${ConnectMe.img_URL}${item.images[0].imagePath}`}
                    style={imageStyle}
                    controls
                    onClick={() => openModal(item.images, 0)}
                  />
                ) : (
                  <img
                    src={`${ConnectMe.img_URL}${item.images[0].imagePath}`}
                    alt="Gallery Item"
                    style={imageStyle}
                    onClick={() => openModal(item.images, 0)}
                  />
                )
              )}
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">
                  {new Date(item.AnnouncementDate).toLocaleDateString("en-GB")}
                </p>
                <div className="d-flex justify-content-center mt-2">
                  {item.images?.slice(1).map((img, imgIndex) => {
                    const isVideo = img.imagePath.toLowerCase().endsWith('.mp4');
                    return isVideo ? (
                      <video
                        key={imgIndex}
                        src={`${ConnectMe.img_URL}${img.imagePath}`}
                        style={thumbnailStyle}
                        controls
                        onClick={() => openModal(item.images, imgIndex + 1)}
                      />
                    ) : (
                      <img
                        key={imgIndex}
                        src={`${ConnectMe.img_URL}${img.imagePath}`}
                        alt="Thumbnail"
                        style={thumbnailStyle}
                        onClick={() => openModal(item.images, imgIndex + 1)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* ✅ Infinite Scroll Loader */}
      <div id="scroll-trigger" className="text-center my-3">
        {loading && <div className="spinner-border text-primary"></div>}
      </div>

      {/* ✅ Modal */}
      {selectedImageIndex !== null && (
  <div
    className="modal fade show d-block"
    onClick={() => setSelectedImageIndex(null)}
    style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content bg-transparent border-0">
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-3"
          onClick={() => setSelectedImageIndex(null)}
        ></button>
        <div className="text-center p-3">
          {selectedItemImages[selectedImageIndex].imagePath.toLowerCase().endsWith('.mp4') ? (
            <video
              src={`${ConnectMe.img_URL}${selectedItemImages[selectedImageIndex].imagePath}`}
              className="img-fluid rounded"
              style={{
                objectFit: "contain",
                maxHeight: "90vh",
              }}
              controls
              autoPlay
            />
          ) : (
            <img
              src={`${ConnectMe.img_URL}${selectedItemImages[selectedImageIndex].imagePath}`}
              alt="Enlarged View"
              className="img-fluid rounded"
              style={{
                objectFit: "contain",
                maxHeight: "90vh",
              }}
            />
          )}
        </div>
        <div className="modal-footer justify-content-center">
          <button className="btn btn-danger" onClick={() => setSelectedImageIndex(null)}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}



    </div>
  );
}
