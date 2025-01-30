import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import "./CalendarViewAll.css";
import { MdOutlineDateRange } from "react-icons/md";
import { FaAward } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";

export default function CalendarViewAll() {
  const location = useLocation();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = location.state?.events || [];

  // Group events by month
  const groupedEvents = events.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const monthKey = eventDate.toLocaleString("default", { month: "long" });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(event);
    return acc;
  }, {});

  const handleMonthChange = (e) => {
    const monthKey = e.target.value;
    setSelectedMonth(monthKey);
    const element = document.getElementById(monthKey);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShowModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  return (
    <div className="calendar-view-all">
      <div className="header">
        <h3></h3>
        <Form.Select
          onChange={handleMonthChange}
          value={selectedMonth || ""}
          className="month-dropdown"
        >
          <option value="" disabled>
            Select a Month
          </option>
          {Object.keys(groupedEvents).map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </Form.Select>
      </div>

      {Object.entries(groupedEvents).map(([month, monthEvents], index) => (
        <div key={index} id={month} className="month-section">
          {/* Month Title */}
          <div className="date-line">
            <span className="month-title">{month}</span>
            <hr />
          </div>

          {/* Events for this Month */}
          {monthEvents.map((event, idx) => {
            const eventDate = new Date(event.date);
            const day = eventDate
              ? eventDate
                  .toLocaleString("default", { weekday: "short" })
                  .toUpperCase()
              : "N/A";
            const dayNumber =
              eventDate && !isNaN(eventDate.getDate())
                ? eventDate.getDate()
                : "N/A";

            return (
              <div key={idx} className="event-details"  >
                <div className="event-details-card">
                  {/* Event Date Section */}
                  <div className="event-date">
                    <div className="event-date-box">
                      <span className="event-day">{day}</span>
                      <span className="event-day-number">{dayNumber}</span>
                    </div>
                  </div>

                  {/* Vertical Border and Event Info */}

                  <div className="event-info">
                    <p className="event-date-time">
                      <MdOutlineDateRange />{" "}
                      {dayNumber !== "N/A" && month
                        ? `${dayNumber} ${month} ${eventDate.getFullYear()}`
                        : "Date Unavailable"}
                    </p>
                    <h3 className="event-title">{event.title || "No Title"}</h3>

                    {event.description && (
                      <p className="event-description">{event.description}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered animation>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="d-flex align-items-center">
          <FaAward className="me-2" /> {selectedEvent?.title || "Event Details"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container>
          <Row className="mb-3">
            <Col xs={2} className="text-primary">
              <MdOutlineDateRange size={24} />
            </Col>
            <Col>
              <strong>Date:</strong>{" "}
              {selectedEvent?.date
                ? new Date(selectedEvent.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={2} className="text-primary">
              <FaAward size={24} />
            </Col>
            <Col>
              <strong>Type:</strong> {selectedEvent?.type || "N/A"}
            </Col>
          </Row>

          {selectedEvent?.description && (
            <Row className="mb-3">
              <Col xs={2} className="text-primary">
                <BiDetail size={24} />
              </Col>
              <Col>
                <strong>Description:</strong> {selectedEvent.description}
              </Col>
            </Row>
          )}
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    </div>

  );
}
