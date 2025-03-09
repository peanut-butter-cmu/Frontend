import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface CustomToolbarProps {
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  onView: (view: "timeGridDay" | "timeGridWeek" | "dayGridMonth") => void;
  label: string;
  unreadCount: number;
  currentView: "timeGridDay" | "timeGridWeek" | "dayGridMonth";
  onToggleRightSidebar: () => void;
}

const CustomToolbar: React.FC<CustomToolbarProps> = (props) => {
  const {
    onNavigate,
    onView,
    label,
    unreadCount,
    currentView,
    onToggleRightSidebar,
  } = props;
  const [view, setView] = useState<
    "timeGridDay" | "timeGridWeek" | "dayGridMonth"
  >(currentView);

  useEffect(() => {
    setView(currentView);
  }, [currentView]);

  const handleViewChange = (
    newView: "timeGridDay" | "timeGridWeek" | "dayGridMonth"
  ) => {
    if (newView !== view) {
      setView(newView);
      onView(newView);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#8576FF",
        padding: "5px 20px",
        borderRadius: "0px 0px 0 0",
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
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
              marginRight: "10px",
            }}
          >
            <ArrowForwardIcon style={{ color: "#8C65F8", fontSize: "18px" }} />
          </button>
        </div>
        <p
          style={{
            margin: 0,
            fontWeight: "500",
            fontSize: "22px",
            color: "#fff",
          }}
        >
          {label}
        </p>
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
          {["timeGridDay", "timeGridWeek", "dayGridMonth"].map((item) => (
            <button
              key={item}
              onClick={() =>
                handleViewChange(
                  item as "timeGridDay" | "timeGridWeek" | "dayGridMonth"
                )
              }
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
                boxShadow:
                  view === item ? "inset 0 2px 6px rgba(0, 0, 0, 0.2)" : "none",
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
        <IconButton onClick={onToggleRightSidebar}>
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
              },
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