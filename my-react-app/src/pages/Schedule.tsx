import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper , Divider } from "@mui/material";

const Schedule: React.FC = () => {
  const dayDoTasks = [
    { time: "ตลอดวัน", task: "Quiz : SE", priority: "High Priority", color: "red" },
    { time: "10 ถึง 10:30am", task: "Act 4 SE", priority: "Medium Priority", color: "orange" },
    { time: "4:30 ถึง 5:30pm", task: "HW 3 : Blockchain", priority: "Low Priority", color: "yellow" },
  ];

  const monthDoTasks = [
    { date: "1 ธ.ค., ศ.", time: "ตลอดวัน", task: "Pay tuition (วันที่ 5/5)", color: "red" },
    { date: "3 ธ.ค., อา.", time: "9 ถึง 10am", task: "Assign 1 : SE", color: "yellow" },
    { date: "3 ถึง 4pm", time: "", task: "Act 2 SE", color: "orange" },
    { date: "4 ธ.ค., จ.", time: "ตลอดวัน", task: "Quiz 0 : SE", color: "red" },
    { date: "5 ธ.ค., อ.", time: "ตลอดวัน", task: "วันคล้ายวันพระราชสมภพ พระบาทสมเด็จพระเจ้าอยู่หัว", color: "red" },
    { date: "6 ธ.ค., พ.", time: "ตลอดวัน", task: "Day off", color: "red" },
    { date: "7 ธ.ค., พฤ.", time: "ตลอดวัน", task: "Quiz : SE", color: "red" },
    { date: "10 ถึง 10:30am", time: "", task: "Act 4 SE", color: "orange" },
    { date: "4:30 ถึง 5:30pm", time: "", task: "HW 3 : Blockchain", color: "yellow" },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f9f9fb",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          marginTop: "-10px",
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
      <Typography variant="h6" sx={{ marginBottom: 4, color: "gray" }}>
        7 December 2024
      </Typography>

      {/* Day Do Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Box
          sx={{
            backgroundColor: "#A294F9",
            padding: 2,
            borderRadius: "10px 10px 0 0",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
            Day Do
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#F5F5F5",
            padding: 2,
            borderRadius: "0 0 10px 10px",
          }}
        >
          <Box>
            {dayDoTasks.map((task, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}
              >
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: task.color,
                    borderRadius: "50%",
                    marginRight: 2,
                  }}
                />
                <Typography>{`${task.time} - ${task.task}`}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ color: "#A294F9" }}>High Priority</Typography>
            <Typography sx={{ color: "orange" }}>Medium Priority</Typography>
            <Typography sx={{ color: "yellow" }}>Low Priority</Typography>
          </Box>
        </Box>
      </Box>

      {/* Month Do Section */}
      <Box>
        <Box
          sx={{
            backgroundColor: "#A294F9",
            padding: 2,
            borderRadius: "10px 10px 0 0",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
            Month Do
          </Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Task</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthDoTasks.map((task, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: "10px",
                          height: "10px",
                          backgroundColor: task.color,
                          borderRadius: "50%",
                          marginRight: 1,
                        }}
                      />
                      {task.date}
                    </Box>
                  </TableCell>
                  <TableCell>{task.time}</TableCell>
                  <TableCell>{task.task}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      </div>
    </Box>
  
  );
};

export default Schedule;
