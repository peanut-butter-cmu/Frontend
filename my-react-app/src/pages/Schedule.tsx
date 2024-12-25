import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";

const Schedule: React.FC = () => {
  const [dayDoTasks, setDayDoTasks] = useState<any[]>([]);
  const [monthDoTasks, setMonthDoTasks] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const groupColors = [
    { idGroup: 1, key: "CMU", name: "CMU", color: "#615EFC" },
    { idGroup: 2, key: "Classroom", name: "Class", color: "#41B3A2" },
    { idGroup: 3, key: "Quiz", name: "Quiz", color: "#FF9100" },
    { idGroup: 4, key: "Assignment", name: "Assignment", color: "#FCC26D" },
    { idGroup: 5, key: "FinalMidterm", name: "Final & Midterm", color: "#FF0000" },
    { idGroup: 6, key: "Holiday", name: "Holiday", color: "#9DBDFF" },
    { idGroup: 7, key: "Owner", name: "Owner", color: "#D6C0B3" },
  ];

  const groupPriority = [
    { idGroup: 1, priority: "Low Priority" },
    { idGroup: 2, priority: "Medium Priority" },
    { idGroup: 3, priority: "High Priority" },
    { idGroup: 4, priority: "Medium Priority" },
    { idGroup: 5, priority: "High Priority" },
    { idGroup: 6, priority: "Low Priority" },
    { idGroup: 7, priority: "Low Priority" },
  ];

  const fetchNotifications = async () => {
    return [
      { id: 1, title: "!!! Sent Database Assignment", due: "Due Today 13:00", highlighted: true, isRead: false },
      { id: 2, title: "NEW Calculas is assigned", due: "Due 12 Mar 2024 23:59", isRead: false },
      { id: 3, title: "Meeting Present 1", detail: "Every Monday , 12:00 - 13:15 PM", from: "From Napatsiri_p", group: "Group Project Boo", hasAction: true, isRead: false },
      { id: 4, title: "Database Assignment", status: "has been submitted", isRead: true },
    ];
  };

  const events = [
    {
      title: "Quiz Network",
      start: "2024-11-27T11:00:00", 
      end: "2024-11-27T12:00:00",
      idGroup: 3,
    },
    {
      title: "Assignment Prop & Stat",
      start: "2024-11-27T21:00:00",
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
    {
      title: "Quiz Networknojpo",
      start: "2024-12-24T00:00:00", // ISO string format
      end: "2024-12-26T23:59:00",
      idGroup: 3,
    },
  ];

  const generateMultiDayEvents = (event) => {
    const eventStart = new Date(event.start).setHours(0, 0, 0, 0);
    const eventEnd = new Date(event.end).setHours(0, 0, 0, 0);
  
    const days = [];
    for (let day = eventStart; day <= eventEnd; day += 24 * 60 * 60 * 1000) {
      const currentDay = new Date(day);
      const dayNumber =
        Math.ceil((day - eventStart) / (24 * 60 * 60 * 1000)) + 1;
      const totalDays = Math.ceil(
        (eventEnd - eventStart) / (24 * 60 * 60 * 1000)
      ) + 1;
  
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
    const fetchData = async () => {
      const fetchedNotifications = await fetchNotifications();
      setNotifications(fetchedNotifications);
  
      // Map day tasks
      const dayTasks = events
      .flatMap((event) => generateMultiDayEvents(event)) // สร้าง Event หลายวัน
      .filter((event) => {
        const today = new Date().setHours(0, 0, 0, 0); // วันนี้
        const eventDate = new Date(event.displayDate).setHours(0, 0, 0, 0); // วันที่ปัจจุบันของ Event
        return eventDate === today; // แสดงเฉพาะ Event ที่ตรงกับวันนี้
      })
      .map((event) => ({
        time:
          event.dayNumber === 1
            ? `${new Date(event.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} - ${new Date(event.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "ตลอดวัน", // สำหรับวันที่ 2 เป็นต้นไปให้แสดง "ตลอดวัน"
        task:
          event.totalDays > 1
            ? `${event.title} (วันที่ ${event.dayNumber}/${event.totalDays})`
            : event.title, // แสดง "วันที่ _/_" เฉพาะ Event หลายวัน
        color:
          groupColors.find((group) => group.idGroup === event.idGroup)?.color ||
          "#000",
        priority:
          groupPriority.find((group) => group.idGroup === event.idGroup)
            ?.priority || "Medium Priority",
        priorityValue:
          groupPriority.find((group) => group.idGroup === event.idGroup)
            ?.priority === "High Priority"
            ? 1
            : groupPriority.find((group) => group.idGroup === event.idGroup)
                ?.priority === "Medium Priority"
            ? 2
            : 3,
      }))
      .sort((a, b) => a.priorityValue - b.priorityValue);
    
    setDayDoTasks(dayTasks);
    

  
      // Map month tasks
      const monthTasks = events
      .flatMap((event) => generateMultiDayEvents(event)) // สร้าง Event หลายวัน
      .filter((event) => {
        const today = new Date().setHours(0, 0, 0, 0);
        const eventDate = new Date(event.displayDate).setHours(0, 0, 0, 0); // วันที่ของ Event
        return eventDate >= today; // แสดงเฉพาะ Event ที่ยังไม่เกิดขึ้น
      })
      .map((event) => ({
        date: new Date(event.displayDate).toLocaleDateString("th-TH", {
          day: "numeric",
          month: "short",
          weekday: "short",
        }),
        time:
          event.dayNumber === 1
            ? `${new Date(event.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} - ${new Date(event.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "ตลอดวัน", // แสดง "ตลอดวัน" หากเป็นวันที่ 2 เป็นต้นไป
        task:
          event.totalDays > 1
            ? `${event.title} (วันที่ ${event.dayNumber}/${event.totalDays})`
            : event.title, // แสดง "วันที่ _/_" เฉพาะ Event หลายวัน
        color:
          groupColors.find((group) => group.idGroup === event.idGroup)?.color ||
          "#000",
        priority:
          groupPriority.find((group) => group.idGroup === event.idGroup)
            ?.priority || "Medium Priority",
        priorityValue:
          groupPriority.find((group) => group.idGroup === event.idGroup)
            ?.priority === "High Priority"
            ? 1
            : groupPriority.find((group) => group.idGroup === event.idGroup)
                ?.priority === "Medium Priority"
            ? 2
            : 3,
      }))
      .sort((a, b) => a.priorityValue - b.priorityValue);
    
    setMonthDoTasks(monthTasks);
    
    
    };
  
    fetchData();
  }, []);
  

  const getCurrentDate = () => {
    const date = new Date();

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
  
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };


  return (
    <Box sx={{ padding: 3 }}>
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
              padding: "16px 400px",
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
              padding: "0 450px 32px",
            }}
          >

<Typography variant="h6" sx={{ marginBottom: 1, color: "gray" }}>
              {getCurrentDate()}
            </Typography>
        {/* Day Tasks */}
        <Box sx={{ marginBottom: 2 , marginTop: 2}}>
          <Typography variant="h5" sx={{
      backgroundColor: "#8576FF",
      color: "white",
      padding: 1.5,
      borderRadius: "5px 5px 0 0",
       fontWeight: "400" , fontSize: "20px"
    }}>
            Day Tasks
          </Typography>
          <Box sx={{
      backgroundColor: "#fff",
      padding: 2,
      borderRadius: "0 0 5px 5px",
      height: "220px", // กำหนดความสูงที่ต้องการ
      overflowY: "auto", // เพิ่ม scroll bar เมื่อเนื้อหาเกินพื้นที่
    }}>
            {dayDoTasks.map((task, index) => (
              <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between", // จัดวางให้แต่ละส่วนห่างกัน
                borderBottom: "1px solid #eee",
                padding: 1,
                marginBottom: 1,
                gap: 2, // ระยะห่างระหว่างแต่ละส่วน
              }}
            >
              {/* Date */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: "7px",
                    height: "7px",
                    backgroundColor: task.color,
                    borderRadius: "50%",
                    marginRight: 1,
                  }}
                />
                <Typography sx={{ fontWeight: "300" , fontSize: "15px"}}> {task.time}</Typography>
              </Box>
              
              {/* Time */}
              <Typography sx={{ flex: 1 , fontWeight: "300" , fontSize: "15px" }}>
              {task.task}
              </Typography>
              
              {/* Priority */}
              <Typography
                sx={{
                   fontWeight: "300" , fontSize: "15px",
                  color:
                    task.priority === "High Priority"
                      ? "red"
                      : task.priority === "Medium Priority"
                      ? "orange"
                      : "green",
                }}
              >{task.priority}
              </Typography>
            </Box>
            ))}
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
       fontWeight: "400" , fontSize: "20px"
    }}
  >
    Schedule
  </Typography>
  <Box
    sx={{
      backgroundColor: "#fff",
      padding: 2,
      borderRadius: "0 0 5px 5px",
      height: "400px", // กำหนดความสูงที่ต้องการ
      overflowY: "auto", // เพิ่ม scroll bar เมื่อเนื้อหาเกินพื้นที่
    }}
  >
    {monthDoTasks.map((task, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // จัดวางให้แต่ละส่วนห่างกัน
          borderBottom: "1px solid #eee",
          padding: 1,
          marginBottom: 1,
          gap: 2, // ระยะห่างระหว่างแต่ละส่วน
        }}
      >
        {/* Date */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: "7px",
              height: "7px",
              backgroundColor: task.color,
              borderRadius: "50%",
              marginRight: 1,
            }}
          />
          <Typography sx={{ fontWeight: "300" , fontSize: "15px"}}>{task.date}</Typography>

        </Box>
        
        {/* Time */}
        <Typography sx={{ flex: 1 , fontWeight: "300" , fontSize: "15px" }}>
         {task.time}
        </Typography>
        
        {/* Task */}
        <Typography sx={{ flex: 2 ,  fontWeight: "300" , fontSize: "15px"}}>
          {task.task}
        </Typography>
        
        {/* Priority */}
        <Typography
          sx={{
             fontWeight: "300" , fontSize: "15px",
            color:
              task.priority === "High Priority"
                ? "red"
                : task.priority === "Medium Priority"
                ? "orange"
                : "green",
          }}
        >{task.priority}
        </Typography>
      </Box>
    ))}
  </Box>
</Box>

        </div>
        </div>
      </Box>
    </Box>
  );
};

export default Schedule;
