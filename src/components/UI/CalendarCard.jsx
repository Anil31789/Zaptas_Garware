import { useState, useEffect } from "react";
import { HiArrowCircleRight } from "react-icons/hi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { SlCalender } from "react-icons/sl";
import { FaAward, FaHandshake, FaRegClipboard } from "react-icons/fa";
import { IoGiftOutline } from "react-icons/io5"; // Icon for Paid-Holiday
import "./CalendarCard.css";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import showToast from "../../utils/toastHelper";
import { useNavigate } from "react-router-dom";

export default function CalendarCard() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async (month, year) => {
    try {
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const url = `${ConnectMe.BASE_URL}/calendar/holidays?active=true&month=${month}&year=${year}`;
      const response = await apiCall("GET", url, headers);

      if (response.success) {
        setEvents(response?.data);
      } else {
        showToast("Failed to load holidays", "error");
      }
    } catch (error) {
      console.error("Error fetching events:", error.message);
    }
  };

  const getEventsForDate = (date) => {
    return events.filter(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (selectedDate) => {
    setDate(selectedDate);
    setSelectedDateEvents(getEventsForDate(selectedDate));
  };

  useEffect(() => {
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    fetchEvents(currentMonth, currentYear);
    setSelectedDateEvents(getEventsForDate(date));
  }, [date]);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const eventsForDate = getEventsForDate(date);
      if (eventsForDate.length > 0) {
        return (
          <div className="event-dots">
            {eventsForDate.slice(0, 2).map((event, index) => (
              <span
                key={index}
                className={`event-dot ${event.type.toLowerCase()}`}
                style={{
                  backgroundColor: getDotColor(event.type),
                }}
              />
            ))}
            {eventsForDate.length > 2 && (
              <span className="more-events">+{eventsForDate.length - 2}</span>
            )}
          </div>
        );
      }
    }
  };

  const handleActiveStartDateChange = ({ activeStartDate, view }) => {
    if (view === "month") {
      fetchEvents(activeStartDate.getMonth() + 1, activeStartDate.getFullYear());
    }
  };

  const renderEventTypeBadge = (eventType) => {
    const typeClass = {
      CSR: "badge bg-primary",
      Award: "badge bg-success",
      Announcement: "badge bg-warning",
      "Paid-Holiday": "badge bg-info",
    };
    return <span className={typeClass[eventType] || "badge bg-secondary"}>{eventType}</span>;
  };

  const renderEventIcon = (eventType) => {
    const iconClass = {
      CSR: <FaHandshake className="event-icon" />,
      Award: <FaAward className="event-icon" />,
      Announcement: <FaRegClipboard className="event-icon" />,
      "Paid-Holiday": <IoGiftOutline className="event-icon" />,
    };
    return iconClass[eventType] || <FaRegClipboard className="event-icon" />;
  };

  const getDotColor = (eventType) => {
    const colorMap = {
      CSR: "#007bff",
      Award: "#28a745",
      Announcement: "#ffc107",
      "Paid-Holiday": "#17a2b8",
    };

    return colorMap[eventType] || "#6c757d";
  };

  return (
    <div className="card mb-3 calendar-card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <SlCalender className="me-2" />
          <h5 className="mb-0">Calendar</h5>
        </div>
        <a
          href="#"
          className="text-decoration-none"
          onClick={(e) => {
            e.preventDefault();
            navigate("/calendar-view-all", { state: { events } });
          }}
        >
          View All <HiArrowCircleRight />
        </a>
      </div>
      <div className="card-body card-scroll">
        <Calendar
          onChange={handleDateClick}
          value={date}
          tileContent={tileContent}
          onActiveStartDateChange={handleActiveStartDateChange}
        />
        {selectedDateEvents.length > 0 ? (
          <div className="event-list mt-3">
            <h6>Events on {date.toDateString()}:</h6>
            <ul className="list-group">
              {selectedDateEvents.map((event, index) => (
                <li key={index} className="list-group-item d-flex align-items-center">
                  {renderEventIcon(event.type)}
                  <div className="ms-3 d-flex align-items-center" style={{ fontWeight: 'light', fontSize: '0.75rem' }}>
                    <p className="text-dark mb-0" style={{ fontSize: '0.90rem' }}>{event.title}</p> -{" "}
                    {renderEventTypeBadge(event.type)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-3">
            <h6>No events for {date.toDateString()}.</h6>
          </div>
        )}
      </div>
    </div>
  );
}
