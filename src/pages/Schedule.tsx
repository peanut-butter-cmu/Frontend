import React, { useState, useEffect, useRef , useMemo } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useSMCalendar } from "smart-calendar-lib";
import loading from "./asset/loading.gif";

const Schedule: React.FC = () => {
  const smCalendar = useSMCalendar();
  // console.log(smCalendar.getEvents());
  const eventsRef = useRef<any[]>([]); // เก็บค่า events
  const [events, setEvents] = useState<any[]>([]); // สำหรับการแสดงผล
  const [isLoaded, setIsLoaded] = useState(false); // ตรวจสอบว่าดึงข้อมูลเสร็จหรือยัง
  const [dayDoTasks, setDayDoTasks] = useState<any[]>([]);
  const [monthDoTasks, setMonthDoTasks] = useState<any[]>([]);
  const [fetchedGroups, setFetchedGroups] = useState<any[]>([]);

  const groupPriority = [
    {
      groups: "8a9e8a40-9e8e-4464-8495-694b0012af80",
      priority: "Low Priority",
    },
    {
      groups: "53adc81a-1089-4e84-a1c4-a77d1e1434c3",
      priority: "Medium Priority",
    },
    {
      groups: ["427b92fc-d055-4109-b164-ca9313c2ee95"],
      priority: "High Priority",
    },
    {
      groups: ["6121a9c8-ec3f-47aa-ba8b-fbd28ccf27c8"],
      priority: "Medium Priority",
    },
    {
      groups: "9314e483-dc11-438f-8855-046755ac0b64",
      priority: "High Priority",
    },
    {
      groups: "a9c0c854-f59f-47c7-b75d-c35c568856cd",
      priority: "High Priority",
    },
    {
      groups: "0bee62f7-4f9f-4735-92ac-2041446aac91",
      priority: "Low Priority",
    },
    {
      groups: "156847db-1b7e-46a3-bc4f-15c19ef0ce1b",
      priority: "Low Priority",
    },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoaded(false);
        const fetchedEvents = await smCalendar.getEvents();
        const fetchedGroup = await smCalendar.getGroups();
  
        console.log(fetchedGroup);
  
        // เพิ่มบรรทัดนี้เพื่ออัปเดต state ของ fetchedGroups
        setFetchedGroups(fetchedGroup);
  
        const formattedEvents = fetchedEvents.map((event: any) => ({
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
      } finally {
        setIsLoaded(true);
      }
    };
  
    fetchEvents();
  }, []);
  

  const groupCalendarIds = [
    "8a9e8a40-9e8e-4464-8495-694b0012af80",
    "53adc81a-1089-4e84-a1c4-a77d1e1434c3", 
    "427b92fc-d055-4109-b164-ca9313c2ee95",
    "6121a9c8-ec3f-47aa-ba8b-fbd28ccf27c8", 
    "9314e483-dc11-438f-8855-046755ac0b64",
    "a9c0c854-f59f-47c7-b75d-c35c568856cd",
    "0bee62f7-4f9f-4735-92ac-2041446aac91",
    "156847db-1b7e-46a3-bc4f-15c19ef0ce1b",
  ];
  
  const groupColors = useMemo(() => {
    return fetchedGroups
      .filter((group) => groupCalendarIds.includes(group.id))
      .map((group) => ({
        groups: group.id,
        key: group.title,
        name: group.title,
        // ใช้ค่าสีจาก API ที่เก็บไว้ใน property default_color
        color: group.default_color,
      }));
  }, [fetchedGroups]);
  

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
            ? new Date(event.start).toLocaleTimeString([], {
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
                minute: "2-digit",
                hour12: false,
              })} - ${new Date(event.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}`
            : "All Day",

        task:
          event.totalDays > 1
            ? `${event.title} (Day ${event.dayNumber}/${event.totalDays})`
            : event.title,
        color:
          groupColors.find((group) =>
            Array.isArray(event.groups)
              ? event.groups.some((g: string) =>
                  Array.isArray(group.groups)
                    ? group.groups.includes(g)
                    : group.groups === g
                )
              : Array.isArray(group.groups)
              ? group.groups.includes(event.groups)
              : group.groups === event.groups
          )?.color || "#000",

        priority:
          groupPriority.find((group) =>
            Array.isArray(event.groups)
              ? event.groups.some((g: string) =>
                  Array.isArray(group.groups)
                    ? group.groups.includes(g)
                    : group.groups === g
                )
              : Array.isArray(group.groups)
              ? group.groups.includes(event.groups)
              : group.groups === event.groups
          )?.priority || "Medium Priority",
      }))
      .sort((a, b) => {
        const priorityOrder = ["High Priority", "Medium Priority", "Low Priority"];
      
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
            const [hours, minutes] = time.split(" - ")[0].split(":").map(Number);
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
          month: "short",
          weekday: "short",
        }),
        time:
          event.start === event.end
            ? new Date(event.start).toLocaleTimeString([], {
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
                minute: "2-digit",
                hour12: false,
              })} - ${new Date(event.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}`
            : "All Day",

        task:
          event.totalDays > 1
            ? `${event.title} (Day ${event.dayNumber}/${event.totalDays})`
            : event.title,
        color:
          groupColors.find((group) =>
            Array.isArray(event.groups)
              ? event.groups.some((g: string) =>
                  Array.isArray(group.groups)
                    ? group.groups.includes(g)
                    : group.groups === g
                )
              : Array.isArray(group.groups)
              ? group.groups.includes(event.groups)
              : group.groups === event.groups
          )?.color || "#000",

        priority:
          groupPriority.find((group) =>
            Array.isArray(event.groups)
              ? event.groups.some((g: string) =>
                  Array.isArray(group.groups)
                    ? group.groups.includes(g)
                    : group.groups === g
                )
              : Array.isArray(group.groups)
              ? group.groups.includes(event.groups)
              : group.groups === event.groups
          )?.priority || "Medium Priority",
        timestamp: new Date(event.displayDate).getTime(),
      }))
      .sort((a, b) => {
        // เรียงตาม timestamp (วันที่)
        if (a.timestamp !== b.timestamp) {
          return a.timestamp - b.timestamp;
        }
      
        // เรียงตาม Priority
        const priorityOrder = ["High Priority", "Medium Priority", "Low Priority"];
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
    <Box sx={{ padding: 3 }}>
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
        <Box>
          {/* Header */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#f9f9fb",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                marginTop: "-15px",
                marginBottom: "5px",
                display: "flex",
                alignItems: "center",
                padding: "16px 250px",
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
                    backgroundColor: "#fff",
                    padding: 2,
                    borderRadius: "0 0 5px 5px",
                    height: "220px",
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
                    backgroundColor: "#fff",
                    padding: 2,
                    borderRadius: "0 0 5px 5px",
                    height: "400px",
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
        </Box>
      )}
    </Box>
  );
};

export default Schedule;
