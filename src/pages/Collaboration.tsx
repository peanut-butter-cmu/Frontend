import { useState } from "react"; 
import {
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Divider,
  Box,
  Badge,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { CalendarCheck, Clock, MessageCircle } from "lucide-react";

interface Meeting {
  id: number;
  title: string;
  description?: string;
  next?: string;
  accepted?: number;
  declined?: number;
  pending?: number;
  totalPeople?: number;
}


const MeetingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        width: "300px",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <CardContent>
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            display: "flex",
            gap: "1px",
          }}
        >
          <IconButton
            sx={{
              color: "#e5e5e5",
              transition: "color 0.3s",
              "&:hover": { color: "#1D24CA" },
            }}
            onClick={() => navigate("/Collaboration-Edit")} 
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            sx={{
              color: "#e5e5e5",
              transition: "color 0.3s",
              "&:hover": { color: "#ff0000" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between",  marginTop:"25px"}}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "400",
                fontSize: "18px",
                textAlign: "center",
                fontFamily: "Kanit",
              }}
            >
              {meeting.title}
            </Typography>
          </div>
        </div>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ fontSize: "14px", fontWeight: "300", fontFamily: "Kanit" }}
        >
          {meeting.description}
        </Typography>
        <div
          style={{
            marginTop: "10px",
            padding: "6px 12px",
            backgroundColor: "#e3e0ff",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              fontSize: "15px",
              color: "#000",
              fontFamily: "Kanit",
            }}
          >
            Next: {meeting.next}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

const PendingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
  const navigate = useNavigate(); // ✅ ใช้ useNavigate() ในตำแหน่งที่ถูกต้อง

  return (
    <Card
      sx={{
        width: "300px",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "400",
                fontSize: "18px",
                textAlign: "center",
                fontFamily: "Kanit",
              }}
            >
              {meeting.title}
            </Typography>
          </div>
        </div>
        
        {/* ข้อความแจ้งเตือน */}
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ fontSize: "14px", fontWeight: "300", fontFamily: "Kanit", textAlign: "center", marginTop: "8px" }}
        >
          All members are ready!
        </Typography>

        {/* ปุ่ม Action */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            marginTop: "10px",
            padding: "4px",
            backgroundColor: "#e3e0ff",
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "0px 2px 6px rgba(123, 97, 255, 0.3)",
            color: "#000",
            fontFamily: "Kanit",
            fontSize: "15px",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#6542f4",
              boxShadow: "0px 4px 10px rgba(123, 97, 255, 0.5)",
              color: "#fff",
            },
          }}
          onClick={() => navigate("/Collaboration-Gen")} 
        >
          Next Step
        </Button>
      </CardContent>
    </Card>
  );
};


const AwaitingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
  const statuses = [
    {
      label: "Accepted",
      count: meeting.accepted,
      color: "#000",
      bgColor: "#EAFAEA",
    },
    {
      label: "Declined",
      count: meeting.declined,
      color: "#000",
      bgColor: "#FFE2E2",
    },
    {
      label: "Pending",
      count: meeting.pending,
      color: "#000",
      bgColor: "#F5F5F5",
    },
  ];

  return (
    <Card
      sx={{
        width: "300px",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "400", fontSize: "18px", fontFamily: "Kanit" }}
          >
            {meeting.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "14px", color: "#666", fontFamily: "Kanit" }}
          >
            {meeting.pending}/{meeting.totalPeople} people
          </Typography>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            marginTop: "10px",
          }}
        >
          {statuses.map((status) => (
            <div
              key={status.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 12px",
                backgroundColor: status.bgColor,
                borderRadius: "8px",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 400,
                  fontSize: "15px",
                  color: status.color,
                  fontFamily: "Kanit",
                }}
              >
                {status.label}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 400,
                  fontSize: "15px",
                  color: status.color,
                  fontFamily: "Kanit",
                }}
              >
                {status.count}
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Section: React.FC<{ meetings: Meeting[]; cardType: "meeting" | "pending" | "awaiting" }> = ({ meetings, cardType }) => {
  const cardComponents = {
    meeting: MeetingCard,
    pending: PendingCard,
    awaiting: AwaitingCard,
  };

  const CardComponent = cardComponents[cardType];

  return (
    <div>
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          padding: "0 40px",
          marginBottom: "20px",
        }}
      >
        {meetings.map((meeting, index) => (
          <CardComponent key={index} meeting={meeting} />
        ))}
      </div>
    </div>
  );
};

