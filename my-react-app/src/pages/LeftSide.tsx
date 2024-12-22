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

const LeftSide = () => {
  const [activeMenu, setActiveMenu] = useState("Planner"); // Default is Planner
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [showGroupCalendar, setShowGroupCalendar] = useState(true);
  const [showCollabGroup, setShowCollabGroup] = useState(true);
  const [showSubjectGroup, setShowSubjectGroup] = useState(true);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [groupVisibility, setGroupVisibility] = useState<{
    [key: string]: boolean;
  }>({
    CMU: true,
    Classroom: true,
    "Quiz & Assignment": true,
    "Final & Midterm": true,
    Holiday: true,
    Owner: true,
  });
  const [hoveredCollabGroup, setHoveredCollabGroup] = useState<string | null>(
    null
  );
  const menuItems = [
    {
      label: "Planner",
      icon: (
        <CalendarTodayIcon style={{ color: "#A8A8A8", fontSize: "20px" }} />
      ),
    },
    {
      label: "Schedule",
      icon: <ScheduleIcon style={{ color: "#A8A8A8", fontSize: "20px" }} />,
    },
    {
      label: "Collaboration",
      icon: <GroupIcon style={{ color: "#A8A8A8", fontSize: "20px" }} />,
    },
    {
      label: "Setting",
      icon: <SettingsIcon style={{ color: "#A8A8A8", fontSize: "20px" }} />,
    },
  ];

  const groupColors = [
    { idGroup: 1, key: "CMU", name: "CMU", color: "#615EFC" },
    { idGroup: 2, key: "Classroom", name: "Class", color: "#41B3A2" },
    {
      idGroup: [3, 4],
      key: "Quiz",
      name: "Quiz & Assignment",
      color: "linear-gradient(to right, #FF6F61 50%, #FCC26D 50%)",
    },
    {
      idGroup: 5,
      key: "FinalMidterm",
      name: "Final & Midterm",
      color: "#FF0000",
    },
    { idGroup: 6, key: "Holiday", name: "Holiday", color: "#9DBDFF" },
    { idGroup: 7, key: "Owner", name: "Owner", color: "#D6C0B3" },
  ];

  // Mock data
  const [events, setEvents] = useState([
    {
      title: "Quiz Network",
      start: new Date(2024, 10, 27, 11, 0),
      end: new Date(2024, 10, 27, 12, 0),
      idGroup: 3,
    },
    {
      title: "Assignment Prop & Stat",
      start: new Date(2024, 10, 27, 11, 0),
      end: new Date(2024, 10, 27, 12, 0),
      idGroup: 2,
    },
    {
      title: "Assignment Prop & Stat",
      start: new Date(2024, 10, 27, 11, 0),
      end: new Date(2024, 10, 27, 12, 0),
      idGroup: 4,
    },
    {
      title: "Assignment Prop & Stat",
      start: new Date(2024, 10, 27, 11, 0),
      end: new Date(2024, 10, 27, 12, 0),
      idGroup: 5,
    },
    {
      title: "Python For Everyone",
      start: new Date(2024, 10, 28),
      end: new Date(2024, 10, 29),
      idGroup: 2,
    },
    {
      title: "Database",
      start: new Date(2024, 10, 28),
      end: new Date(2024, 10, 28),
      idGroup: 2,
    },
    {
      title: "จ่ายค่าเทอม 2/67",
      start: new Date(2024, 10, 26, 11, 0),
      end: new Date(2024, 10, 26, 12, 0),
      idGroup: 1,
    },
    {
      title: "วันสุดท้ายของการ Add",
      start: new Date(2025, 2, 18, 0, 0),
      end: new Date(2025, 2, 18, 7, 0),
      idGroup: 1,
    },
    {
      title: "Database",
      start: new Date(2025, 1, 12, 0, 0),
      end: new Date(2025, 1, 12, 7, 0),
      idGroup: 5,
    },
    {
      title: "Pilates Day",
      start: new Date(2025, 1, 15, 9, 30),
      end: new Date(2025, 1, 15, 10, 30),
      idGroup: 7,
    },
    {
      title: "วันพีแห่งชาติ",
      start: new Date(2024, 12, 15),
      end: new Date(2024, 12, 15),
      idGroup: 6,
    },
  ]);

  const collabGroups = ["Project Boo", "Project Adv Copm"];
  const subjects = [
    { id: "261448", name: "Data Mining" },
    { id: "261305", name: "Operating System" },
  ];

  const toggleGroupVisibility = (group: keyof typeof groupVisibility) => {
    setGroupVisibility((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const renderPlanner = () => (
    <div>
      <div
        style={{ textAlign: "center", marginTop: "-5px", marginBottom: "-5px" }}
      >
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "500",
            color: "#8A5CF6",
            margin: 0,
          }}
        >
          Planner
        </h1>
        <Divider sx={{ borderColor: "#A294F9", mb: 2 }} />
      </div>
      <div style={{ marginBottom: "10px" }}>
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
          {showGroupCalendar ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </div>

        {showGroupCalendar && (
          <ul style={{ listStyle: "none", padding: "5px 0 0", margin: 0 }}>
            {groupColors.map((group) => (
              <li
                key={group.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "15px",
                  fontWeight: "200",
                  padding: "3px",
                  gap: "10px",
                  height: "25px",
                  lineHeight: "25px",
                  borderRadius: "4px",
                  backgroundColor:
                    hoveredGroup === group.key ? "#EEEDEB" : "transparent",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={() => setHoveredGroup(group.key)}
                onMouseLeave={() => setHoveredGroup(null)}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "15px",
                    height: "15px",
                    background: group.color,
                    borderRadius: "2px",
                  }}
                />
                {group.name}
                {hoveredGroup === group.key && (
                  <div
                    style={{ marginLeft: "auto", display: "flex", gap: "5px" }}
                  >
                    <span
                      onClick={() => toggleGroupVisibility(group.key)}
                      style={{ cursor: "pointer" }}
                    >
                      {groupVisibility[group.key] ? (
                        <VisibilityIcon
                          style={{ fontSize: "18px", color: "#A8A8A8" }}
                        />
                      ) : (
                        <VisibilityOffIcon
                          style={{ fontSize: "18px", color: "#A8A8A8" }}
                        />
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
      <div style={{ marginBottom: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setShowCollabGroup(!showCollabGroup)}
        >
          <p style={{ margin: 0, fontSize: "18px", fontWeight: "300" }}>
            Collaboration Group
          </p>
          {showCollabGroup ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </div>

        {showCollabGroup && (
          <ul
            style={{
              listStyle: "none",
              margin: "0",
              padding: "0",
              maxHeight: "90px",
              overflowY: "auto",
            }}
          >
            {collabGroups.map((group, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "3px",
                  height: "25px",
                  lineHeight: "25px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  backgroundColor:
                    hoveredCollabGroup === group ? "#EEEDEB" : "transparent",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={() => setHoveredCollabGroup(group)}
                onMouseLeave={() => setHoveredCollabGroup(null)}
              >
                <span style={{ fontSize: "15px", fontWeight: "200" }}>
                  {group}
                </span>
                {hoveredCollabGroup === group && (
                  <div style={{ display: "flex", gap: "5px" }}>
                    <span
                      onClick={() => toggleGroupVisibility(group)}
                      style={{ cursor: "pointer" }}
                    >
                      {groupVisibility[group] ? (
                        <VisibilityIcon
                          style={{ fontSize: "18px", color: "#A8A8A8" }}
                        />
                      ) : (
                        <VisibilityOffIcon
                          style={{ fontSize: "18px", color: "#A8A8A8" }}
                        />
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
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setShowSubjectGroup(!showSubjectGroup)}
        >
          <p style={{ margin: 0, fontSize: "18px", fontWeight: "300" }}>
            Subject Group
          </p>
          {showSubjectGroup ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </div>

        {showSubjectGroup && (
          <ul
            style={{
              listStyle: "none",
              margin: "0",
              padding: "0",
              maxHeight: "100px",
              overflowY: "auto",
            }}
          >
            {subjects.map((subject) => (
              <li
                key={subject.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "3px",
                  height: "25px",
                  lineHeight: "25px",
                  cursor: "pointer",
                  fontWeight: "200",
                  borderRadius: "4px",
                  backgroundColor:
                    hoveredGroup === subject.id ? "#EEEDEB" : "transparent",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={() => setHoveredGroup(subject.id)}
                onMouseLeave={() => setHoveredGroup(null)}
              >
                <span style={{ fontSize: "15px" }}>
                  {subject.id} - {subject.name}
                </span>
                {hoveredGroup === subject.id && (
                  <div
                    style={{ marginLeft: "auto", display: "flex", gap: "5px" }}
                  >
                    <span
                      onClick={() => toggleGroupVisibility(subject.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {groupVisibility[subject.id] ? (
                        <VisibilityIcon
                          style={{ fontSize: "18px", color: "#A8A8A8" }}
                        />
                      ) : (
                        <VisibilityOffIcon
                          style={{ fontSize: "18px", color: "#A8A8A8" }}
                        />
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
      <div
        style={{ textAlign: "center", marginTop: "-5px", marginBottom: "-5px" }}
      >
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "500",
            color: "#8A5CF6",
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
      <div
        style={{ textAlign: "center", marginTop: "-5px", marginBottom: "-5px" }}
      >
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "500",
            color: "#8A5CF6",
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
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "400",
            marginTop: "-10px",
          }}
        >
          Peanuts better
        </p>
        <div
          style={{
            position: "relative",
            marginTop: "3px",
            marginBottom: "10px",
          }}
        >
          {/* Progress bar */}
          <LinearProgress
            variant="determinate"
            value={(5 / 10) * 100}
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
      <div
        style={{ textAlign: "center", marginTop: "-5px", marginBottom: "-5px" }}
      >
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "500",
            color: "#8A5CF6",
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
      <div
        style={{ marginBottom: "20px", fontWeight: "bold", fontSize: "20px" }}
      >
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
              alignItems: "center",
              padding: "4px 8px",
              cursor: "pointer",
              backgroundColor:
                activeMenu === menu.label ? "#EDEDFC" : "transparent",
              fontWeight: activeMenu === menu.label ? "300" : "200",
              borderRadius: "4px",
              gap: "8px",
            }}
          >
            {/* Icon */}
            <span
              style={{
                color: "#A8A8A8",
                display: "flex",
                alignItems: "center",
              }}
            >
              {menu.icon}
            </span>
            {/* Label */}
            <span style={{ color: "#000", fontSize: "16px" }}>
              {menu.label}
            </span>
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
