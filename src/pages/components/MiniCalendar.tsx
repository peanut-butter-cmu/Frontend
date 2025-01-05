import React, { useState } from "react";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  groups: string[]; // Assuming groups is an array of strings
}

interface MiniCalendarProps {
  events: CalendarEvent[];
  onDateSelect: (date: string) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  onDateSelect,
  events,
}) => {
  const [currentMonth, setCurrentMonth] = useState(moment());

  const groupColors = [
    {
      groups: "8a9e8a40-9e8e-4464-8495-694b0012af80",
      key: "CMU",
      name: "CMU",
      color: "#615EFC",
    },
    {
      groups: "53adc81a-1089-4e84-a1c4-a77d1e1434c3",
      key: "Classroom",
      name: "Class",
      color: "#41B3A2",
    },
    {
      groups: ["427b92fc-d055-4109-b164-ca9313c2ee95"],
      key: "Quiz",
      name: "Quiz",
      color: " #FF9100",
    },
    {
      groups: ["6121a9c8-ec3f-47aa-ba8b-fbd28ccf27c8"],
      key: "Assignment",
      name: "Assignment",
      color: " #FCC26D",
    },
    {
      groups: "9314e483-dc11-438f-8855-046755ac0b64",
      key: "Final",
      name: "Final",
      color: "#FF0000",
    },
    {
      groups: "a9c0c854-f59f-47c7-b75d-c35c568856cd",
      key: "Midterm",
      name: "Midterm",
      color: "#FF0000",
    },
    {
      groups: "0bee62f7-4f9f-4735-92ac-2041446aac91",
      key: "Holiday",
      name: "Holiday",
      color: "#9DBDFF",
    },
    {
      groups: "156847db-1b7e-46a3-bc4f-15c19ef0ce1b",
      key: "Owner",
      name: "Owner",
      color: "#D6C0B3",
    },
  ];

  // Group events by date and map their colors
  const groupedDots = events.reduce<Record<string, Set<string>>>((acc, event) => {
    const eventDate = moment(event.start).format("YYYY-MM-DD");
    if (!acc[eventDate]) acc[eventDate] = new Set();

    event.groups.forEach((groupId) => {
      const group = groupColors.find((g) =>
        Array.isArray(g.groups)
          ? g.groups.includes(groupId)
          : g.groups === groupId
      );
      if (group) {
        acc[eventDate].add(group.color); // Add the color for the group
      }
    });

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

  const handlePreviousMonth = () =>
    setCurrentMonth(currentMonth.clone().subtract(1, "month"));
  const handleNextMonth = () =>
    setCurrentMonth(currentMonth.clone().add(1, "month"));
  const isToday = (date: moment.Moment) => moment().isSame(date, "day");

  return (
    <div
      className="mini-calendar"
      style={{ textAlign: "center", padding: "1px" }}
    >
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
              <div style={styles.dotsContainer}>
                {dots.map((color, i) => (
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
    fontWeight: "300",
  },
  daysHeader: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    fontWeight: "400",
    fontSize: "12px",
    color: "#888",
  },
  dayLabel: { textAlign: "center" as const },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    marginTop: "5px",
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
  today: { backgroundColor: "black", color: "white", fontWeight: "500" },
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
