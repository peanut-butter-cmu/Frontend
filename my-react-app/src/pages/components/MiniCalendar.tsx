import React, { useState } from "react";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  color: string;
  group: string;
}

interface MiniCalendarProps {
  events: CalendarEvent[];
  groupColors: Record<string, string>;
  onDateSelect: (date: string) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  onDateSelect,
  events,
  groupColors,
}) => {
  const [currentMonth, setCurrentMonth] = useState(moment());

  // จัดกลุ่ม Event ตามวันที่และสีของกลุ่ม
  const groupedDots = events.reduce((acc: Record<string, Set<string>>, event) => {
    const eventDate = moment(event.start).format("YYYY-MM-DD");
    if (!acc[eventDate]) acc[eventDate] = new Set();
    const groupColor = groupColors[event.group];
    if (groupColor) acc[eventDate].add(groupColor);
    return acc;
  }, {});

  const generateCalendar = () => {
    const startOfMonth = currentMonth.clone().startOf("month").startOf("week");
    const endOfMonth = currentMonth.clone().endOf("month").endOf("week");

    const calendar = [];
    let day = startOfMonth.clone();
    while (day.isBefore(endOfMonth, "day")) {
      calendar.push(day.clone());
      day.add(1, "day");
    }
    return calendar;
  };

  const handlePreviousMonth = () => setCurrentMonth(currentMonth.clone().subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.clone().add(1, "month"));
  const isToday = (date: moment.Moment) => moment().isSame(date, "day");

  return (
    <div style={{ textAlign: "center", padding: "10px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={styles.navButton} onClick={handlePreviousMonth}>
          <ArrowBackIcon style={{ fontSize: "14px" }} />
        </button>
        <h4 style={styles.monthTitle}>{currentMonth.format("MMMM YYYY")}</h4>
        <button style={styles.navButton} onClick={handleNextMonth}>
          <ArrowForwardIcon style={{ fontSize: "14px" }} />
        </button>
      </div>

      {/* Days Header */}
      <div style={styles.daysHeader}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} style={styles.dayLabel}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={styles.calendarGrid}>
        {generateCalendar().map((day, index) => {
          const dots = Array.from(groupedDots[day.format("YYYY-MM-DD")] || []);
          return (
            <div
              key={index}
              style={{
                ...styles.calendarDay,
                ...(isToday(day) ? styles.today : {}),
              }}
              onClick={() => onDateSelect(day.format("YYYY-MM-DD"))}
            >
              {day.date()}
              {/* Dots */}
              <div style={styles.dotsContainer}>
                {dots.slice(0, 3).map((color, i) => (
                  <span
                    key={i}
                    style={{
                      ...styles.dot,
                      backgroundColor: color,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  navButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "3px 6px",
  },
  monthTitle: {
    margin: "0",
    fontSize: "17px",
    fontWeight: "500",
  },
  daysHeader: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#888",
  },
  dayLabel: { textAlign: "center" as const },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    marginTop: "10px",
  },
  calendarDay: {
    position: "relative" as const,
    width: "30px",
    height: "30px",
    lineHeight: "30px",
    textAlign: "center" as const,
    fontSize: "14px",
    borderRadius: "50%",
    margin: "0 auto",
  },
  today: { backgroundColor: "black", color: "white" },
  dotsContainer: {
    display: "flex",
    justifyContent: "center",
    position: "absolute" as "absolute",
    bottom: "2px",
    left: "0",
    right: "0",
  },
  dot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    margin: "1px",
  },
};

export default MiniCalendar;
