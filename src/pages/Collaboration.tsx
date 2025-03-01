import { useState, useEffect } from "react";
import {
  Button,
  Divider,
  Box,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, Clock } from "lucide-react";
import MeetingCard from "./components/MeetingCard";
import PendingCard from "./components/PendingCard";
// import AwaitingCard from "./components/AwaitingCard";
import { useSMCalendar } from "smart-calendar-lib";

export interface Meeting {
  id: number;
  title: string;
  description?: string;
  next?: string;
  accepted?: number;
  declined?: number;
  pending?: number;
  totalPeople?: number;
}

const Section: React.FC<{ meetings: Meeting[]; cardType: "meeting" | "pending"  }> = ({
  meetings,
  cardType,
}) => {
  const cardComponents = {
    meeting: MeetingCard,
    pending: PendingCard,
    // awaiting: AwaitingCard,
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
  const smCalendar = useSMCalendar();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  // state สำหรับเก็บข้อมูล shared events จาก API
  const [sharedEvents, setSharedEvents] = useState<Meeting[]>([]);

  useEffect(() => {
    const fetchSharedEvents = async () => {
      try {
        const sharedEventsResponse = await smCalendar.getSharedEvents();
        console.log("Shared Events:", sharedEventsResponse);
        // สมมุติว่า sharedEventsResponse มี property sharedEvents ที่เป็น array
        setSharedEvents(sharedEventsResponse.sharedEvents);
      } catch (error) {
        console.error("Error fetching shared events:", error);
      }
    };
    fetchSharedEvents();
  }, []);

  // ข้อมูลตัวอย่างสำหรับ Scheduled Meetings ยังคงเดิม
  const scheduledMeetings: Meeting[] = [
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

  // ใช้ข้อมูล sharedEvents ที่ได้จาก API สำหรับ Pending และ Awaiting
  const pendingConfirmations: Meeting[] = sharedEvents;
  // const awaitingResponses: Meeting[] = sharedEvents;

  const scheduledCount = scheduledMeetings.length;
  const pendingCount = pendingConfirmations.length;
  // const awaitingCount = awaitingResponses.length;

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
          onChange={(_event, newValue) => setSelected(newValue)}
          showLabels
          sx={{ width: "80%", backgroundColor: "transparent" }}
        >
          <BottomNavigationAction
            label={
              <Box display="flex" alignItems="center">
                Scheduled Meetings
                <Badge badgeContent={scheduledCount} color="error" sx={{ marginLeft: "16px" }} />
              </Box>
            }
            icon={<CalendarCheck size={28} color={selected === 0 ? "#7b61ff" : "#9E9E9E"} />}
            disableRipple
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
            icon={<Clock size={28} color={selected === 1 ? "#7b61ff" : "#9E9E9E"} />}
            disableRipple
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

          {/* <BottomNavigationAction
            label={
              <Box display="flex" alignItems="center">
                Awaiting Responses
                <Badge badgeContent={awaitingCount} color="error" sx={{ marginLeft: "16px" }} />
              </Box>
            }
            icon={<MessageCircle size={28} color={selected === 2 ? "#7b61ff" : "#9E9E9E"} />}
            disableRipple
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
          /> */}
        </BottomNavigation>
      </div>

      {/* แสดง Section ตามปุ่มที่เลือก */}
      {selected === 0 && <Section meetings={scheduledMeetings} cardType="meeting" />}
      {selected === 1 && <Section meetings={pendingConfirmations} cardType="pending" />}
      {/* {selected === 2 && <Section meetings={awaitingResponses} cardType="awaiting" />} */}
    </div>
  );
};

export default Collaboration;
