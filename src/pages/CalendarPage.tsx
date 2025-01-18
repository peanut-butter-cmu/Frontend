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
import Swal from "sweetalert2";

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
  const eventsRef = useRef<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
  const [currentViewTitle, setCurrentViewTitle] = useState("");
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await smCalendar.syncEvents();
        const fetchedEvents = await smCalendar.getEvents();
        console.log("Sync Result:", fetchedEvents);
        const isValidEvent = (event: any) => {
          return (
            event.id &&
            (event.date || (event.start && event.end)) &&
            Array.isArray(event.groups)
          );
        };

        const formattedEvents = fetchedEvents
          .filter(isValidEvent)
          .map((event: any) => ({
            id: event.id,
            title: event.title,
            start: event.start || event.date,
            end: event.end || event.date,
            groups: Array.isArray(event.groups) ? event.groups : [event.groups],
          }));

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

  const blendWithWhite = (hexColor: any, ratio: any) => {
    // Convert hex to RGB
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);
  
    // Blend each color channel with white (255)
    r = Math.round(r + (255 - r) * ratio);
    g = Math.round(g + (255 - g) * ratio);
    b = Math.round(b + (255 - b) * ratio);
  
    // Return the new color as hex
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  const renderEventContent = (eventInfo: any) => {
    const { event, view } = eventInfo;
    let { groups } = event.extendedProps;
  
    if (!Array.isArray(groups)) {
      groups = [groups];
    }
  
    const matchingGroup = groups.find((g: string) =>
      groupColors.some((group) =>
        Array.isArray(group.groups)
          ? group.groups.includes(g)
          : group.groups === g
      )
    );
  
    const groupColor =
      groupColors.find((group) =>
        Array.isArray(group.groups)
          ? group.groups.includes(matchingGroup)
          : group.groups === matchingGroup
      )?.color || "#ddd";
  
      
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
  
    const timeRange = `${startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })} - ${endDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  
    const isAllDay =
      startDate.getHours() === 0 &&
      startDate.getMinutes() === 0 &&
      endDate.getHours() === 23 &&
      endDate.getMinutes() === 59;

      const lighterColor = blendWithWhite(groupColor, 0.8);
  
    // Conditional rendering for timeGridWeek and timeGridDay
    if (view.type === "timeGridWeek" || view.type === "timeGridDay") {
      return (
        <div
          className="fc-event-content"
          style={{
            backgroundColor: lighterColor, // Use lighter color
         
            borderLeft: `4px solid ${groupColor}`,
            borderRadius: "4px",
            color: "white",
            padding: "5px",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: "400" , color: groupColor }}>
            {event.title}
          </div>
          <div style={{ fontSize: "10px" , color: "#000" }}>{timeRange}</div>
        </div>
      );
    }
  
    // Rendering for all-day events
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
  
    // Default rendering for other views
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
            fontWeight: "300",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontWeight: "200",
              fontSize: "12px",
              minWidth: "30px",
              flexShrink: 0,
            }}
          >
            {timeRange.split(" - ")[0]} {/* Display only start time */}
          </span>
          <span
            style={{
              flexGrow: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "115px",
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
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          const eventId = selectedEvent.id;
          smCalendar.deleteEvents([eventId]);
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
      {/* Calendar */}
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
          nowIndicator={true}
          headerToolbar={false}
          events={events}
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
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
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
    <div style={{ marginTop: "-15px", display: "flex", flexDirection: "column", gap: "5px" }}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ width: "35px", textAlign: "left", fontWeight: "300" }}>Start:</span>
      <span style={{ marginLeft: "10px" }}>
        {new Intl.DateTimeFormat("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(selectedEvent.start))}{" "}
        - {" "}
        {new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date(selectedEvent.start))}
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ width: "35px", textAlign: "left", fontWeight: "300" }}>End:</span>
      <span style={{ marginLeft: "10px" }}>
        {new Intl.DateTimeFormat("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(selectedEvent.end))}{" "}
        - {" "}
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
