import React, { useState } from "react";
import MiniCalendar from "./components/MiniCalendar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CalendarTodayIcon from "@mui/icons-material/EditCalendarRounded";
import ScheduleIcon from "@mui/icons-material/CalendarViewWeekRounded";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";


const LeftSide = ({ events }) => {
  const [activeMenu, setActiveMenu] = useState("Planner"); // Default is Planner
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [showGroupCalendar, setShowGroupCalendar] = useState(true);
  const [showCollabGroup, setShowCollabGroup] = useState(true);
  const [showSubjectGroup, setShowSubjectGroup] = useState(true);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [groupVisibility, setGroupVisibility] = useState<{ [key: string]: boolean }>({
    CMU: true,
    Classroom: true,
    "Quiz & Assignment": true,
    "Final & Midterm": true,
    Holiday: true,
    Owner: true,
  });
  const [hoveredCollabGroup, setHoveredCollabGroup] = useState<string | null>(null);
  const menuItems = [
    { label: "Planner", icon: <CalendarTodayIcon style={{ color: "#A8A8A8", fontSize: "20px" }} /> },
    { label: "Schedule", icon: <ScheduleIcon style={{ color: "#A8A8A8", fontSize: "20px" }} /> },
    { label: "Collaboration", icon: <GroupIcon style={{ color: "#A8A8A8", fontSize: "20px" }} /> },
    { label: "Setting", icon: <SettingsIcon style={{ color: "#A8A8A8", fontSize: "20px" }} /> },
  ];
  

  const groupColors = {
    CMU: "#615EFC",
    Classroom: "#41B3A2",
    "Quiz & Assignment": "linear-gradient(to right, #FF6F61 50%, #FCC26D 50%)",
    "Final & Midterm": "#FF0000",
    Holiday: "#9DBDFF",
    Owner: "#D6C0B3",
  };

  const collabGroups = ["Project Boo", "Project Adv Copm"];
  const subjects = [
    { id: "261448", name: "Data Mining" },
    { id: "261305", name: "Operating System" },
  ];

  const toggleGroupVisibility = (group) => {
    setGroupVisibility((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const renderPlanner = () => (
    <div>
      <div style={{ textAlign: "center", marginTop: "-5px" , marginBottom: "-5px" }}>
      <h1
        style={{
          fontSize: "20px",
          fontWeight: "500",
          color: "#8A5CF6", // Adjusted to match the purple color
          margin: 0,
        }}
      >
        Planner
      </h1>
       <Divider sx={{ borderColor: "#A294F9", mb: 2 }} />
    </div>
      {/* Group Calendar */}
      <div style={{ marginBottom: "10px" }}> {/* Add margin-bottom here */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setShowGroupCalendar(!showGroupCalendar)}
        >
          <p style={{ margin: 0, fontSize: "18px", fontWeight: "300" }}>
            Group Calendar
          </p>
          {showGroupCalendar ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </div>
  
        {showGroupCalendar && (
          <ul style={{ listStyle: "none", padding: "5px 0 0", margin: 0 }}>
            {Object.keys(groupColors).map((group) => (
              <li
              key={group}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "15px",
                fontWeight: "200",
                padding: "3px", // Keep padding consistent
                gap: "10px",
                height: "25px", // Fixed height to prevent shifting
                lineHeight: "25px", // Ensure consistent line spacing
                borderRadius: "4px",
                backgroundColor:
                  hoveredGroup === group ? "#EEEDEB" : "transparent",
                transition: "background-color 0.2s ease", // Smooth hover effect
              }}
              onMouseEnter={() => setHoveredGroup(group)}
              onMouseLeave={() => setHoveredGroup(null)}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  background: groupColors[group],
                  borderRadius: "2px",
                }}
              />
              {group}
            
              {hoveredGroup === group && (
                <div style={{ marginLeft: "auto", display: "flex", gap: "5px" }}>
                  <span
                    onClick={() => toggleGroupVisibility(group)}
                    style={{ cursor: "pointer" }}
                  >
                    {groupVisibility[group] ? (
                      <VisibilityIcon style={{ fontSize: "18px", color: "#A8A8A8" }} />
                    ) : (
                      <VisibilityOffIcon style={{ fontSize: "18px", color: "#A8A8A8" }} />
                    )}
                  </span>
                </div>
              )}
            </li>
            
            ))}
          </ul>
        )}
      </div>
  
      {/* Collaboration Group */}
      <div style={{ marginBottom: "10px" }}> {/* Add margin-bottom here */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setShowCollabGroup(!showCollabGroup)}
        >
          <p style={{ margin: 0, fontSize: "18px", fontWeight: "300"}}>
            Collaboration Group
          </p>
          {showCollabGroup ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </div>
  
        {showCollabGroup && (
          <ul style={{ listStyle: "none", margin: "0", padding: "0", maxHeight: "90px", overflowY: "auto" }}>
            {collabGroups.map((group, index) => (
              <li
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "3px", // Ensure consistent padding
                height: "25px", // Fixed height to prevent movement
                lineHeight: "25px", // Consistent line spacing
                cursor: "pointer",
                borderRadius: "4px",
                backgroundColor:
                  hoveredCollabGroup === group ? "#EEEDEB" : "transparent",
                transition: "background-color 0.2s ease", // Smooth hover effect
              }}
              onMouseEnter={() => setHoveredCollabGroup(group)}
              onMouseLeave={() => setHoveredCollabGroup(null)}
            >
              <span style={{ fontSize: "15px", fontWeight: "200" }}>{group}</span>
              {hoveredCollabGroup === group && (
                <div style={{ display: "flex", gap: "5px" }}>
                  <span
                    onClick={() => toggleGroupVisibility(group)}
                    style={{ cursor: "pointer" }}
                  >
                    {groupVisibility[group] ? (
                      <VisibilityIcon style={{ fontSize: "18px", color: "#A8A8A8" }} />
                    ) : (
                      <VisibilityOffIcon style={{ fontSize: "18px", color: "#A8A8A8" }} />
                    )}
                  </span>
                </div>
              )}
            </li>
            
            ))}
          </ul>
        )}
      </div>
  
      {/* Subject Group */}
      <div style={{ marginBottom: "20px" }}> {/* Add margin-bottom here */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setShowSubjectGroup(!showSubjectGroup)}
        >
          <p style={{ margin: 0,  fontSize: "18px", fontWeight: "300" }}>
            Subject Group
          </p>
          {showSubjectGroup ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </div>
  
        {showSubjectGroup && (
          <ul style={{ listStyle: "none", margin: "0", padding: "0", maxHeight: "100px", overflowY: "auto" }}>
            {subjects.map((subject) => (
              <li
              key={subject.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "3px",
                height: "25px", // Fixed height for consistency
                lineHeight: "25px", // Ensures vertical alignment
                cursor: "pointer",
                fontWeight: "200",
                borderRadius: "4px",
                backgroundColor:
                  hoveredGroup === subject.id ? "#EEEDEB" : "transparent",
                transition: "background-color 0.2s ease", // Smooth hover effect
              }}
              onMouseEnter={() => setHoveredGroup(subject.id)}
              onMouseLeave={() => setHoveredGroup(null)}
            >
              <span style={{ fontSize: "15px" }}>
                {subject.id} - {subject.name}
              </span>
              {hoveredGroup === subject.id && (
                <div style={{ marginLeft: "auto", display: "flex", gap: "5px" }}>
                  <span
                    onClick={() => toggleGroupVisibility(subject.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {groupVisibility[subject.id] ? (
                      <VisibilityIcon style={{ fontSize: "18px", color: "#A8A8A8" }} />
                    ) : (
                      <VisibilityOffIcon style={{ fontSize: "18px", color: "#A8A8A8" }} />
                    )}
                  </span>
                </div>
              )}
            </li>
            
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  
  const renderSchedule = () => (
    
    <div>
      <div style={{ textAlign: "center",marginTop: "-5px" , marginBottom: "-5px" }}>
      <h1
        style={{
          fontSize: "20px",
          fontWeight: "500",
          color: "#8A5CF6", // Adjusted to match the purple color
          margin: 0,
        }}
      >
        Schedule
      </h1>
       <Divider sx={{ borderColor: "#A294F9", mb: 2 }} />
    </div>
      <MiniCalendar
        onDateSelect={(date) => console.log("Selected date:", date)}
        events={events}
        groupColors={groupColors}
      />
    </div>
  );

  const renderCollaboration = () => (
    <div>
      <div style={{ textAlign: "center", marginTop: "-5px" , marginBottom: "-5px" }}>
      <h1
        style={{
          fontSize: "20px",
          fontWeight: "500",
          color: "#8A5CF6", // Adjusted to match the purple color
          margin: 0,
        }}
      >
        Collaboration
      </h1>
       <Divider sx={{ borderColor: "#A294F9", mb: 2 }} />
    </div>
     {/* Collaboration Card */}
     <div
      style={{
        border: "1px dashed #000",
        borderRadius: "10px",
        padding: "15px",
        backgroundColor: "#F6F1FF",
        marginTop: "2px",
      }}
    >
      <p style={{ margin: 0, fontSize: "16px", fontWeight: "400"  ,  marginTop: "-10px",}}>
        Peanuts better
      </p>
      <div style={{ position: "relative", marginTop: "3px" ,marginBottom: "10px"  }}>
        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={(5 / 10) * 100} // Adjust dynamically
          sx={{
            height: 8,
            borderRadius: "5px",
            backgroundColor: "#EDE7FF",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#8A5CF6",
            },
          }}
        />
        {/* Text below the progress bar */}
        <span
          style={{
            position: "absolute",
            bottom: "-20px",
            right: "0",
            fontSize: "14px",
            color: "#000",
          }}
        >
          5/10 Meetings
        </span>
      </div>
    </div>
  </div>
  );

  const renderSetting = () => (
    <div>
      <div style={{ textAlign: "center" , marginTop: "-5px" , marginBottom: "-5px" }}>
      <h1
        style={{
          fontSize: "20px",
          fontWeight: "500",
          color: "#8A5CF6", // Adjusted to match the purple color
          margin: 0,
        }}
      >
        Setting
      </h1>
       <Divider sx={{ borderColor: "#A294F9", mb: 2 }} />
    </div>
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "Planner":
        return renderPlanner();
      case "Schedule":
        return renderSchedule();
      case "Collaboration":
        return renderCollaboration();
      case "Setting":
        return renderSetting();
      default:
        return null;
    }
  };

  return (
    <div
    style={{
      display: "flex",
      flexDirection: "column",
      width: "250px",
      backgroundColor: "#F9F9FB",
      height: "100vh",
      padding: "10px",
    }}
  >
    {/* Logo */}
    <div style={{ marginBottom: "20px", fontWeight: "bold", fontSize: "20px" }}>
      Logo
    </div>

    {/* Menu Items */}
    <div>
  {menuItems.map((menu) => (
    <div
      key={menu.label}
      onClick={() => setActiveMenu(menu.label)}
      onMouseEnter={() => setHoveredMenu(menu.label)}
      onMouseLeave={() => setHoveredMenu(null)}
      style={{
        display: "flex",
        alignItems: "center", // Ensures vertical alignment
        padding: "4px 8px", // Increases vertical padding for proper spacing
        cursor: "pointer",
        backgroundColor:
          activeMenu === menu.label ? "#EDEDFC" : "transparent",
        fontWeight: activeMenu === menu.label ? "300" : "200",
        borderRadius: "4px",
        gap: "8px",
      }}
    >
      {/* Icon */}
      <span style={{ color: "#A8A8A8", display: "flex", alignItems: "center" }}>
        {menu.icon}
      </span>
      {/* Label */}
      <span style={{ color: "#000", fontSize: "16px" }}>{menu.label}</span>
    </div>
  ))}
</div>


    {/* Remaining Content */}
    <div style={{ flex: 1, marginTop: "10px" }}>{renderContent()}</div>
      {/* User Profile */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    padding: "5px",
    borderRadius: "10px",
    background: "linear-gradient(to right, #e0c3fc, #8ec5fc)",
  }}
>
  <div
    style={{
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      fontWeight: "400",
      color: "#000",
      marginRight: "10px",
    }}
  >
    N
  </div>
  <span style={{ fontSize: "16px", fontWeight: "300" }}>
    Napatsiri p.
  </span>
</div>
    </div>

    
  );
};

export default LeftSide;
