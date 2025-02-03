import React, { useState, useRef, useEffect , useMemo } from "react";
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
import Swal from "sweetalert2";
import loading from "./asset/loading.gif";
import { useGroupVisibility } from "./GroupVisibilityContext";

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
  const eventsRef = useRef<any[]>([]); // เก็บค่า events
  const [events, setEvents] = useState<any[]>([]); // สำหรับการแสดงผล
  const [isLoaded, setIsLoaded] = useState(false); // ตรวจสอบว่าดึงข้อมูลเสร็จหรือยัง

  const { groupVisibility, subjectVisibility } = useGroupVisibility();
  // console.log("subjectVisibility:", subjectVisibility);
  // console.log("groupVisibility:", groupVisibility);

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEventClick = (info: any) => {
    const eventRect = info.el.getBoundingClientRect();
    setSelectedEvent(info.event);
    setTooltipPosition({
      top: eventRect.top + window.scrollY + eventRect.height + 5,
      left: eventRect.left + window.scrollX + eventRect.width / 2,
    });
  };
  const handleEditEvent = () => {
    if (selectedEvent) {
      setIsEditDialogOpen(true);
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleCloseTooltip = () => {
    setSelectedEvent(null);
    setTooltipPosition(null);
  };

  // const eventGroupId = "156847db-1b7e-46a3-bc4f-15c19ef0ce1b";
  const AssiggnmentGroupId = "6121a9c8-ec3f-47aa-ba8b-fbd28ccf27c8";
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [calendarView, setCalendarView] = useState<
    "dayGridMonth" | "timeGridDay" | "timeGridWeek"
  >("dayGridMonth");
  const [currentViewTitle, setCurrentViewTitle] = useState("");
  const calendarRef = useRef<any>(null);
  const [fetchedGroups, setFetchedGroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Sync events จาก smCalendar
        const fetchedEvents = await smCalendar.getEvents();
        const fetchedGroup = await smCalendar.getGroups();
        
        // console.log("Sync Result:", fetchedEvents);
        // console.log(fetchedGroup);
        // const isValidEvent = (event: any) => {
        //   return (
        //     event.id &&
        //     (event.date || (event.start && event.end)) &&
        //     Array.isArray(event.groups)
        //   );
        // };

        const formattedEvents = fetchedEvents
          // .filter(isValidEvent)
          .map((event: any) => ({
            id: event.id,
            title: event.title,
            start: event.start || event.date,
            end: event.end || event.date,
            date: event.date || null,
            groups: Array.isArray(event.groups) ? event.groups : [event.groups],
            allDay:
              event.allDay ||
              (new Date(event.start).getHours() === 0 &&
                new Date(event.start).getMinutes() === 0 &&
                new Date(event.end).getHours() === 23 &&
                new Date(event.end).getMinutes() === 59),
          }));

        eventsRef.current = formattedEvents;
        setEvents(formattedEvents);
        setFetchedGroups(fetchedGroup);

        setIsLoaded(true);
        // Fetch notifications
        const notificationData = await fetchNotifications();
        setNotifications(notificationData);
        setUnreadCount(notificationData.filter((n) => !n.isRead).length);
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsLoaded(true);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchEvents();
  }, []);

  const groupCalendarIds = [
    "8a9e8a40-9e8a-4464-8495-694b0012af80",
    "53adc81a-1089-4e84-a1c4-a77d1e1434c3", 
    "427b92fc-d055-4109-b164-ca9313c2ee95",
    "6121a9c8-ec3f-47aa-ba8b-fbd28ccf27c8", 
    "9314e483-dc11-438f-8855-046755ac0b64",
    "a9c0c854-f59f-47c7-b75d-c35c568856cd",
    "0bee62f7-4f9f-4735-92ac-2041446aac91",
    "156847db-1b7e-46a3-bc4f-15c19ef0ce1b",
  ];
  
  const groupCalendars = useMemo(() => {
    return fetchedGroups.filter((group) => groupCalendarIds.includes(group.id));
  }, [fetchedGroups]);

  const groupMapping: { [uuid: string]: string } = {
    "8a9e8a40-9e8e-4464-8495-694b0012af80": "CMU",
    "53adc81a-1089-4e84-a1c4-a77d1e1434c3": "Class",
    "427b92fc-d055-4109-b164-ca9313c2ee95": "Quiz",
    "6121a9c8-ec3f-47aa-ba8b-fbd28ccf27c8": "Assignment",
    "9314e483-dc11-438f-8855-046755ac0b64": "Final",
    "a9c0c854-f59f-47c7-b75d-c35c568856cd": "Midterm",
    "0bee62f7-4f9f-4735-92ac-2041446aac91": "Holiday",
    "156847db-1b7e-46a3-bc4f-15c19ef0ce1b": "Owner",
  };

  const filteredEvents = events.filter((event) => {
    let passesGroupVisibility = true;
    let passesSubjectVisibility = true;
  
    if (event.groups && Array.isArray(event.groups)) {
      // Check each group (for group visibility)
      event.groups.forEach((groupId: string) => {
        if (groupCalendarIds.includes(groupId)) {
          const groupName = groupMapping[groupId] || groupId;
          if (groupVisibility[groupName] === false) {
            passesGroupVisibility = false;
          }
        }
      });
      // If the event has more than one group, assume the second is the subject id.
      if (event.groups.length > 1) {
        const subjectId = event.groups[1];
        // Use optional chaining just to be safe:
        if (subjectVisibility?.[subjectId] === false) {
          passesSubjectVisibility = false;
        }
      }
    }
    return passesGroupVisibility && passesSubjectVisibility;
  });
  
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await fetchNotifications();
  //     setNotifications(data);
  //     setUnreadCount(data.filter((n) => !n.isRead).length);
  //   };
  //   fetchData();
  // }, []);

  const handleUnreadCountChange = (newCount: number) => {
    setUnreadCount(newCount);
  };

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

  const blendWithWhite = (color:any, ratio:any) => {
    let r, g, b;
  
    // ถ้าเป็น hex format (เช่น "#ff0000" หรือ "#f00")
    if (color.startsWith("#")) {
      if (color.length === 4) {
        color = "#" + color[1] + color[1]
                  + color[2] + color[2]
                  + color[3] + color[3];
      }
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    }
    // ถ้าเป็น rgb format (เช่น "rgb(65, 179, 162)")
    else if (color.startsWith("rgb")) {
      const parts = color.match(/(\d+\.?\d*)/g);
      if (parts) {
        r = parseFloat(parts[0]);
        g = parseFloat(parts[1]);
        b = parseFloat(parts[2]);
      } else {
        r = g = b = 0;
      }
    } else {
      r = g = b = 0;
    }

    r = Math.round(r + (255 - r) * ratio);
    g = Math.round(g + (255 - g) * ratio);
    b = Math.round(b + (255 - b) * ratio);
  
    return `rgb(${r}, ${g}, ${b})`;
  };
  

  const renderEventContent = (eventInfo: any) => {
    const { event, view } = eventInfo;
    let { groups } = event.extendedProps;

    if (!Array.isArray(groups)) {
      groups = [groups];
    }

    const matchingGroup = groups.find((g: string) =>
      groupCalendars.some((group) => group.id === g)
    );

    const groupColor =
    matchingGroup
      ? groupCalendars.find((group) => group.id === matchingGroup)?.default_color || "#ddd"
      : "#ddd";

    const start = event.start || event.date;
    const end = event.end || event.date;

    const timeRange =
      start && end
        ? `${new Date(start).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })} - ${new Date(end).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}`
        : start
        ? new Date(start).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "";

    // const startDate = new Date(event.start);
    // const endDate = new Date(event.end);

    // const timeRange = ${startDate.toLocaleTimeString([], {
    //   hour: "2-digit",
    //   minute: "2-digit",
    //   hour12: false,
    // })} - ${endDate.toLocaleTimeString([], {
    //   hour: "2-digit",
    //   minute: "2-digit",
    //   hour12: false,
    // })};

    const isAllDay = event.allDay;

    const lighterColor = blendWithWhite(groupColor, 0.8);

    if (view.type === "timeGridWeek" || view.type === "timeGridDay") {
      return (
        <div
          className="fc-event-content"
          style={{
            backgroundColor: lighterColor,
            borderLeft: `4px solid ${groupColor}`,
            borderRadius: "4px",
            color: "white",
            padding: "5px",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{ fontSize: "12px", fontWeight: "400", color: groupColor }}
          >
            {event.title}
          </div>
          <div style={{ fontSize: "10px", color: "#000" }}>{timeRange}</div>
        </div>
      );
    }

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
    }

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          width: "98%",
        }}
      >
        <div
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: groupColor,
            flexShrink: 0,
          }}
        ></div>
        <span
          style={{
            color: groupColor,
            fontWeight: "400",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontWeight: "300",
              fontSize: "11px",
              minWidth: "25px",
              flexShrink: 0,
            }}
          >
            {timeRange.split(" - ")[0]}
          </span>
          <span
            style={{
              flexGrow: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "120px",
            }}
          >
            {event.title}
          </span>
        </span>
      </div>
    );
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      Swal.fire({
        title: "Confirm Deletion",
        text: "Are you sure you want to delete this event?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#050C9C",
        cancelButtonColor: "#ff0000",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          const eventId = selectedEvent.id;
          smCalendar.deleteEvent(eventId);
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== eventId)
          );
          Swal.fire({
            title: "Deleted!",
            text: "The event has been successfully deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          handleCloseTooltip();
        }
      });
    }
  };

  return (
    <div className="container">
      {!isLoaded && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={loading}
            alt="Loading..."
            style={{
              width: "80px",
              height: "auto",
            }}
          />
        </div>
      )}

      {/* Calendar */}
      {isLoaded && (
        <>
          <div className="calendar-container">
            {/* Custom Toolbar */}
            <CustomToolbar
              label={currentViewTitle}
              onNavigate={handleNavigate}
              onView={handleViewChange}
              onToggleRightSidebar={() => setShowNotifications((prev) => !prev)}
              unreadCount={unreadCount}
              currentView={calendarView}
            />

            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={calendarView}
              allDaySlot={true}
              nowIndicator={true}
              headerToolbar={false}
              events={filteredEvents}
              height="100%"
              datesSet={handleDatesSet}
              eventContent={(eventInfo) => renderEventContent(eventInfo)}
              eventClick={handleEventClick}
              views={{
                dayGridMonth: {
                  dayMaxEventRows: true,
                  moreLinkText: "Show more",
                },
                timeGridWeek: {
                  dayHeaderFormat: {
                    weekday: "short",
                    day: "2-digit",
                  },
                  allDaySlot: true,
                },
                timeGridDay: {
                  allDaySlot: true,
                },
              }}
              dayMaxEventRows={3}
              moreLinkClick="popover"
            />

            {selectedEvent && tooltipPosition && (
              <div
                style={{
                  position: "absolute",
                  top: tooltipPosition.top,
                  left: tooltipPosition.left,
                  background: "white",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  zIndex: 1000,
                  transform: "translateX(-50%)",
                  minWidth: "250px",
                  padding: "15px",
                }}
              >
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexDirection: "column",
                  }}
                >
                  {/* ป้ายกำกับ */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "8px",
                      alignSelf: "flex-end",
                    }}
                  >
                    {/* Edit Icon */}
                    <EditIcon
                      onClick={handleEditEvent}
                      style={{
                        cursor: "pointer",
                        color: "#e5e5e5",
                        transition: "color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#1D24CA")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#e5e5e5")
                      }
                    />

                    {/* Delete Icon */}
                    <DeleteIcon
                      onClick={handleDeleteEvent}
                      style={{
                        cursor: "pointer",
                        color: "#e5e5e5",
                        transition: "color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#ff0000")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#e5e5e5")
                      }
                    />

                    {/* Close Icon */}
                    <CloseIcon
                      onClick={handleCloseTooltip}
                      style={{
                        cursor: "pointer",
                        color: "#e5e5e5",
                        transition: "color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#000")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#e5e5e5")
                      }
                    />
                  </div>

                  {/* ชื่อ Event */}
                  <p
                    style={{
                      marginTop: "8px",
                      textAlign: "left",
                      fontSize: "16px",
                      fontWeight: "400",
                    }}
                  >
                    {selectedEvent.title}
                  </p>
                </div>

                {/* Details Section */}
                <div style={{ fontSize: "14px", fontWeight: "300" }}>
                  {Array.isArray(selectedEvent.extendedProps.groups) &&
                  selectedEvent.extendedProps.groups.includes(
                    AssiggnmentGroupId
                  ) ? (
                    <div style={{ marginTop: "-15px" }}>
                      <div>
                        <span>Due :</span>{" "}
                        {new Date(selectedEvent.start).toLocaleString([], {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: "-15px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            width: "35px",
                            textAlign: "left",
                            fontWeight: "300",
                          }}
                        >
                          Start:
                        </span>
                        <span style={{ marginLeft: "10px" }}>
                          {new Intl.DateTimeFormat("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(selectedEvent.start))}{" "}
                          -{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }).format(new Date(selectedEvent.start))}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            width: "35px",
                            textAlign: "left",
                            fontWeight: "300",
                          }}
                        >
                          End:
                        </span>
                        <span style={{ marginLeft: "10px" }}>
                          {new Intl.DateTimeFormat("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(selectedEvent.end))}{" "}
                          -{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }).format(new Date(selectedEvent.end))}
                        </span>
                      </div>
                    </div>
                  )}
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
            <RightSide events={events} />
          )}
        </>
      )}
      {selectedEvent && (
        <EventEdit
          open={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          event={{
            id: selectedEvent.id,
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
