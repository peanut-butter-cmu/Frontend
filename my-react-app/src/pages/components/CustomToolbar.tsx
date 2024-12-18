import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const CustomToolbar = (props) => {
  const [view, setView] = useState("month");
  const { onNavigate, onView, label, unreadCount } = props;

  useEffect(() => {
    setView(label); // อัปเดต View ปัจจุบันจาก FullCalendar
  }, [label]);

  const handleViewChange = (newView) => {
    setView(newView);
    onView(newView);
  };



  const goToToday = () => {
    props.onNavigate("TODAY");
  };

  const goToBack = () => {
    props.onNavigate("PREV");
  };

  const goToNext = () => {
    props.onNavigate("NEXT");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        // background: "linear-gradient(to right, #E9E8FF, #8576FF)",
        background: "#8576FF",
        padding: "5px 20px",
        borderRadius: "0px 0px 0 0",
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <p
          style={{
            marginLeft: "20px",
            margin: 0,
            fontWeight: "500",
            fontSize: "22px",
            color: "#fff",
          }}
        >
          {props.label}
        </p>
        <div style={{ display: "flex" }}>
          <button
             onClick={() => onNavigate("PREV")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "10px",
              height: "25px",
              backgroundColor: "#fff",
              border: "none",
              cursor: "pointer",
              marginLeft: "10px",
              marginRight: "5px",
            }}
          >
            <ArrowBackIcon style={{ color: "#8C65F8", fontSize: "18px" }} />
          </button>

          <button
             onClick={() => onNavigate("NEXT")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "10px",
              height: "25px",
              backgroundColor: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ArrowForwardIcon style={{ color: "#8C65F8", fontSize: "18px" }} />
          </button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#ffffff",
            borderRadius: "30px",
            padding: "2px",
            boxShadow: "inset 0px 2px 6px rgba(0, 0, 0, 0.2)",
            gap: "1px",
          }}
        >
          {["dayGridDay", "timeGridWeek", "dayGridMonth"].map((item) => (
            <button
              key={item}
              onClick={() => handleViewChange(item)}
              style={{
                background: view === item ? "#7c4dff" : "transparent",
                color: view === item ? "#fff" : "#8576FF",
                fontSize: "15px",
                fontWeight: "500",
                border: "none",
                padding: "3px 20px",
                cursor: "pointer",
                borderRadius: "20px",
                transition: "background 0.3s, color 0.3s",
                boxShadow: view === item
                  ? "inset 0 2px 6px rgba(0, 0, 0, 0.2)"
                  : "none",
              }}
            >
             {item === "dayGridMonth"
              ? "Month"
              : item === "timeGridWeek"
              ? "Week"
              : "Day"}
            </button>
          ))}
        </div>
        <button
         onClick={() => onNavigate("TODAY")}
          style={{
            background: "#fff",
            color: "#8576FF",
            borderRadius: "10px",
            padding: "3px 10px",
            cursor: "pointer",
            fontSize: "15px",
            border: "none",
            fontWeight: "500",
            marginRight: "-10px",
          }}
        >
          Today
        </button>
        <IconButton onClick={props.onToggleRightSidebar}>
          <Badge
            variant="dot"
            invisible={unreadCount === 0}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#ff0000",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                right: "7px",
                top: "4px",
              }
            }}
          >
            <NotificationsIcon style={{ color: "#fff", fontSize: "30px" }} />
          </Badge>
        </IconButton>
      </div>
    </div>
  );
};

export default CustomToolbar;
