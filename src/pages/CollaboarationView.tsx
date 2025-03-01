import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import RemoveIcon from "@mui/icons-material/Remove";
import { CheckCircle, XCircle } from "lucide-react";

const CollabEdit = () => {
  const meetingInfo = {
    title: "Meeting Adv CPE",
    date: "21 Jan 2025 - 12 Mar 2025",
    duration: "30 Mins",
    repeat: "Every Tuesday",
    organizer: "napatsiri_p",
    attendee: "perapol_p",
    priority: "Medium",
    sessions: [
      { date: "22 Jan 2025", time: "14:00 - 14:30", status: "accepted" },
      { date: "29 Jan 2025", time: "14:00 - 14:30", status: "accepted" },
      { date: "05 Feb 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "12 Feb 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "19 Feb 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "26 Feb 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "06 Mar 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "06 Mar 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "06 Mar 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "06 Mar 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "06 Mar 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "06 Mar 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "06 Mar 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "06 Mar 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "06 Mar 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "06 Mar 2025", time: "14:00 - 14:30", status: "pending" },
      { date: "06 Mar 2025", time: "14:00 - 14:30", status: "pending" },
    ],
  };

  return (
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
          Collaboration
        </h2>
      </div>

      <Divider sx={{ borderColor: "#e5e5e5", mb: 2 }} />
      <div
        style={{
          display: "flex",
          flex: 1,
          overflowY: "auto",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "12px",
            backgroundColor: "#EDE9FE",
            padding: "30px",
            gap: "5px",
          }}
        >
          <div
            style={{
              width: "80%",
              backgroundColor: "#fff",
              marginBottom: "15px",
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "24px",
            }}
          >
            {/* Meeting Title */}
            <Typography
              variant="h5"
              sx={{ fontWeight: "500", marginBottom: "16px" }}
            >
              {meetingInfo.title}
            </Typography>

            {/* Meeting Info */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px auto",
                rowGap: "6px",
              }}
            >
              <Typography sx={{ fontWeight: "500", color: "#A294F9" }}>
                Date
              </Typography>
              <Typography sx={{ color: "#000" }}>{meetingInfo.date}</Typography>

              <Typography sx={{ fontWeight: "500", color: "#A294F9" }}>
                Duration
              </Typography>
              <Typography sx={{ color: "#000" }}>
                {meetingInfo.duration}
              </Typography>

              <Typography sx={{ fontWeight: "500", color: "#A294F9" }}>
                Repeat
              </Typography>
              <Typography sx={{ color: "#000" }}>
                {meetingInfo.repeat}
              </Typography>

              <Typography sx={{ fontWeight: "500", color: "#A294F9" }}>
                Organizer
              </Typography>
              <Typography sx={{ color: "#000" }}>
                {meetingInfo.organizer}
              </Typography>

              <Typography sx={{ fontWeight: "500", color: "#A294F9" }}>
                Attendee
              </Typography>
              <Typography sx={{ color: "#000" }}>
                {meetingInfo.attendee}
              </Typography>

              <Typography sx={{ fontWeight: "500", color: "#A294F9" }}>
                Priority
              </Typography>
              <Typography sx={{ color: "#000" }}>
                {meetingInfo.priority}
              </Typography>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#fff", // White container
              borderRadius: "12px",
              padding: "16px",
              maxHeight: "45vh",
              overflow: "auto",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              width: "95%",
            }}
          >
            {/* Table */}
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table>
                {/* Table Header */}
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        borderBottom: "2px solid #E0E0E0",
                      }}
                    >
                      Time
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        borderBottom: "2px solid #E0E0E0",
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        borderBottom: "2px solid #E0E0E0",
                      }}
                    >
                      Progress
                    </TableCell>
                    <TableCell
                      sx={{ borderBottom: "2px solid #E0E0E0" }}
                    ></TableCell>
                  </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody sx={{ paddingTop: "10px" }}>
                  {meetingInfo.sessions.map((session, index) => (
                    <TableRow
                      key={index}
                      sx={{ backgroundColor: "transparent", height: "40px" }}
                    >
                      <TableCell
                        sx={{
                          fontSize: "14px",
                          borderBottom: "none",
                          padding: "4px 8px",
                        }}
                      >
                        {session.time}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "14px",
                          fontWeight: "400",
                          borderBottom: "none",
                          padding: "4px 8px",
                        }}
                      >
                        {session.date}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "14px",
                          borderBottom: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 8px",
                        }}
                      >
                        {session.status === "accepted" ? (
                          <>
                            <CheckCircle
                              color="#16C47F"
                              size={18}
                              strokeWidth={2}
                            />
                            <span
                              style={{ color: "#16C47F", fontWeight: "500" }}
                            >
                              Meeting Completed
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle
                              color="#B7B7B7"
                              size={18}
                              strokeWidth={2}
                            />
                            <span
                              style={{ color: "#B7B7B7", fontWeight: "500" }}
                            >
                              Not Started
                            </span>
                          </>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "none", padding: "4px 8px" }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            color: "#ff0000",
                            "&:hover": { color: "#B91C1C" },
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollabEdit;
