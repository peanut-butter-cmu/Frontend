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
import loading from "./asset/loading.gif";
import { useGroupVisibility } from "./GroupVisibilityContext";

const CalendarPage: React.FC = () => {
  const smCalendar = useSMCalendar();
  const eventsRef = useRef<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { groupVisibility, subjectVisibility, collabVisibility } =
    useGroupVisibility();
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

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [calendarView, setCalendarView] = useState<
    "dayGridMonth" | "timeGridDay" | "timeGridWeek"
  >("dayGridMonth");
  const [currentViewTitle, setCurrentViewTitle] = useState("");
  const calendarRef = useRef<any>(null);
  const [fetchedGroups, setFetchedGroups] = useState<any[]>([]);

  const fetchEventsDynamic = async (startDate: Date, endDate: Date) => {
    try {
      const fetchedEvents = await smCalendar.getEvents(startDate, endDate);
      const fetchedGroup = await smCalendar.getGroups();
      const fetchedNotifications = await smCalendar.getNotifications();

      console.log(fetchedNotifications);

      console.log("Sync Result Event:", fetchedEvents);
      console.log("Sync Result Group:", fetchedGroup);

      const eventsArray = Array.isArray(fetchedEvents)
        ? fetchedEvents
        : (fetchedEvents as { calendar: any[] }).calendar;

      if (!Array.isArray(eventsArray)) {
        throw new Error("Expected events to be an array");
      }

      const formattedEvents = eventsArray.map((event) => ({
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
            new Date(event.end).getMinutes() === 59) ||
          (new Date(event.start).getUTCHours() === 0 &&
            new Date(event.start).getUTCMinutes() === 0 &&
            new Date(event.end).getUTCHours() === 0 &&
            new Date(event.end).getUTCMinutes() === 0),
      }));

      eventsRef.current = formattedEvents;
      setEvents(formattedEvents);
      setFetchedGroups(fetchedGroup);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    const today = new Date();
    const defaultStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      15
    );
    const defaultEnd = new Date(today.getFullYear(), today.getMonth() + 1, 15);
    fetchEventsDynamic(defaultStart, defaultEnd);
  }, []);

  const handleDatesSet = (arg: any) => {
    setCurrentViewTitle(arg.view.title);
    console.log(arg.view.title);

    if (arg.view.type === "dayGridMonth") {
      const [monthName, yearStr] = arg.view.title.split(" ");
      const year = parseInt(yearStr, 10);
      const month = new Date(Date.parse(`${monthName} 1, ${year}`)).getMonth();
      const startDate = new Date(year, month - 1, 15);
      const endDate = new Date(year, month + 1, 15);
      fetchEventsDynamic(startDate, endDate);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (event.isCollab) {
      const isVisible =
        collabVisibility[String(event.title)] === undefined
          ? true
          : collabVisibility[String(event.title)];
      return isVisible;
    }

    let passesGroupVisibility = true;
    let passesSubjectVisibility = true;

    if (event.groups && Array.isArray(event.groups)) {
      event.groups.forEach((groupId: string) => {
        if (groupVisibility[String(groupId)] === false) {
          passesGroupVisibility = false;
        }
      });
      const subjectHidden = event.groups.some(
        (subjectId: string) => subjectVisibility[String(subjectId)] === false
      );
      if (subjectHidden) {
        passesSubjectVisibility = false;
      }
    }
    return passesGroupVisibility && passesSubjectVisibility;
  });

  const handleUnreadCountChange = (newCount: number) => {
    setUnreadCount(newCount);
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

  const getGroupColor = (
    eventGroups: (number | string)[],
    groupsData: any[]
  ): string => {
    const fallbackColor = "#ddd";
    if (eventGroups.length === 0) return fallbackColor;

    const preferredTitles = [
      "Owner",
      "Class",
      "Midterm",
      "Final",
      "CMU",
      "Holiday",
      "Assignment",
      "Quiz",
    ];

    const validGroupIds = groupsData
      .filter((group) => preferredTitles.includes(group.title))
      .map((group) => String(group.id));

    const matchingGroupId = eventGroups.find((groupId) =>
      validGroupIds.includes(String(groupId))
    );

    if (!matchingGroupId) return fallbackColor;

    const matchingGroup = groupsData.find(
      (group) => String(group.id) === String(matchingGroupId)
    );

    return matchingGroup && matchingGroup.color
      ? matchingGroup.color
      : fallbackColor;
  };

  const blendWithWhite = (color: any, ratio: any) => {
    let r, g, b;

    if (color.startsWith("#")) {
      if (color.length === 4) {
        color =
          "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
      }
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    } else if (color.startsWith("rgb")) {
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
    const groupColor = getGroupColor(groups, fetchedGroups);
    const lighterColor = blendWithWhite(groupColor, 0.8);
    const start = event.start || event.date;
    const end = event.end || event.date;

    const timeRange =
      start && end
        ? `${new Date(start).toLocaleTimeString([], {
            timeZone: "UTC",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })} - ${new Date(end).toLocaleTimeString([], {
            timeZone: "UTC",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}`
        : start
          ? new Date(start).toLocaleTimeString([], {
              timeZone: "UTC",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "";

    const isAllDay = event.allDay;

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

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      const result = await Swal.fire({
        title: "Confirm Deletion",
        text: "Are you sure you want to delete this event?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#ff0000",
        confirmButtonColor: "#050C9C",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const eventId = selectedEvent.id;
        try {
          await smCalendar.deleteEvent(eventId);
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== eventId)
          );
          await Swal.fire({
            title: "Deleted!",
            text: "The event has been successfully deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          handleCloseTooltip();
        } catch (error) {
          console.error("Error deleting event:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to delete the event. Please try again.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
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
              timeZone="UTC"
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
                    {(() => {
                      const ownerGroup = fetchedGroups.find(
                        (g) => g.title === "Owner"
                      );
                      if (
                        ownerGroup &&
                        selectedEvent.extendedProps.groups.includes(
                          ownerGroup.id
                        )
                      ) {
                        return (
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
                        );
                      }
                      return null;
                    })()}

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
                      {new Date(selectedEvent.start).toLocaleString("en-US", {
                        timeZone: "UTC",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
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
                      {new Date(selectedEvent.end).toLocaleString("en-US", {
                        timeZone: "UTC",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          {showNotifications ? (
            <Nofitications onUnreadCountChange={handleUnreadCountChange} />
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
            start: selectedEvent.start,
            end: selectedEvent.end,
          }}
        />
      )}
    </div>
  );
};

export default CalendarPage;
