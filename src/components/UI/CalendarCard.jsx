import { useState, useEffect } from "react";
import { HiArrowCircleRight } from "react-icons/hi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { SlCalender } from "react-icons/sl";
import { FaBirthdayCake, FaAward, FaHandshake, FaRegClipboard } from "react-icons/fa";
import { IoGiftOutline } from "react-icons/io5"; // New icon for Paid-Holiday
import "./CalendarCard.css";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import showToast from "../../utils/toastHelper";
import { useNavigate } from "react-router-dom";

const GARWARE_QUOTES = [
  "Innovation drives the future of industries.",
  "Garware believes in empowering individuals for growth.",
  "Sustainability is not an option; it's our responsibility.",
  "Teamwork is the foundation of our success.",
  "Leading the way in engineering excellence.",
  "Our values define our actions and achievements.",
  "Quality is at the heart of everything we do.",
  "Think big, act responsibly, and achieve greatness.",
  "Garware: Bridging tradition with innovation.",
  "Passion fuels our purpose every day."
];

export default function CalendarCard() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [randomQuotes, setRandomQuotes] = useState([]);
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
    const eventsForDate = getEventsForDate(selectedDate);
    setSelectedDateEvents(eventsForDate);

    if (eventsForDate.length === 0) {
      displayRandomQuotes();
    }
  };

  const displayRandomQuotes = () => {
    const shuffledQuotes = GARWARE_QUOTES.sort(() => 0.5 - Math.random());
    setRandomQuotes(shuffledQuotes.slice(0, 2)); // Select 2 random quotes
  };

  useEffect(() => {
    const currentMonth = date.getMonth() + 1; // JavaScript months are 0-based
    const currentYear = date.getFullYear();
    fetchEvents(currentMonth, currentYear);

    // Display events for today or random quotes if no events
    const todayEvents = getEventsForDate(date);
    setSelectedDateEvents(todayEvents);
    if (todayEvents.length === 0) {
      displayRandomQuotes();
    }
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
                  backgroundColor: getDotColor(event.type), // Set background color of dot
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
      const newMonth = activeStartDate.getMonth() + 1;
      const newYear = activeStartDate.getFullYear();
      fetchEvents(newMonth, newYear);
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
      "Paid-Holiday": <IoGiftOutline className="event-icon" />, // Holiday icon for Paid-Holiday
    };
    return iconClass[eventType] || <FaRegClipboard className="event-icon" />;
  };

  // Function to return color based on event type
  const getDotColor = (eventType) => {
    const colorMap = {
      CSR: "#007bff", // Blue for CSR
      Award: "#28a745", // Green for Award
      Announcement: "#ffc107", // Yellow for Announcement
      "Paid-Holiday": "#17a2b8", // Info color for Paid-Holiday
    };

    return colorMap[eventType] || "#6c757d"; // Default color if no match
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
          <div className="quote-list mt-3">
            <h6>No events for {date.toDateString()}:</h6>
            <ul>
              {randomQuotes.map((quote, index) => (
                <li key={index} className="text-primary">
                  {quote}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
