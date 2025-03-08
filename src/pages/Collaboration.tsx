import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
  Box,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
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

const Section: React.FC<{ meetings: Meeting[]; cardType: "meeting" | "pending" }> = ({
  meetings,
  cardType,
}) => {

  if (!meetings || meetings.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="body1" sx={{ fontSize: "36px", color: "#e5e5e5" , fontFamily: "kanit" , fontWeight: "300" }}>
        No meetings have been generated yet.
          <br />
          <span style={{ color: "#7b61ff" }}>Please wait for pending meetings</span>
        </Typography>
      </Box>
    );
  }

  if (cardType === "pending" && (!meetings || meetings.length === 0)) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography
          variant="body1"
          sx={{ fontSize: "36px", color: "#e5e5e5", fontFamily: "Kanit", fontWeight: "300" }}
        >
          No groups have been created yet.
          <br />
          <span style={{ color: "#7b61ff" }}>Please click + Add New</span>
        </Typography>
      </Box>
    );
  }

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
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchSharedEvents = async () => {
      try {
        const sharedEventsResponse = await smCalendar.getSharedEvents();
        console.log("Shared Events:", sharedEventsResponse);
        const auth = await smCalendar.getUser();
        console.log("auth Events:", auth);
        setCurrentUser(auth);
        // สมมุติว่า sharedEventsResponse มี property sharedEvents ที่เป็น array
        setSharedEvents(sharedEventsResponse.sharedEvents);
      } catch (error) {
        console.error("Error fetching shared events:", error);
      }
    };
    fetchSharedEvents();
  }, []);

  // สำหรับ Scheduled Meetings (แสดงเฉพาะ event ที่ status เป็น saved)
  const scheduledMeetings: Meeting[] = sharedEvents.filter((sharedEvent: any) => {
    return (
      sharedEvent.status === "saved" &&
      sharedEvent.members &&
      sharedEvent.members.some(
        (member: any) =>
          member.events &&
          member.events.some((evt: any) => evt.type === "saved_shared")
      )
    );
  });

  // สำหรับ Pending Confirmations โดยเพิ่มเงื่อนไขให้มี member ที่ตรงกับ currentUser (givenName, familyName) และ sharedEventOwner === true
  const pendingConfirmations: Meeting[] = sharedEvents.filter((sharedEvent: any) => {
    return (
      (sharedEvent.status === "pending" ||
        (sharedEvent.status === "arranged" &&
          sharedEvent.members &&
          sharedEvent.members.some(
            (member: any) =>
              member.events &&
              member.events.some((evt: any) => evt.type === "unsaved_shared")
          ))) &&
      currentUser &&
      sharedEvent.members &&
      sharedEvent.members.some((member: any) => {
        return (
          member.sharedEventOwner === true &&
          member.givenName === currentUser.firstName &&
          member.familyName === currentUser.lastName
        );
      })
    );
  });

  const scheduledCount = scheduledMeetings.length;
  const pendingCount = pendingConfirmations.length;

  // ถ้าทั้ง scheduledMeetings และ pendingConfirmations ว่าง ให้แสดงข้อความ "No groups have been created yet. Let's start creating groups. Press + Add new"
  const noData = scheduledCount === 0 && pendingCount === 0;

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

      {/* ถ้าไม่มีข้อมูลในทั้งสอง Section ให้แสดงข้อความพร้อมปุ่ม */}
      {noData ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body1" sx={{ fontSize: "36px", mb: 2 , fontFamily: "kanit" , fontWeight: "400"}}>
            No groups have been created yet. Let's start creating groups.
            <br />
            <span style={{ color: "#7b61ff" }}>Please click + Add New</span>
          </Typography>
        </Box>
      ) : (
        <>
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
                    <Badge
                      badgeContent={scheduledCount}
                      color="error"
                      sx={{ marginLeft: "16px" }}
                    />
                  </Box>
                }
                icon={
                  <CalendarCheck
                    size={28}
                    color={selected === 0 ? "#7b61ff" : "#9E9E9E"}
                  />
                }
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
                    <Badge
                      badgeContent={pendingCount}
                      color="error"
                      sx={{ marginLeft: "16px" }}
                    />
                  </Box>
                }
                icon={
                  <Clock
                    size={28}
                    color={selected === 1 ? "#7b61ff" : "#9E9E9E"}
                  />
                }
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
            </BottomNavigation>
          </div>

          {/* แสดง Section ตามปุ่มที่เลือก */}
          {selected === 0 && <Section meetings={scheduledMeetings} cardType="meeting" />}
          {selected === 1 && <Section meetings={pendingConfirmations} cardType="pending" />}
        </>
      )}
    </div>
  );
};

export default Collaboration;
