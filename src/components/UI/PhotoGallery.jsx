import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PhotoGallery() {
  const [activeTab, setActiveTab] = useState("announcements");

  const data = {
    announcements: [
      { type: "image", src: "https://picsum.photos/200" },
      { type: "video", src: "/videos/csr1.mp4" },
      { type: "image", src: "https://picsum.photos/200" },
      { type: "image", src: "https://picsum.photos/200" },
    ],
    csr: [
      { type: "image", src: "https://picsum.photos/200" },
      { type: "video", src: "/videos/csr1.mp4" },
      { type: "image", src: "https://picsum.photos/200" },
    ],
    awards: [
      { type: "image", src: "https://picsum.photos/200" },
      { type: "video", src: "/videos/csr1.mp4" },
      { type: "image", src: "https://picsum.photos/200" },
    ],
  };

  return (
    <div className="container py-4">
      {/* Title */}
      <h3 className="text-center mb-4">Photo Gallery</h3>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4 justify-content-center">
        {["announcements", "csr", "awards"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${
                activeTab === tab ? "active" : ""
              } text-capitalize`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* Grid Content */}
      <div className="row g-3">
        {data[activeTab].map((item, index) => (
          <div
            key={index}
            className="col-12 col-sm-6 col-md-4 d-flex justify-content-center"
          >
            {item.type === "image" ? (
              <img
                src={item.src}
                alt="Gallery Item"
                className="img-fluid rounded shadow"
                style={{ objectFit: "cover", height: "200px", width: "100%" }}
              />
            ) : (
              <video
                src={item.src}
                controls
                className="img-fluid rounded shadow"
                style={{ objectFit: "cover", height: "200px", width: "100%" }}
              ></video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