const Collaboration = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);


  const scheduledMeetings = [
    {
      id: 1,
      title: "Meeting Adv CPE",
      description: "Every Tuesday for 30 mins",
      next: "Tue, 05 Feb at 14:00",
    },
    {
      id: 2,
      title: "UX Review",
      description: "Every Monday for 45 mins",
      next: "Mon, 12 Feb at 10:30",
    },
  ];
  const pendingConfirmations = [
    { id: 2, title: "Project Kickoff", description: "Discuss project scope" },
  ];
  const awaitingResponses = [
    {
      id: 8,
      title: "Marketing Sync",
      totalPeople: 10,
      accepted: 6,
      declined: 2,
      pending: 2,
    },
  ];

  const scheduledCount = scheduledMeetings.length;
const pendingCount = pendingConfirmations.length;
const awaitingCount = awaitingResponses.length;


  const handleAddGroup = () => {
    navigate("/Collaboration-Config");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        minHeight: "100vh", 
      }}
    >
      {/* Header */}
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
        <h2 style={{ margin: 0, fontSize: "34px", fontWeight: 300 }}>
          Collaboration
        </h2>
        <Button
          onClick={handleAddGroup}
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "transparent",
            color: "#7b61ff",
            borderRadius: "10px",
            fontSize: "16px",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#7b61ff",
              color: "#fff",
              boxShadow: "none",
            },
          }}
        >
          + Add Group
        </Button>
      </div>
      <Divider sx={{ borderColor: "#e5e5e5", mb: 2 }} />

      {/* ปุ่มเลือก Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "40px",
          marginTop: "10px",
        }}
      >
        <BottomNavigation
          value={selected}
          onChange={(event, newValue) => setSelected(newValue)}
          showLabels={true} 
          sx={{ width: "80%", backgroundColor: "transparent" }} 
        >
          <BottomNavigationAction
            label={
              <Box display="flex" alignItems="center">
                Scheduled Meetings
                <Badge
                  badgeContent={scheduledCount}
                  color="error"
                  sx={{ marginLeft: "16px"  }} // เพิ่มระยะห่างระหว่าง label กับ badge
                />
              </Box>
            }
            icon={
              <CalendarCheck
                size={28} 
                color={selected === 0 ? "#7b61ff" : "#9E9E9E"} 
              />
            }
            disableRipple={true}
            sx={{
              flex: 1,
              minWidth: "200px",
              gap: "4px",
              "& .MuiBottomNavigationAction-label": {
                fontSize: "14px",
                fontWeight: selected === 0 ? "bold" : "normal",
                color: selected === 0 ? "#7b61ff" : "#9E9E9E",
                paddingTop: "6px",
              },
            }}
          />

          <BottomNavigationAction
              label={
                <Box display="flex" alignItems="center">
                  Pending Confirmation
                  <Badge badgeContent={pendingCount} color="error" sx={{ marginLeft: "16px" }} />
                </Box>
              }
            icon={
              <Clock
                size={28} 
                color={selected === 1 ? "#7b61ff" : "#9E9E9E"} 
              />
            }
            disableRipple={true}
            sx={{
              flex: 1,
              minWidth: "200px",
              gap: "4px",
              "& .MuiBottomNavigationAction-label": {
                fontSize: "14px",
                fontWeight: selected === 1 ? "bold" : "normal",
                color: selected === 1 ? "#7b61ff" : "#9E9E9E",
                paddingTop: "6px",
              },
            }}
          />

          <BottomNavigationAction
            label={
              <Box display="flex" alignItems="center">
                Awaiting Responses
                <Badge badgeContent={awaitingCount} color="error" sx={{ marginLeft: "16px" }} />
              </Box>
            }
            icon={
              <MessageCircle
                size={28} 
                color={selected === 2 ? "#7b61ff" : "#9E9E9E"} 
              />
            }
            disableRipple={true}
            sx={{
              flex: 1,
              minWidth: "200px",
              gap: "4px",
              "& .MuiBottomNavigationAction-label": {
                fontSize: "14px",
                fontWeight: selected === 2 ? "bold" : "normal",
                color: selected === 2 ? "#7b61ff" : "#9E9E9E",
                paddingTop: "6px",
              },
            }}
          />
        </BottomNavigation>
      </div>

      {/* แสดง Section ตามปุ่มที่เลือก */}
      {selected === 0 && (
        <Section meetings={scheduledMeetings} cardType="meeting" />
      )}
      {selected === 1 && (
        <Section meetings={pendingConfirmations} cardType="pending" />
      )}
      {selected === 2 && (
        <Section meetings={awaitingResponses} cardType="awaiting" />
      )}
    </div>
  );
};

export default Collaboration;
