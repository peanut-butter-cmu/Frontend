import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Typography, Box, IconButton } from "@mui/material";
import Divider from "@mui/material/Divider";
import Calendar from "../pages/components/Calendar";
import { useSMCalendar } from "smart-calendar-lib";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";

const CollabGanerate = () => {
  const smCalendar = useSMCalendar();
  const navigate = useNavigate();
  const location = useLocation();
  const meetingId = location.state?.meetingId;

  const [arrangedEvent, setArrangedEvent] = useState<any>(null);

  useEffect(() => {
    const fetchArrangedEvent = async () => {
      try {
        const event = await smCalendar.getSharedEvent(meetingId);
        console.log("Arranged Event:", event);
        setArrangedEvent(event);
      } catch (error) {
        console.error("Error fetching arranged event:", error);
      }
    };
    if (meetingId) {
      fetchArrangedEvent();
    }
  }, [meetingId]);

  const handleSave = async () => {
    if (!meetingId) return;

    const result = await Swal.fire({
      title: "Confirm Save",
      text: "Are you sure you want to save this shared event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await smCalendar.postSaveSharedEvent(meetingId);
      console.log("Shared event saved:", response);
      Swal.fire({
        title: "Success",
        text: "Shared event saved successfully",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });

      navigate("/Collaboration", { state: { tab: "pending" } });
    } catch (error) {
      console.error("Error saving shared event:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to save shared event",
        icon: "error",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  };

  const handleCancel = () => {
    navigate("/Collaboration", { state: { tab: "pending" } });
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
      <div
        style={{
          marginTop: "10px",
          marginBottom: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "16px 270px",
          gap: "8px",
        }}
      >
        <IconButton onClick={() => navigate("/Collaboration")}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
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
          justifyContent: "center",
          gap: "20px",
          padding: "32px 0",
          marginTop: "-10px",
        }}
      >
        <div
          style={{
            backgroundColor: "#EAE6FB",
            padding: "40px",
            borderRadius: "12px",
            display: "flex",
            gap: "40px",
            width: "90%",
            maxWidth: "800px",
            minHeight: "500px",
          }}
        >
          {/* Calendar Section */}
          <div
            style={{
              borderRadius: "10px",
              flex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar
              startDate={
                arrangedEvent &&
                arrangedEvent.members &&
                arrangedEvent.members.length > 0 &&
                arrangedEvent.members[0].events.length > 0
                  ? arrangedEvent.members[0].events[0].start
                  : null
              }
            />
          </div>

          {/* Events Section */}
          <div
            style={{
              backgroundColor: "#fff",

              borderRadius: "12px",
              width: "420px",
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            <Box
              sx={{
                width: "420px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#8B5DFF",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                {arrangedEvent &&
                arrangedEvent.members &&
                arrangedEvent.members.length > 0 &&
                arrangedEvent.members[0].events &&
                arrangedEvent.members[0].events.length > 0
                  ? arrangedEvent.members[0].events[0].title
                  : "Default Title"}
              </Typography>
            </Box>
            <div style={{ padding: "15px" }}>
              {arrangedEvent &&
                arrangedEvent.members &&
                arrangedEvent.members.length > 0 &&
                arrangedEvent.members[0].events.map(
                  (event: any, index: any) => (
                    <Card
                      key={index}
                      sx={{
                        marginBottom: "12px",
                        padding: "10px",
                        borderRadius: "10px",
                        backgroundColor: "#F8FAFC",
                        boxShadow: "none",
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="500"
                        sx={{ marginLeft: "20px" }}
                      >
                        {new Date(event.start).toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Typography>
                      <Typography variant="body2" sx={{ marginLeft: "20px" }}>
                        Time:{" "}
                        {new Date(event.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "UTC",
                        })}{" "}
                        -{" "}
                        {new Date(event.end).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "UTC",
                        })}
                      </Typography>
                    </Card>
                  )
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Log arranged event */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <button
          style={{
            backgroundColor: "#ff0000",
            color: "white",
            fontSize: "17px",
            fontWeight: "400",
            height: "45px",
            borderRadius: "15px",
            border: "none",
            cursor: "pointer",
            width: "200px",
          }}
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          style={{
            backgroundColor: "#15B392",
            color: "white",
            fontSize: "17px",
            fontWeight: "400",
            height: "45px",
            borderRadius: "15px",
            border: "none",
            cursor: "pointer",
            width: "200px",
          }}
          onClick={handleSave}
        >
          Save to calendar
        </button>
      </div>
    </div>
  );
};

export default CollabGanerate;
