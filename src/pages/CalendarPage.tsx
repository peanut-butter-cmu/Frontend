import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import RightSide from "./RightSide";
import Nofitications from "./Notifications";
import CustomToolbar from "./components/CustomToolbar";
import "./CalendarPage.css";
import { useSMCalendar } from "smart-calendar-lib";
import EventEdit from "./components/EventEdit";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

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
  const smCalendar = useSMCalendar();
  // console.log(smCalendar.getEvents());
  const eventsRef = useRef<any[]>([]); // เก็บค่า events
  const [events, setEvents] = useState<any[]>([]); // สำหรับการแสดงผล
  const [isLoaded, setIsLoaded] = useState(false); // ตรวจสอบว่าดึงข้อมูลเสร็จหรือยัง

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEventClick = (info: any) => {
    const eventRect = info.el.getBoundingClientRect(); // คำนวณตำแหน่งของ event
    setSelectedEvent(info.event);
    setTooltipPosition({
      top: eventRect.top + window.scrollY + eventRect.height + 5, // ด้านล่าง event
      left: eventRect.left + window.scrollX + eventRect.width / 2, // ตรงกลางของ event
    });
  };

  const handleEditEvent = () => {
    setIsEditDialogOpen(true); // เปิด Dialog
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false); // ปิด Dialog
  };

  const handleCloseTooltip = () => {
    setSelectedEvent(null);
    setTooltipPosition(null);
  };

  const eventGroupId = "156847db-1b7e-46a3-bc4f-15c19ef0ce1b";
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

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [calendarView, setCalendarView] = useState<
    "dayGridMonth" | "timeGridDay" | "timeGridWeek"
  >("dayGridMonth");
  const [currentViewTitle, setCurrentViewTitle] = useState(""); // จัดเก็บ Title ปัจจุบัน
  const calendarRef = useRef<any>(null);

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     const data = await get_events({ username: "napatsiri_p", password: "" });
  //     setEvents(data);
  //   };
  //   fetchEvents();
  // }, []);

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     smCalendar.syncEvents().then(() => {
  //       console.log('sync result: ', smCalendar.getEvents());
  //     });

  //     if (eventsRef.current.length > 0) {
  //       // ถ้า events ถูกดึงมาแล้ว ให้ใช้งานข้อมูลเดิม
  //       setEvents(eventsRef.current);
  //       setIsLoaded(true);
  //       return;
  //     }

  //     try {
  //       const fetchedEvents = await smCalendar.getEvents();

  //       // ลบข้อมูลซ้ำโดยตรวจสอบ `title`, `start`, และ `end`
  //       const uniqueEvents = fetchedEvents.filter(
  //         (event: any, index: number, self: any[]) =>
  //           index ===
  //           self.findIndex(
  //             (e: any) =>
  //               e.title === event.title &&
  //               e.start === event.start &&
  //               e.end === event.end
  //           )
  //       );

  //       console.log("Unique Events by title/start/end:", uniqueEvents);

  //       const formattedEvents = uniqueEvents.map((event: any) => ({
  //         id: event.id,
  //         title: event.title,
  //         start: event.start,
  //         end: event.end,
  //         groups: event.groups,
  //       }));

  //       eventsRef.current = formattedEvents;
  //       setEvents(formattedEvents);
  //       setIsLoaded(true);
  //     } catch (error) {
  //       console.error("Error fetching events:", error);
  //       setIsLoaded(true);
  //     }
  //   };

  //   fetchEvents();
  // }, []); // ไม่มี dependency

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Sync events จาก smCalendar
        await smCalendar.syncEvents();
        const fetchedEvents = await smCalendar.getEvents();
  
        console.log("Sync Result:", fetchedEvents);
  
        // แปลงข้อมูล events โดยตรง
        const formattedEvents = fetchedEvents.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: event.start || event.date, // ใช้ date ถ้าไม่มี start
          end: event.end || event.date, // ใช้ date ถ้าไม่มี end
          groups: Array.isArray(event.groups) ? event.groups : [event.groups], // ตรวจสอบ groups เป็น Array
        }));
  
        // อัปเดต state
        eventsRef.current = formattedEvents;
        setEvents(formattedEvents);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsLoaded(true);
      }
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

  // const addNewEvent = (newEvent: Event) => {
  //   setEvents((prevEvents) => [...prevEvents, newEvent]);
  // };

  // จัดกลุ่ม Events ตามวันที่

  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    let { groups } = event.extendedProps;
  
    // ตรวจสอบให้ groups เป็น array เสมอ
    if (!Array.isArray(groups)) {
      groups = [groups];
    }
  
    // หา group ที่ตรงกับ groupColors
    const matchingGroup = groups.find((g: string) =>
      groupColors.some((group) =>
        Array.isArray(group.groups)
          ? group.groups.includes(g)
          : group.groups === g
      )
    );
  
    // ดึงสีที่ตรงกับ group ที่หาได้
    const groupColor =
      groupColors.find((group) =>
        Array.isArray(group.groups)
          ? group.groups.includes(matchingGroup)
          : group.groups === matchingGroup
      )?.color || "#ddd"; // ใช้สี default (#ddd) ถ้าไม่พบการจับคู่
  
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
  
    const timeRange = `${startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  
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
            width: "98%",
            borderRadius: "4px",
            padding: "2px 4px",
            color: "white",
            fontWeight: "400",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
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
              flexShrink: 0,
            }}
          ></div>
          <span
            style={{
              color: groupColor,
              fontWeight: "400",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flexGrow: 1,
            }}
          >
            {timeRange} {event.title}
          </span>
        </div>
      );
    }
  };
  
  

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      const eventId = selectedEvent.id; // Get the ID of the selected event
      smCalendar.deleteEvents([eventId]); // Use the deleteEvents function
      alert(`Event with ID: ${eventId} deleted successfully.`);

      // Update the local events state to reflect the deletion
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
      handleCloseTooltip(); // Close the tooltip after deletion
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
          eventClick={handleEventClick}
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
              allDaySlot: true, // Ensure all-day slot is visible
            },
            timeGridDay: {
              allDaySlot: true, // Enable all-day slot in day view
            },
          }}
          dayMaxEventRows={3} // Maximum events per cell
          moreLinkClick="popover" // Show remaining events in a popover
        />
        {selectedEvent && tooltipPosition && (
          <div
            style={{
              position: "absolute",
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              background: "white",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              borderRadius: "8px",
              zIndex: 1000,
              transform: "translateX(-50%)", // Center alignment
              minWidth: "250px",
            }}
          >
            {/* Header Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>{selectedEvent.title}</strong>
              {Array.isArray(selectedEvent.extendedProps.groups) &&
                selectedEvent.extendedProps.groups.includes(eventGroupId) && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    {/* Edit Icon */}
                    <EditIcon
                      onClick={handleEditEvent} // เปิด EventEdit
                      style={{ cursor: "pointer", color: "#007bff" }}
                    />

                    {/* Delete Icon */}
                    <DeleteIcon
                      onClick={handleDeleteEvent}
                      style={{ cursor: "pointer", color: "#dc3545" }}
                    />

                    {/* Close Icon */}
                    <CloseIcon
                      onClick={handleCloseTooltip}
                      style={{ cursor: "pointer", color: "#555" }}
                    />
                  </div>
                )}
            </div>

            {/* Details Section */}
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
              <div>
                <strong>Start:</strong>{" "}
                {new Date(selectedEvent.start).toLocaleString()}
              </div>
              <div>
                <strong>End:</strong>{" "}
                {new Date(selectedEvent.end).toLocaleString()}
              </div>
            </div>
          </div>
        )}
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
          // addNewEvent={addNewEvent}
        />
      )}
      {selectedEvent && (
        <EventEdit
          open={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          event={{
            title: selectedEvent.title,
            start: selectedEvent.startStr,
            end: selectedEvent.endStr,
          }}
        />
      )}
    </div>
  );
};

export default CalendarPage;
