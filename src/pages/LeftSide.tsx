import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
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
import { useSMCalendar } from "smart-calendar-lib";
import logo from "../pages/asset/Logo1.svg";
import Swal from "sweetalert2";
import { useGroupVisibility } from "./GroupVisibilityContext";

const LeftSide = ({
  isCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Planner");

  // const groupColors = [
  //   {
  //     groups: "8a9e8a40-9e8e-4464-8495-694b0012af80",
  //     key: "CMU",
  //     name: "CMU",
  //     color: "#615EFC",
  //   },
  //   {
  //     groups: "53adc81a-1089-4e84-a1c4-a77d1e1434c3",
  //     key: "Classroom",
  //     name: "Class",
  //     color: "#41B3A2",
  //   },
  //   {
  //     groups: ["427b92fc-d055-4109-b164-ca9313c2ee95"],
  //     key: "Quiz",
  //     name: "Quiz",
  //     color: "#FF9100",
  //   },
  //   {
  //     groups: ["6121a9c8-ec3f-47aa-ba8b-fbd28ccf27c8"],
  //     key: "Assignment",
  //     name: "Assignment",
  //     color: "#FCC26D",
  //   },
  //   {
  //     groups: "9314e483-dc11-438f-8855-046755ac0b64",
  //     key: "Final",
  //     name: "Final",
  //     color: "#FF0000",
  //   },
  //   {
  //     groups: "a9c0c854-f59f-47c7-b75d-c35c568856cd",
  //     key: "Midterm",
  //     name: "Midterm",
  //     color: "#FF0000",
  //   },
  //   {
  //     groups: "0bee62f7-4f9f-4735-92ac-2041446aac91",
  //     key: "Holiday",
  //     name: "Holiday",
  //     color: "#9DBDFF",
  //   },
  //   {
  //     groups: "156847db-1b7e-46a3-bc4f-15c19ef0ce1b",
  //     key: "Owner",
  //     name: "Owner",
  //     color: "#D6C0B3",
  //   },
  // ];

  // ใช้งาน Context ที่ให้ groupVisibility และ toggleGroupVisibility
  const { groupVisibility, toggleGroupVisibility } = useGroupVisibility();
  const [showGroupCalendar, setShowGroupCalendar] = useState(true);
  const [showCollabGroup, setShowCollabGroup] = useState(true);
  const [showSubjectGroup, setShowSubjectGroup] = useState(true);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [hoveredCollabGroup, setHoveredCollabGroup] = useState<string | null>(
    null
  );

  const menuItems = [
    {
      label: "Planner",
      icon: (
        <CalendarTodayIcon style={{ color: "#A8A8A8", fontSize: "20px" }} />
      ),
      path: "/Planner",
    },
    {
      label: "Schedule",
      icon: <ScheduleIcon style={{ color: "#A8A8A8", fontSize: "20px" }} />,
      path: "/Schedule",
    },
    {
      label: "Collaboration",
      icon: <GroupIcon style={{ color: "#A8A8A8", fontSize: "20px" }} />,
      path: "/Collaboration",
    },
    {
      label: "Setting",
      icon: <SettingsIcon style={{ color: "#A8A8A8", fontSize: "20px" }} />,
      path: "/Setting",
    },
  ];

  const smCalendar = useSMCalendar();
  const eventsRef = useRef<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fetchedGroups, setFetchedGroups] = useState<any[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await smCalendar.syncEvents();
        const fetchedEvents = await smCalendar.getEvents();
        const fetchedGroup = await smCalendar.getGroups();
  
        console.log("Sync Result:", fetchedEvents);
        console.log("Fetched Groups:", fetchedGroup);
  
        // แปลงข้อมูล events ให้เป็นรูปแบบที่ต้องการ
        const formattedEvents = fetchedEvents.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: event.start || event.date,
          end: event.end || event.date,
          groups: Array.isArray(event.groups) ? event.groups : [event.groups],
        }));
  
        eventsRef.current = formattedEvents;
        setEvents(formattedEvents);
        setIsLoaded(true);
  
        // เก็บข้อมูล groups ลง state
        setFetchedGroups(fetchedGroup);
  
        // ตั้งค่าสถานะว่าได้ fetch ข้อมูลแล้ว
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsLoaded(true);
        setHasFetched(true);
      }
    };
  
    // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วและยังไม่ได้ fetch ข้อมูล
    if (!hasFetched && smCalendar.getAuth()) {
      fetchEvents();
    }
  }, [hasFetched, smCalendar]);
  

  const groupCalendarIds = [
    "8a9e8a40-9e8e-4464-8495-694b0012af80", // CMU
    "53adc81a-1089-4e84-a1c4-a77d1e1434c3", // Class
    "427b92fc-d055-4109-b164-ca9313c2ee95", // Quiz
    "6121a9c8-ec3f-47aa-ba8b-fbd28ccf27c8", // Assignment
    "9314e483-dc11-438f-8855-046755ac0b64", // Final
    "a9c0c854-f59f-47c7-b75d-c35c568856cd", // Midterm
    "0bee62f7-4f9f-4735-92ac-2041446aac91", // Holiday
    "156847db-1b7e-46a3-bc4f-15c19ef0ce1b", // Owner
  ];

  // ใช้ useMemo เพื่อแยกข้อมูล เมื่อ fetchedGroups มีการเปลี่ยนแปลง
  const groupCalendars = useMemo(() => {
    return fetchedGroups.filter((group) => groupCalendarIds.includes(group.id));
  }, [fetchedGroups]);

  const subjects = useMemo(() => {
    return fetchedGroups.filter(
      (group) => !groupCalendarIds.includes(group.id)
    );
  }, [fetchedGroups]);

  const collabGroups = ["Project Boo", "Project Adv Copm"];
  // const subjects = [
  //   { id: "261448", name: "Data Mining" },
  //   { id: "261305", name: "Operating System" },
  // ];

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
            {groupCalendars
              .filter((group) => group.title !== "Midterm")
              .map((group) => {
                const isExam = group.title === "Final";
                const groupKey = isExam ? "Exam" : group.title;

                return (
                  <li
                    key={groupKey}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "15px",
                      fontWeight: "200",
                      padding: "2px",
                      gap: "10px",
                      height: "25px",
                      lineHeight: "25px",
                      borderRadius: "4px",
                      backgroundColor:
                        hoveredGroup === groupKey ? "#EEEDEB" : "transparent",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={() => setHoveredGroup(groupKey)}
                    onMouseLeave={() => setHoveredGroup(null)}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "15px",
                        height: "15px",
                        background: isExam ? "#FF0000" : group.default_color,
                        borderRadius: "2px",
                      }}
                    />
                    {isExam ? "Exam" : group.title}
                    {hoveredGroup === groupKey && (
                      <div
                        style={{
                          marginLeft: "auto",
                          display: "flex",
                          gap: "5px",
                        }}
                      >
                        <span
                          onClick={() => toggleGroupVisibility(groupKey)}
                          style={{ cursor: "pointer", marginTop: "7px" }}
                        >
                          {groupVisibility[groupKey] ? (
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
                );
              })}
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
                      style={{ cursor: "pointer", marginTop: "7px" }}
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
              maxHeight: "255px",
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
                <span
                  style={{
                    fontSize: "14px",
                    maxWidth: "200px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    display: "inline-block",
                  }}
                >
                  {subject.title}
                </span>
                {hoveredGroup === subject.id && (
                  <div
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      gap: "5px",
                    }}
                  >
                    <span
                      onClick={() => toggleGroupVisibility(subject.id)}
                      style={{ cursor: "pointer", marginTop: "7px" }}
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

  // const handleMouseEnter = () => {
  //   setIsCollapsed(false);
  // };

  // const handleMouseLeave = () => {
  //   setIsCollapsed(true);
  // };
  const auth = smCalendar.getAuth();
  const handleLogout = async () => {
    try {
      await auth.logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred during logout. Please try again.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: isCollapsed ? "60px" : "250px",
        backgroundColor: "#fff",
        height: "100vh",
        padding: isCollapsed ? "5px" : "10px",
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
      // onMouseEnter={() => setIsCollapsed(false)}
      // onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Logo */}
      <div
        style={{
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ maxWidth: "60px", height: "auto" }}
        />
      </div>
      {/* Only render content if not collapsed */}
      {!isCollapsed && (
        <>
          {/* Menu Items */}
          <div>
            {menuItems.map((menu) => (
              <div
                key={menu.label}
                onClick={() => {
                  setActiveMenu(menu.label);
                  navigate(menu.path);
                }}
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
                <span
                  style={{
                    color: "#A8A8A8",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {menu.icon}
                </span>
                <span style={{ color: "#000", fontSize: "16px" }}>
                  {menu.label}
                </span>
              </div>
            ))}
          </div>

          {/* Remaining Content */}
          <div style={{ flex: 1, marginTop: "10px" }}>{renderContent()}</div>

          <Button
            onClick={handleLogout}
            variant="outlined"
            sx={{
              color: "#8576FF",
              borderColor: "#8576FF",
              fontSize: "13px",
              "&:hover": {
                backgroundColor: "#8576FF",
                color: "#ffffff",
              },
            }}
          >
            Logout
          </Button>
          {/* User Profile */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "5px",
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
        </>
      )}
    </div>
  );
};

export default LeftSide;
