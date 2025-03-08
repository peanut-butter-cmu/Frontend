"use client"
import  { useEffect, useState } from "react";
import { format } from "date-fns";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {

  Box,
  IconButton,

} from "@mui/material";
import {
  Calendar,
  Users,
  Repeat,
  Bell,
} from "lucide-react";
import { SharedEventResp, useSMCalendar } from "smart-calendar-lib";
import CloseIcon from "@mui/icons-material/Close";


interface EventDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: number;
}

export default function EventDetailsPopup({
  isOpen,
  onClose,
  meetingId,
}: EventDetailsPopupProps) {
  console.log("Meeting ID:", meetingId);
  const [sharedEventData, setSharedEventData] = useState<SharedEventResp | null>(null);
  const smCalendar = useSMCalendar();

  useEffect(() => {
    if (isOpen) {
      smCalendar
        .getSharedEvent(meetingId)
        .then((data) => {
          console.log("Shared event data:", data);
          setSharedEventData(data);
        })
        .catch((error) => {
          console.error("Error fetching shared event:", error);
        });
    }
  }, [isOpen, meetingId]);

  // ใช้ sharedEventData แทน mockEventData เมื่อมีข้อมูลมาแล้ว
  const eventData = sharedEventData;

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy");
  };

  // Helper function to format time from minutes
  const formatTimeFromMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  // Helper function to get day name
  const getDayName = (day: number) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days[day % 7];
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "90%",
          maxWidth: "800px",
          borderRadius: "16px",
        },
      }}
    >
<DialogTitle
  sx={{
    position: "relative",
    backgroundColor: "#8A5CF6",
    color: "#fff",
    textAlign: "center",
    padding: "8px",
    fontWeight: "700",
  }}
>
  Group : {eventData ? eventData.title : "Loading..."}
  <IconButton
    onClick={onClose}
    sx={{
      position: "absolute",
      right: "8px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#fff",
    }}
  >
    <CloseIcon />
  </IconButton>
</DialogTitle>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {eventData ? (
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div style={{ marginTop: "16px", marginBottom: "16px" }}>
  <div className="flex items-center gap-2">
    <span style={{ color: "#9AA6B2", fontWeight: 300 }} className="text-sm">
      Status :
    </span>
    <span className="text-sm"> {eventData.status}</span>
  </div>
  <div className="flex items-center gap-2">
    <span style={{ color: "#9AA6B2", fontWeight: 300 }} className="text-sm">
      Duration : 
    </span>
    <span className="text-sm"> {Math.floor(eventData.duration / 60)} hours {eventData.duration % 60} minutes</span>
  </div>
  <div className="flex items-center gap-2">
    <span style={{ color: "#9AA6B2", fontWeight: 300 }} className="text-sm">
      Created on :
    </span>
    <span className="text-sm"> {formatDate(eventData.createdAt)}</span>
  </div>
</div>

            {/* Accordion for detailed sections */}
            <Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Calendar style={{ width: 16, height: 16 }} />
      <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
        Preferred Time Range
      </span>
    </Box>
  </AccordionSummary>
  <AccordionDetails>
    <Box sx={{ pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
      <p style={{ fontSize: "0.875rem", margin: 0 }}>
        Start Date: {formatDate(eventData.idealTimeRange.startDate)}
      </p>
      <p style={{ fontSize: "0.875rem", margin: 0 }}>
        End Date: {formatDate(eventData.idealTimeRange.endDate)}
      </p>
      <p style={{ fontSize: "0.875rem", margin: 0 }}>
        Daily Start: {formatTimeFromMinutes(eventData.idealTimeRange.dailyStartMin)}
      </p>
      <p style={{ fontSize: "0.875rem", margin: 0 }}>
        Daily End: {formatTimeFromMinutes(eventData.idealTimeRange.dailyEndMin)}
      </p>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <p style={{ fontSize: "0.875rem", margin: 0 }}>Suitable Days:</p>
        {eventData.idealDays.map((day: number, index: number) => (
  <p key={index} style={{ fontSize: "0.875rem", margin: 0 }}>
    {getDayName(day)}
  </p>
))}

      </Box>
    </Box>
  </AccordionDetails>
</Accordion>

<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Users style={{ width: 16, height: 16 }} />
      <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
        Members ({eventData.members.length})
      </span>
    </Box>
  </AccordionSummary>
  <AccordionDetails>
    <Box sx={{ pl: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      {eventData.members && eventData.members.length > 0 && (
        <>
          {/* Event Owner Section */}
          <Box>
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Event Owner:</span>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
              {eventData.members
                .filter((member) => member.sharedEventOwner)
                .map((member, idx: number) => (
                  <span key={idx} style={{ fontSize: "0.875rem", margin: 0 }}>
                    {member.firstName} {member.middleName} {member.lastName}
                  </span>
                ))}
            </Box>
          </Box>
          {/* Participants Section */}
          <Box>
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Participants:</span>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
              {eventData.members.map((member, idx: number) => (
                <span key={idx} style={{ fontSize: "0.875rem", margin: 0 }}>
                  {member.firstName} {member.middleName} {member.lastName}
                </span>
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  </AccordionDetails>
</Accordion>

<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Repeat style={{ width: 16, height: 16 }} />
      <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Repeat</span>
    </Box>
  </AccordionSummary>
  <AccordionDetails>
    <Box sx={{ pl: 3 }}>
      {eventData.repeat ? (
        <p style={{ fontSize: "0.875rem", margin: 0 }}>
          Repeats every{" "}
          {eventData.repeat.type === "week"
            ? "week"
            : eventData.repeat.type === "month"
            ? "month"
            : "year"}{" "}
          {eventData.repeat.count} times
        </p>
      ) : (
        <p style={{ fontSize: "0.875rem", margin: 0 }}>No repeat</p>
      )}
    </Box>
  </AccordionDetails>
</Accordion>
<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Bell style={{ width: 16, height: 16 }} />
      <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Notifications</span>
    </Box>
  </AccordionSummary>
  <AccordionDetails>
    <Box sx={{ pl: 3 }}>
      {eventData.reminders.length > 0 ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
  {eventData.reminders.map((reminder, index) => (
    <p key={index} style={{ fontSize: "0.875rem", margin: 0 }}>
      {reminder} minutes before
    </p>
  ))}
</Box>

      ) : (
        <p style={{ fontSize: "0.875rem", color: "rgba(0,0,0,0.6)" }}>No notifications</p>
      )}
    </Box>
  </AccordionDetails>
</Accordion>
          </div>
        ) : (
          <p>Loading event details...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
