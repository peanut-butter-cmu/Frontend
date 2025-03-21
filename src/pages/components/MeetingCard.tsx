import React, { useState } from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/Today";
import EventDetailsPopup from "../CollaboarationView";
import { useSMCalendar } from "smart-calendar-lib";
import Swal from "sweetalert2";

interface Meeting {
  id: number;
  title: string;
  members?: {
    events?: {
      start: string;
    }[];
  }[];
}

const MeetingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const smCalendar = useSMCalendar();

  const totalEvents =
    meeting.members?.reduce(
      (acc, member) => acc + (member.events ? member.events.length : 0),
      0
    ) ?? 0;

  const nextEventStart =
    meeting.members &&
    meeting.members.length > 0 &&
    meeting.members[0].events &&
    meeting.members[0].events.length > 0
      ? meeting.members[0].events[0].start
      : "";
  const formattedNextDate = nextEventStart
    ? new Date(nextEventStart).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "No upcoming event";

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await smCalendar.deleteSharedEvent(meeting.id);
      console.log("Event deleted successfully");
      Swal.fire({
        title: "Deleted!",
        text: "Your event has been deleted.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete event",
        icon: "error",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <>
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
              onClick={() => setPopupOpen(true)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>

            <IconButton
              sx={{
                color: "#e5e5e5",
                transition: "color 0.3s",
                "&:hover": { color: "#ff0000" },
              }}
              onClick={handleDelete}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>

          {/* Card Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "25px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
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

          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontSize: "14px", fontWeight: "300", fontFamily: "Kanit" }}
            >
              Meeting : {totalEvents} sessions
            </Typography>
          </Box>

          {/* แสดงวันที่จาก start ของ event แรก */}
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
              Next: {formattedNextDate}
            </Typography>
          </div>
        </CardContent>
      </Card>
      <EventDetailsPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        meetingId={meeting.id ?? 0}
      />
    </>
  );
};

export default MeetingCard;
