import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useSMCalendar } from "smart-calendar-lib";
import loading from "./asset/loading.gif";
import moment from "moment";

const Schedule: React.FC = () => {
  const smCalendar = useSMCalendar();
  const eventsRef = useRef<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dayDoTasks, setDayDoTasks] = useState<any[]>([]);
  const [monthDoTasks, setMonthDoTasks] = useState<any[]>([]);
  const [fetchedGroups, setFetchedGroups] = useState<any[]>([]);
  const today = moment();
  const startDate = today.toDate(); 
  const endDate = today.clone().add(30, "days").toDate(); 
  
  const getPriorityText = (priorityNum: number) => {
    if (priorityNum === 3) return "High Priority";
    if (priorityNum === 2) return "Medium Priority";
    if (priorityNum === 1) return "Low Priority";
    return "Medium Priority";
  };

  // Helper function เพื่อเลือก group id ที่น้อยที่สุดและคืนค่า color
const getGroupColor = (eventGroups: (number | string)[], groups: any[]): string => {
  if (!eventGroups || eventGroups.length === 0) return "#000";
  // เลือกค่า id ที่น้อยที่สุด โดยเปรียบเทียบเป็นตัวเลข
  const smallestGroupId = eventGroups.reduce((min, curr) =>
    Number(curr) < Number(min) ? curr : min, eventGroups[0]);
  const matchingGroup = groups.find(
    (group: any) => String(group.id) === String(smallestGroupId)
  );
  return matchingGroup?.color || "#000";
};


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoaded(false);
        const fetchedEvents = await smCalendar.getEvents(startDate, endDate);
        const fetchedGroup = await smCalendar.getGroups();

        setFetchedGroups(fetchedGroup);

        console.log(fetchedGroup);

        const eventsArray = Array.isArray(fetchedEvents)
        ? fetchedEvents
        : (fetchedEvents as { calendar: any[] }).calendar;
      
      if (!Array.isArray(eventsArray)) {
        throw new Error("Expected events to be an array");
      }
      
      
      const formattedEvents = eventsArray.map((event: any) => ({
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
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsLoaded(true);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchEvents();
  }, []);


  const generateMultiDayEvents = (event: any) => {
    const eventStart = new Date(event.start).setHours(0, 0, 0, 0);
    const eventEnd = new Date(event.end).setHours(0, 0, 0, 0);

    const days = [];
    for (let day = eventStart; day <= eventEnd; day += 24 * 60 * 60 * 1000) {
      const currentDay = new Date(day);
      const dayNumber =
        Math.ceil((day - eventStart) / (24 * 60 * 60 * 1000)) + 1;
      const totalDays =
        Math.ceil((eventEnd - eventStart) / (24 * 60 * 60 * 1000)) + 1;

      days.push({
        ...event,
        displayDate: currentDay,
        dayNumber,
        totalDays,
      });
    }
    return days;
  };

  useEffect(() => {
    if (events.length === 0) return;
    const today = new Date().setHours(0, 0, 0, 0);

    // Day tasks
    const dayTasks = events
      .flatMap(generateMultiDayEvents)
      .filter((event) => {
        const eventDate = new Date(event.displayDate).setHours(0, 0, 0, 0);
        return eventDate === today;
      })
      .map((event) => ({
        time:
          event.start === event.end
            ? new Date(event.start).toLocaleTimeString("en-US", {
              timeZone: "UTC",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            : event.dayNumber === 1 &&
              !(
                new Date(event.start).getHours() === 0 &&
                new Date(event.start).getMinutes() === 0 &&
                new Date(event.end).getHours() === 23 &&
                new Date(event.end).getMinutes() === 59
              )
            ? `${new Date(event.start).toLocaleTimeString([], {
                hour: "2-digit",
              timeZone: "UTC",

                minute: "2-digit",
                hour12: false,
              })} - ${new Date(event.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              timeZone: "UTC",

                hour12: false,
              })}`
            : "All Day",

            task:
            event.totalDays > 1
              ? `${event.title} (Day ${event.dayNumber}/${event.totalDays})`
              : event.title,
          // ใช้ helper function ในการเลือกสีตาม group id ที่น้อยที่สุด
          color: getGroupColor(event.groups, fetchedGroups),

       priority: getPriorityText(
          fetchedGroups.find((group: any) =>
            Array.isArray(event.groups)
              ? event.groups.some((g: any) => group.id === g)
              : group.id === event.groups
          )?.priority || 2
        ),
      }))
      .sort((a, b) => {
        const priorityOrder = [
          "High Priority",
          "Medium Priority",
          "Low Priority",
        ];

        // ตรวจสอบว่าเป็น All Day หรือไม่
        const isAllDayA = a.time === "All Day";
        const isAllDayB = b.time === "All Day";

        // กรณีที่ All Day ให้อยู่ล่างสุดเสมอ
        if (isAllDayA && !isAllDayB) return 1;
        if (!isAllDayA && isAllDayB) return -1;

        // ถ้าทั้งคู่เป็น All Day หรือไม่ใช่ All Day ให้เรียงตาม Priority ก่อน
        const priorityComparison =
          priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
        if (priorityComparison !== 0) return priorityComparison;

        // ถ้า Priority เท่ากัน และไม่ใช่ All Day ให้เรียงตามเวลา
        if (!isAllDayA && !isAllDayB) {
          const getTime = (time: string) => {
            const [hours, minutes] = time
              .split(" - ")[0]
              .split(":")
              .map(Number);
            return hours * 60 + minutes; // แปลงเป็นนาทีเพื่อความง่ายในการเปรียบเทียบ
          };
          return getTime(a.time) - getTime(b.time);
        }

        return 0; // กรณีอื่นที่ไม่ครอบคลุม
      });

    setDayDoTasks(dayTasks);

    // Month tasks
    const monthTasks = events
      .flatMap(generateMultiDayEvents)
      .filter((event) => {
        const eventDate = new Date(event.displayDate).setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .map((event) => ({
        date: new Date(event.displayDate).toLocaleDateString("en-US", {
          day: "numeric",
          timeZone: "UTC",

          month: "short",
          weekday: "short",
        }),
        time:
          event.start === event.end
            ? new Date(event.start).toLocaleTimeString([], {
                hour: "2-digit",
              timeZone: "UTC",

                minute: "2-digit",
                hour12: false,
              })
            : event.dayNumber === 1 &&
              !(
                new Date(event.start).getHours() === 0 &&
                new Date(event.start).getMinutes() === 0 &&
                new Date(event.end).getHours() === 23 &&
                new Date(event.end).getMinutes() === 59
              )
            ? `${new Date(event.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              timeZone: "UTC",

                hour12: false,
              })} - ${new Date(event.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              timeZone: "UTC",

                hour12: false,
              })}`
            : "All Day",

    task:
      event.totalDays > 1
        ? `${event.title} (Day ${event.dayNumber}/${event.totalDays})`
        : event.title,
    // ใช้ helper function ในการเลือกสีตาม group id ที่น้อยที่สุด
    color: getGroupColor(event.groups, fetchedGroups),

            priority: getPriorityText(
              fetchedGroups.find((group: any) =>
                Array.isArray(event.groups)
                  ? event.groups.some((g: any) => group.id === g)
                  : group.id === event.groups
              )?.priority || 2
            ),
            timestamp: new Date(event.displayDate).getTime(),
          }))
      .sort((a, b) => {
        // เรียงตาม timestamp (วันที่)
        if (a.timestamp !== b.timestamp) {
          return a.timestamp - b.timestamp;
        }

        // เรียงตาม Priority
        const priorityOrder = [
          "High Priority",
          "Medium Priority",
          "Low Priority",
        ];
        const priorityComparison =
          priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
        if (priorityComparison !== 0) {
          return priorityComparison;
        }

        // เรียงตามเวลาในแต่ละวัน (สำหรับ Priority ที่เท่ากัน)
        const getTime = (time: any) => {
          if (time === "All Day") return Infinity; // All Day ให้อยู่ล่างสุด
          const [hours, minutes] = time.split(" - ")[0].split(":").map(Number);
          return hours * 60 + minutes; // แปลงเป็นนาที
        };

        return getTime(a.time) - getTime(b.time);
      });

    setMonthDoTasks(monthTasks);
  }, [events]);

  const getCurrentDate = () => {
    const date = new Date();

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  return (
    <Box>
      {!isLoaded && (
        <Box
          sx={{
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
        </Box>
      )}
      {isLoaded && (
        <div
          style={{
            height: "100vh",
            backgroundColor: "#fff",
            padding: "0",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#fff",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            <div
              style={{
                marginTop: "10px",
                marginBottom: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 270px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "34px",
                  fontWeight: 300,
                }}
              >
                Schedule
              </h2>
            </div>

            <Divider sx={{ borderColor: "#e5e5e5", mb: 2 }} />
            <div
              style={{
                padding: "0 300px 32px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  marginBottom: 1,
                  color: "gray",
                  fontFamily: "'kanit', sans-serif",
                }}
              >
                {getCurrentDate()}
              </Typography>
              {/* Day Tasks */}
              <Box sx={{ marginBottom: 2, marginTop: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    backgroundColor: "#8576FF",
                    color: "white",
                    padding: 1.5,
                    borderRadius: "5px 5px 0 0",
                    fontWeight: "400",
                    fontSize: "20px",
                    fontFamily: "'kanit', sans-serif",
                  }}
                >
                  Day Tasks
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#f9f9fb",
                    padding: "24px",
                    borderRadius: "0 0 5px 5px",
                    height: "200px",
                    overflowY: "auto",
                  }}
                >
                  {dayDoTasks.length > 0 ? (
                    dayDoTasks.map((task, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderBottom: "1px solid #eee",
                          padding: 1,
                          marginBottom: 1,
                          gap: 2,
                        }}
                      >
                        {/* Date */}
                        <Box
                          sx={{
                            width: "15%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: "7px",
                              height: "7px",
                              backgroundColor: task.color,
                              borderRadius: "50%",
                              marginRight: 1,
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: "300",
                              fontSize: "15px",
                              fontFamily: "'kanit', sans-serif",
                            }}
                          >
                            {task.time}
                          </Typography>
                        </Box>

                        {/* Time */}
                        <Typography
                          sx={{
                            width: "70%",
                            fontWeight: "300",
                            fontSize: "15px",
                            fontFamily: "'kanit', sans-serif",
                          }}
                        >
                          {task.task}
                        </Typography>

                        {/* Priority */}
                        <Typography
                          sx={{
                            width: "15%",
                            fontWeight: "400",
                            fontFamily: "'kanit', sans-serif",
                            fontSize: "12px",
                            textAlign: "right",
                            color:
                              task.priority === "High Priority"
                                ? "#FF2929"
                                : task.priority === "Medium Priority"
                                ? "#FA812F"
                                : "#009990",
                          }}
                        >
                          {task.priority}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontWeight: "300",
                        fontSize: "18px",
                        color: "gray",
                        padding: 2,
                        fontFamily: "'kanit', sans-serif",
                      }}
                    >
                      Nothing planned for today. Take a well-deserved break!
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Schedule */}
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    backgroundColor: "#8576FF",
                    color: "white",
                    padding: 1.5,
                    borderRadius: "5px 5px 0 0",
                    fontWeight: "400",
                    fontSize: "21px",
                    fontFamily: "'kanit', sans-serif",
                  }}
                >
                  Schedule
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#f9f9fb",
                    padding: 2,
                    borderRadius: "0 0 5px 5px",
                    height: "370px",
                    overflowY: "auto",
                  }}
                >
                  {monthDoTasks.map((task, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #eee",
                        padding: 1,
                        marginBottom: 1,
                        gap: 2,
                      }}
                    >
                      {/* Date */}
                      <Box
                        sx={{
                          width: "15%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "7px",
                            height: "7px",
                            backgroundColor: task.color,
                            borderRadius: "50%",
                            marginRight: 1,
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: "300",
                            fontSize: "15px",
                            fontFamily: "'kanit', sans-serif",
                          }}
                        >
                          {task.date}
                        </Typography>
                      </Box>

                      {/* Time */}
                      <Typography
                        sx={{
                          width: "15%",
                          fontWeight: "300",
                          fontSize: "15px",
                          fontFamily: "'kanit', sans-serif",
                        }}
                      >
                        {task.time}
                      </Typography>

                      {/* Task */}
                      <Typography
                        sx={{
                          width: "55%",
                          fontWeight: "300",
                          fontSize: "15px",
                          fontFamily: "'kanit', sans-serif",
                        }}
                      >
                        {task.task}
                      </Typography>

                      {/* Priority */}
                      <Typography
                        sx={{
                          width: "15%",
                          fontWeight: "400",
                          fontSize: "12px",
                          fontFamily: "'kanit', sans-serif",
                          textAlign: "right",
                          color:
                            task.priority === "High Priority"
                              ? "#FF2929"
                              : task.priority === "Medium Priority"
                              ? "#FA812F"
                              : "#009990",
                        }}
                      >
                        {task.priority}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default Schedule;
