import { useState, useEffect, useMemo } from "react";
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
import { useSMCalendar } from "smart-calendar-lib";
import logo from "../pages/asset/LogoIcon.svg";
import Swal from "sweetalert2";
import SyncIcon from "@mui/icons-material/Sync";
import LogoutIcon from "@mui/icons-material/Logout";
import { useGroupVisibility } from "./GroupVisibilityContext";

const LeftSide = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Planner");
  const {
    groupVisibility,
    subjectVisibility,
    collabVisibility,
    toggleGroupVisibility,
    toggleSubjectVisibility,
    toggleCollabVisibility,
  } = useGroupVisibility();
  const [showGroupCalendar, setShowGroupCalendar] = useState(true);
  const [showCollabGroup, setShowCollabGroup] = useState(true);
  const [showSubjectGroup, setShowSubjectGroup] = useState(true);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);
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
  const [fetchedGroups, setFetchedGroups] = useState<any[]>([]);
  const [sharedEventsData, setSharedEventsData] = useState<any>(null);
 
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await smCalendar.getUser();
        const fetchedGroups = await smCalendar.getGroups();
        const fetchedCollab = await smCalendar.getSharedEvents();
  
        console.log(fetchedCollab); // Log shared events
  
        setFetchedGroups(fetchedGroups);
        setUser(fetchedUser);
        setSharedEventsData(fetchedCollab); // เก็บ shared events ไว้ใน state
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);
  
  

  const groupCalendars = useMemo(() => {
    return fetchedGroups.filter((group) => group.type === "system");
  }, [fetchedGroups]);

  const subjects = useMemo(() => {
    return fetchedGroups.filter((group) => group.type === "course");
  }, [fetchedGroups]);

    // เพิ่ม useEffect เพื่อติดตามการเปลี่ยนแปลงของ groupVisibility
  useEffect(() => {
    console.log("Updated groupVisibility:", groupVisibility);
    console.log("Updated subVisibility:", subjectVisibility);
    console.log("Updated collabVisibility:", collabVisibility);
  }, [groupVisibility , subjectVisibility , collabVisibility]);

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
                const groupKey = String(group.id);

                return (
                  <li
                    key={groupKey}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
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
                        background: isExam ? "#FF0000" : group.color,
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
                          {groupVisibility[groupKey] === false ? (
                            <VisibilityOffIcon
                              style={{ fontSize: "18px", color: "#A8A8A8" }}
                            />
                          ) : (
                            <VisibilityIcon
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
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {subjects.map((subject) => (
              <li
  key={String(subject.id)}
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
      hoveredSubject === subject.id ? "#EEEDEB" : "transparent",
    transition: "background-color 0.2s ease",
  }}
  onMouseEnter={() => setHoveredSubject(subject.id)}
  onMouseLeave={() => setHoveredSubject(null)}
>
<span
      style={{
        display: "inline-block",
        width: "10px",          // ปรับขนาดตามต้องการ
        height: "5px",         // ปรับขนาดตามต้องการ
        backgroundColor: "#8576FF", // ใช้สีจาก subject หรือ fallback
        borderRadius: "2px",   // ทำให้เป็นแคปซูลโค้ง
        marginRight: "2px",
      }}
    />

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
  {hoveredSubject === subject.id && (
    <div style={{ marginLeft: "auto", display: "flex", gap: "5px" }}>
      <span
        onClick={() => {
          toggleSubjectVisibility(String(subject.id));
        }}
        style={{ cursor: "pointer", marginTop: "7px" }}
      >
        {subjectVisibility[String(subject.id)] === false ? (
          <VisibilityOffIcon style={{ fontSize: "18px", color: "#A8A8A8" }} />
        ) : (
          <VisibilityIcon style={{ fontSize: "18px", color: "#A8A8A8" }} />
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
        maxHeight: "150px",
        overflowY: "auto",
      }}
    >
      {sharedEventsData &&
        sharedEventsData.sharedEvents
          .filter((event: any) => event.status === "saved")
          .map((event: any, index: number) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "3px",
                height: "25px",
                lineHeight: "25px",
                cursor: "pointer",
                borderRadius: "4px",
                backgroundColor:
                  hoveredCollabGroup === event.id ? "#EEEDEB" : "transparent",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={() => setHoveredCollabGroup(event.id)}
              onMouseLeave={() => setHoveredCollabGroup(null)}
            >
              {/* Container สำหรับ dot กับชื่อ group */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "5px",
                    backgroundColor: "#8576FF",
                    borderRadius: "2px",
                    marginRight: "10px",
                  }}
                />
                <span style={{ fontSize: "15px", fontWeight: "200" }}>
                  {event.title}
                </span>
              </div>

              {hoveredCollabGroup === event.id && (
                <div style={{ marginLeft: "auto", display: "flex", gap: "5px" }}>
                  <span
                    onClick={() => toggleCollabVisibility(String(event.id))}
                    style={{ cursor: "pointer", marginTop: "7px" }}
                  >
                    {collabVisibility[String(event.id)] === false ? (
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
      />
    </div>
  );

  const renderCollaboration = () => {
    // กำหนด mapping สำหรับสีของแต่ละสถานะ
    const statusColors: { [key: string]: string } = {
      pending: "#FF9D23",  // สีส้ม
      arranged: "#006BFF", // สีฟ้า
      saved: "#16C47F",    // สีเขียว
      deleted: "#FF0000",  // สีแดง
    };
  
    // filter event ที่มี member ตรงกับเงื่อนไข
    const filteredEvents =
      sharedEventsData &&
      sharedEventsData.sharedEvents.filter((event: any) => {
        // เงื่อนไข: ตรวจสอบว่ามี member ที่ตรงกับ user และมี sharedEventOwner เป็น true
        if (!user || !event.members) return false;
        return event.members.some((member: any) => {
          return (
            member.sharedEventOwner === true &&
            member.givenName === user.firstName &&
            member.familyName === user.lastName
          );
        });
      });
  
    return (
      <div>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginTop: "-5px",
            marginBottom: "-5px",
          }}
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
  
        {/* หากไม่มี event ให้แสดงข้อความ */}
        {(!filteredEvents || filteredEvents.length === 0) ? (
          <p style={{ textAlign: "center", fontSize: "16px", color: "#555" }}>
            Let's start creating a group!
          </p>
        ) : (
          // Render Each Collaboration Card
          filteredEvents.map((event: any, index: number) => (
            <div
              key={index}
              style={{
                borderRadius: "10px",
                padding: "7px",
                backgroundColor: "#fff",
                marginTop: "8px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "400",
                  marginTop: "0px",
                }}
              >
                Group : {event.title}
              </p>
              {/* แสดง Status ด้านล่าง Title */}
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "300",
                  color: statusColors[event.status] || "#000",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: statusColors[event.status] || "#000",
                    marginRight: "5px",
                  }}
                />
                Status : {event.status}
              </p>
            </div>
          ))
        )}
      </div>
    );
  };
  
  
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

  const handleSync = async () => {
    try {
      await smCalendar.postUserSync();
      Swal.fire({
        title: "Sync successful",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Sync failed:", error);
      Swal.fire({
        title: "Sync failed",
        text: "Please try again.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

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
        backgroundColor: "#f9f9fb",
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
          style={{ maxWidth: "100px", height: "auto" }}
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
           onClick={handleSync}
  variant="contained"
  startIcon={<SyncIcon sx={{ fontSize: "15px" }} />}
  sx={{
    fontSize: "13px",
    fontWeight: "500",
    border: "none",
    marginBottom: "3px",
    padding: "6px 20px",
    cursor: "pointer",
    borderRadius: "20px",
    transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
    backgroundColor: "#fff",
    color: "#8576FF",
    boxShadow: "none", // เริ่มต้นแบบเรียบๆ
    display: "flex", // กำหนด layout เป็น flex
    justifyContent: "flex-start", // จัด content ให้ชิดซ้าย
    "&:active": {
      boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.2)", // เมื่อกดจะมีเอฟเฟคนูน
    },
  }}
>
  Sync
</Button>
<Button
  onClick={handleLogout}
  variant="contained"
  startIcon={<LogoutIcon sx={{ fontSize: "15px" }} />}
  sx={{
    fontSize: "13px",
    fontWeight: "500",
    border: "none",
    padding: "6px 20px",
    cursor: "pointer",
    borderRadius: "20px",
    transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
    backgroundColor: "#fff",
    color: "#8576FF",
    boxShadow: "none", // เริ่มต้นแบบเรียบๆ
    display: "flex",
    justifyContent: "flex-start",
    "&:active": {
      boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.2)",
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
              {user ? `${user.firstName.charAt(0)}` : "?"}
            </div>
            <span style={{ fontSize: "16px", fontWeight: "300" }}>
              {user ? `${user.firstName} ${user.lastName.charAt(0)}.` : "User"}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default LeftSide;
