import React, { useState , useRef , useEffect} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import Nofitications from "./Notifications";
import CustomToolbar from "./components/CustomToolbar";
import "./CalendarPage.css";
import { get_events } from "smart-calendar-lib";
import { Event } from "smart-calendar-lib";

// ฟังก์ชันจัดกลุ่ม Events ตามวันที่
const groupEventsByDate = (events: Event[]): Record<string, Event[]> => {
  return events.reduce((acc: Record<string, Event[]>, event: Event) => {
    const dateKey = event.start.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});
};

const fetchNotifications = async () => {
  return [
    { id: 1, title: "!!! Sent Database Assignment", due: "Due Today 13:00", highlighted: true, isRead: false },
    { id: 2, title: "NEW Calculas is assigned", due: "Due 12 Mar 2024 23:59", isRead: false },
    { id: 3, title: "Meeting Present 1", detail: "Every Monday , 12:00 - 13:15 PM", from: "From Napatsiri_p", group: "Group Project Boo", hasAction: true, isRead: false },
    { id: 4, title: "Database Assignment", status: "has been submitted", isRead: true },
  ];
};


const CalendarPage: React.FC = () => {
  const [events, setEvents] = React.useState<Event[]>([]);
  // (async () => setEvents(await get_events({
  //   username: "napatsiri_p",
  //   password: ""
  // })))();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [calendarView, setCalendarView] = useState<"dayGridMonth" | "dayGridDay" | "timeGridWeek">("dayGridMonth");
  const [currentViewTitle, setCurrentViewTitle] = useState(""); // จัดเก็บ Title ปัจจุบัน
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await get_events({ username: "napatsiri_p", password: "" });
      setEvents(data);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    };
    fetchData();
  }, []);

  const handleUnreadCountChange = (newCount: number) => {
    setUnreadCount(newCount);
  };

  // อัปเดต Title ปัจจุบันเมื่อ View หรือวันที่เปลี่ยน
  const handleDatesSet = (arg: any) => {
    setCurrentViewTitle(arg.view.title);
  };

  const handleNavigate = (action: string) => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    if (action === "TODAY") calendarApi.today();
    if (action === "PREV") calendarApi.prev();
    if (action === "NEXT") calendarApi.next();
  };

  const handleViewChange = (newView: "dayGridMonth" | "dayGridDay" | "timeGridWeek") => {
    setCalendarView(newView);
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.changeView(newView);
    setCurrentViewTitle(calendarApi?.view.title);
  };
  
  const addNewEvent = (newEvent: Event) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  // จัดกลุ่ม Events ตามวันที่
  const groupedEvents = groupEventsByDate(events);

  return (
    <div className="container">
      {/* Left Side */}
      <LeftSide style={{ flex: "0 0 16%" }} events={events}/>

      {/* Calendar */}
      <div className="calendar-container">
        {/* Custom Toolbar */}
        <CustomToolbar
  label={currentViewTitle}
  onNavigate={handleNavigate}
  onView={handleViewChange}
  onToggleRightSidebar={() => setShowNotifications((prev) => !prev)}
  unreadCount={unreadCount}
  currentView={calendarView}  // <- Add this line to pass the current view state
/>

        <FullCalendar
        ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={calendarView}
          headerToolbar={false}
          events={events}
          height="100%"
          datesSet={handleDatesSet}
          views={{
            timeGridWeek: {
              dayHeaderFormat: { 
                weekday: 'short', // SUN, MON
                day: '2-digit',   // 15
              },
            },
          }}
        />
      </div>

      {/* Right Sidebar */}
      {showNotifications ? (
  <Nofitications
    notifications={notifications}
    onUnreadCountChange={handleUnreadCountChange}
    setNotifications={setNotifications}
  />
) : (
      <RightSide events={events} groupedEvents={groupedEvents} addNewEvent={addNewEvent} />
      
    )}
    </div>
  );
};

export default CalendarPage;