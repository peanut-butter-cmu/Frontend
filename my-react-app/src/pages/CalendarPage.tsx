import React, { useState, useRef, useEffect } from "react";
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
    // Convert string dates to Date objects
    const startDate = new Date(event.start);

    const dateKey = startDate.toLocaleDateString("en-GB", {
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
    {
      id: 1,
      title: "!!! Sent Database Assignment",
      due: "Due Today 13:00",
      highlighted: true,
      isRead: false,
    },
    {
      id: 2,
      title: "NEW Calculas is assigned",
      due: "Due 12 Mar 2024 23:59",
      isRead: false,
    },
    {
      id: 3,
      title: "Meeting Present 1",
      detail: "Every Monday , 12:00 - 13:15 PM",
      from: "From Napatsiri_p",
      group: "Group Project Boo",
      hasAction: true,
      isRead: false,
    },
    {
      id: 4,
      title: "Database Assignment",
      status: "has been submitted",
      isRead: true,
    },
  ];
};

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState([
    {
      title: "Quiz Network",
      start: "2024-11-27T11:00:00", // ISO string format
      end: "2024-11-27T12:00:00",
      idGroup: 3,
    },
    {
      title: "Assignment Prop & Stat",
      start: "2024-11-27T21:00:00", // ISO string format
      end: "2024-11-27T12:00:00",
      idGroup: 4,
    },
    {
      title: "Python For Everyone",
      start: "2024-11-28T00:00:00",
      end: "2024-11-29T23:59:00",
      idGroup: 2,
    },
    {
      title: "Database",
      start: "2024-11-28T00:00:00",
      end: "2024-11-28T23:59:00",
      idGroup: 2,
    },
    {
      title: "จ่ายค่าเทอม 2/67",
      start: "2024-11-26T11:00:00",
      end: "2024-11-26T12:00:00",
      idGroup: 1,
    },
    {
      title: "วันสุดท้ายของการ Add",
      start: "2025-03-18T00:00:00",
      end: "2025-03-18T07:00:00",
      idGroup: 1,
    },
    {
      title: "Database",
      start: "2025-02-12T00:00:00",
      end: "2025-02-12T07:00:00",
      idGroup: 5,
    },
    {
      title: "Pilates Day",
      start: "2025-02-15T09:30:00",
      end: "2025-02-15T10:30:00",
      idGroup: 7,
    },
    {
      title: "วันพีแห่งชาติ",
      start: "2024-12-15T00:00:00",
      end: "2024-12-15T23:59:00",
      idGroup: 6,
    },
    {
      title: "Quiz Network",
      start: "2025-03-27T00:00:00", // ISO string format
      end: "2025-03-27T23:59:00",
      idGroup: 3,
    },
    {
      title: "Quiz Network",
      start: "2024-12-22T00:00:00", // ISO string format
      end: "2024-12-22T23:59:00",
      idGroup: 3,
    },
  ]);

  const groupColors = [
    { idGroup: 1, key: "CMU", name: "CMU", color: "#615EFC" },
    { idGroup: 2, key: "Classroom", name: "Class", color: "#41B3A2" },
    {
      idGroup: [3],
      key: "Quiz",
      name: "Quiz",
      color: " #FF9100",
    },
    {
      idGroup: [4],
      key: "Assignment",
      name: "Assignment",
      color: " #FCC26D",
    },
    {
      idGroup: 5,
      key: "FinalMidterm",
      name: "Final & Midterm",
      color: "#FF0000",
    },
    { idGroup: 6, key: "Holiday", name: "Holiday", color: "#9DBDFF" },
    { idGroup: 7, key: "Owner", name: "Owner", color: "#D6C0B3" },
  ];

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [calendarView, setCalendarView] = useState<
    "dayGridMonth" | "timeGridDay" | "timeGridWeek"
  >("dayGridMonth");
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

  const handleViewChange = (
    newView: "dayGridMonth" | "timeGridDay" | "timeGridWeek"
  ) => {
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

  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const { idGroup } = event.extendedProps;

    // Parse start and end dates from event
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    // Format the time range
    const timeRange = `${startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;

    // Find group color
    const groupColor = groupColors.find((group) =>
      Array.isArray(group.idGroup)
        ? group.idGroup.includes(idGroup)
        : group.idGroup === idGroup
    )?.color;

    // Determine if the event is all-day
    const isAllDay =
      startDate.getHours() === 0 &&
      startDate.getMinutes() === 0 &&
      endDate.getHours() === 23 &&
      endDate.getMinutes() === 59;

    if (isAllDay) {
      return (
        <div
          style={{
            backgroundColor: groupColor,
            width: "98%", // Full width
            borderRadius: "4px",
            padding: "2px 4px",
            color: "white",
            fontWeight: "400",
            overflow: "hidden", // Ensure no overflow
            textOverflow: "ellipsis", // Truncate with ellipsis
            whiteSpace: "nowrap", // Prevent wrapping
          }}
        >
          {event.title}
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            width: "95%",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: groupColor,
              flexShrink: 0, // Prevent shrinking
            }}
          ></div>
          <span
            style={{
              color: groupColor,
              fontWeight: "400",
              overflow: "hidden", // Ensure no overflow
              textOverflow: "ellipsis", // Truncate with ellipsis
              whiteSpace: "nowrap", // Prevent wrapping
              flexGrow: 1, // Allow text to occupy remaining space
            }}
          >
            {timeRange} {event.title}
          </span>
        </div>
      );
    }
  };

  // const renderEventContent = (eventInfo: any) => {
  //   const { event } = eventInfo;
  //   const { idGroup } = event.extendedProps;
    
  //   // หา group color
  //   const groupColor = groupColors.find((group) =>
  //     Array.isArray(group.idGroup)
  //       ? group.idGroup.includes(idGroup)
  //       : group.idGroup === idGroup
  //   )?.color;
  
  //   // เช็คว่าอยู่ใน Month View หรือไม่ (ถ้าต้องการให้จางใน Month View เท่านั้น)
  //   const isMonthView = eventInfo.view.type === "dayGridMonth";
  
  //   // เช็คว่า event นี้เลยวันสิ้นสุดไปแล้วหรือยัง
  //   // ถ้า event ไม่มี end ให้ fallback เป็น start
  //   const now = new Date();
  //   const endDate = event.end ? new Date(event.end) : new Date(event.start);
  //   const isPastEvent = endDate < now;
  
  //   // สร้าง style object เพื่อควบคุมสีและ opacity
  //   const style: React.CSSProperties = {
  //     // ถ้าเป็น Month view + เลยเวลาแล้ว => opacity 0.5
  //     opacity: isMonthView && isPastEvent ? 0.5 : 1,
  //   };
  
  //   // -- ตรวจสอบ All-Day Event --
  //   const startDate = new Date(event.start);
  //   const isAllDay =
  //     startDate.getHours() === 0 &&
  //     startDate.getMinutes() === 0 &&
  //     endDate.getHours() === 23 &&
  //     endDate.getMinutes() === 59;
  
  //   if (isAllDay) {
  //     return (
  //       <div
  //         style={{
  //           ...style,                     // ใส่ style รวมถึง opacity
  //           backgroundColor: groupColor,
  //           width: "98%",
  //           borderRadius: "4px",
  //           padding: "2px 4px",
  //           color: "white",
  //           fontWeight: "400",
  //           overflow: "hidden",
  //           textOverflow: "ellipsis",
  //           whiteSpace: "nowrap",
  //         }}
  //       >
  //         {event.title}
  //       </div>
  //     );
  //   } else {
  //     // Format เวลา 
  //     const timeRange = `${startDate.toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       hour12: true,
  //     })}`;
  
  //     return (
  //       <div
  //         style={{
  //           ...style, // ใส่ style รวมถึง opacity
  //           display: "flex",
  //           alignItems: "center",
  //           gap: "4px",
  //           width: "95%",
  //         }}
  //       >
  //         <div
  //           style={{
  //             width: "8px",
  //             height: "8px",
  //             borderRadius: "50%",
  //             backgroundColor: groupColor,
  //             flexShrink: 0,
  //           }}
  //         ></div>
  //         <span
  //           style={{
  //             color: groupColor,
  //             fontWeight: "400",
  //             overflow: "hidden",
  //             textOverflow: "ellipsis",
  //             whiteSpace: "nowrap",
  //             flexGrow: 1,
  //           }}
  //         >
  //           {timeRange} {event.title}
  //         </span>
  //       </div>
  //     );
  //   }
  // };

  return (
    <div className="container">
      {/* Left Side */}
      <LeftSide style={{ flex: "0 0 16%" }} events={events} />

      {/* Calendar */}
      <div className="calendar-container">
        {/* Custom Toolbar */}
        <CustomToolbar
          label={currentViewTitle}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          onToggleRightSidebar={() => setShowNotifications((prev) => !prev)}
          unreadCount={unreadCount}
          currentView={calendarView} // <- Add this line to pass the current view state
        />

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={calendarView}
          nowIndicator={true}
          headerToolbar={false}
          events={events}
          height="100%"
          datesSet={handleDatesSet}
          eventContent={(eventInfo) => renderEventContent(eventInfo)}
          views={{
            dayGridMonth: {
              dayMaxEventRows: true, // Limit displayed events per day
              moreLinkText: "Show more", // Text for "+n more" link
            },
            timeGridWeek: {
              dayHeaderFormat: {
                weekday: "short", // SUN, MON
                day: "2-digit", // 15
              },
            },
          }}
          dayMaxEventRows={3} // Maximum events per cell
          moreLinkClick="popover" // Show remaining events in a popover
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
        <RightSide
          events={events}
          groupedEvents={groupedEvents}
          addNewEvent={addNewEvent}
        />
      )}
    </div>
  );
};

export default CalendarPage;
