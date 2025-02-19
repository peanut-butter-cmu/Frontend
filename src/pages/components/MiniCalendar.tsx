import React, { useState, useEffect } from "react";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSMCalendar } from "smart-calendar-lib";

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  groups: (number | string)[];
}

interface Group {
  id: number | string;
  color: string;
}

interface MiniCalendarProps {
  onDateSelect: (date: string) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [_isLoaded, setIsLoaded] = useState(false);
  const smCalendar = useSMCalendar();
  const stableCalendar = React.useMemo(() => smCalendar, []);

  // ฟังก์ชันสำหรับดึงข้อมูลตามช่วงวันที่ที่กำหนด
  const fetchEventsDynamic = async (startDate: Date, endDate: Date) => {
    try {
  
      const fetchedEvents = await smCalendar.getEvents(startDate, endDate);
      const fetchedGroups = await smCalendar.getGroups();
      
      if (Array.isArray(fetchedGroups)) {
        const formattedGroups: Group[] = fetchedGroups.map((group: any) => ({
          id: group.id,
          title: group.title,
          color: group.color,
          colorts: group.colorts || group.color, 
        }));
        setGroups(formattedGroups);
      } else if ((fetchedGroups as any).groups) {
        const formattedGroups: Group[] = ((fetchedGroups as { groups: any[] }).groups).map((group: any) => ({
          id: group.id,
          title: group.title,
          color: group.color,
          colorts: group.colorts || group.color,
        }));
        setGroups(formattedGroups);
      }
      
      const eventsArray = Array.isArray(fetchedEvents)
        ? fetchedEvents
        : (fetchedEvents as { events: CalendarEvent[] }).events;

      if (!Array.isArray(eventsArray)) {
        throw new Error("Expected events to be an array");
      }

      console.log("Fetched Events:", fetchedEvents);
      console.log("Fetched Groups:", fetchedGroups);

      const formattedEvents = eventsArray.map((event: any) => ({
        title: event.title,
        start: event.start || event.date,
        end: event.end || event.date,
        groups: Array.isArray(event.groups) ? event.groups : [event.groups],
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    const startDate = currentMonth.clone().subtract(1, "month").set("date", 15).toDate();
    const endDate = currentMonth.clone().add(1, "month").set("date", 15).toDate();
    fetchEventsDynamic(startDate, endDate);
  }, [currentMonth, stableCalendar]);
  

  const groupedDots = events.reduce<Record<string, Set<string>>>((acc, event) => {
    const eventDate = moment(event.start).format("YYYY-MM-DD");
    if (!acc[eventDate]) acc[eventDate] = new Set();

    event.groups.forEach((groupId) => {
      const matchingGroup = groups.find((g) => String(g.id) === String(groupId));
      if (matchingGroup && matchingGroup.color) {
        acc[eventDate].add(matchingGroup.color);
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
    <div className="mini-calendar" style={{ textAlign: "center", padding: "1px" }}>
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
                  <span key={i} style={{ ...styles.dot, backgroundColor: color }} />
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
