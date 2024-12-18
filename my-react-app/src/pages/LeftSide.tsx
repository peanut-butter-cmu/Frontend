import React, { useState } from "react";
import MiniCalendar from "./components/MiniCalendar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Home from "@mui/icons-material/Home";
import Settings from "@mui/icons-material/Settings";
import CollabAddGroup from "./components/CollabAddGroup";
import CollaborationPopup from "./components/CollaborationPopup";

// SectionHeader Componentinterface Event {
// Rename Event to CalendarEvent
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  color: string;
  group: string;
}

  interface LeftSideProps {
    style?: React.CSSProperties; 
    events: CalendarEvent[]; // ใช้ชื่อใหม่แทน
  }
  

const SectionHeader = ({
    title,
    isOpen,
    toggle,
  }: {
    title: string;
    isOpen: boolean;
    toggle: () => void;
  }) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={toggle}
      >
        <p
          style={{
            margin: "0 0 5px 0",
            fontSize: "17px",
            fontWeight: "500",
          }}
        >
          {title}
        </p>
        {isOpen ? (
          <KeyboardArrowUpIcon />
        ) : (
          <KeyboardArrowDownIcon />
        )}
      </div>
    );
  };
  

  const LeftSide: React.FC<LeftSideProps> = ({ style, events }) => {
    console.log(events);
    
    const [showGroupCalendar, setShowGroupCalendar] = useState(true);
    const [showCollabGroup, setShowCollabGroup] = useState(true);
    const [showSubjectGroup, setShowSubjectGroup] = useState(true);
    const [hoveredCollabGroup, setHoveredCollabGroup] = useState<string | null>(null);
    const [openPopupAdd, setOpenPopupAdd] = useState(false);
    const [openPopupCollab, setOpenPopupCollab] = useState(false);
  
    const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
    const [groupVisibility, setGroupVisibility] = useState<{ [key: string]: boolean }>({
    CMU: true,
    Classroom: true,
    "Quiz & Assignment": true,
    "Final & Midterm": true,
    Holiday: true,
    Owner: true,
  });

  const collabGroups = ["Project Boo", "Project Adv Copm"];
  const subjects = [
    { id: "261448", name: "Data Mining" },
    { id: "261305", name: "Operating System" },
  ];

  

  const groupColors = {
    CMU: "#615EFC",
    Classroom: "#41B3A2",
    "Quiz & Assignment": "linear-gradient(to right, #FF6F61 50%, #FCC26D 50%)",
    "Final & Midterm": "#FF0000",
    Holiday: "#9DBDFF",
    Owner: "#D6C0B3",
  };
  const handleAddGroup = (data: { groupName: string; participants: string[] }) => {
    console.log("New Group Added:", data);
  };

  const toggleGroupVisibility = (group: string) => {
    setGroupVisibility((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleMouseEnter = (group: string) => setHoveredGroup(group);
  const handleMouseLeave = () => setHoveredGroup(null);

  const handleDeleteGroup = (group: string) => {
    console.log(`Delete group: ${group}`);
  };

  return (
    <div
      style={{
        ...style,
        backgroundColor: "#F9F9FB",
        padding: "15px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        gap: "15px",
      }}
    >
      {/* Mini Calendar */}
      <MiniCalendar
  onDateSelect={(date) => console.log("Selected date:", date)}
  events={events} // ส่งข้อมูล Events
  groupColors={{
    CMU: "#615EFC",
    Classroom: "#41B3A2",
    "Quiz & Assignment": "linear-gradient(to right, #FF6F61 50%, #FCC26D 50%)",
    "Final & Midterm": "#FF0000",
    Holiday: "#9DBDFF",
    Owner: "#D6C0B3",
  }}
/>



      {/* Group Calendar */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setShowGroupCalendar(!showGroupCalendar)}
        >
          <p style={{ margin: 0, fontSize: "17px", fontWeight: "500" }}>
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
                  fontSize: "16px",
                  padding: "4px 0",
                  gap: "10px",
                  borderRadius: "4px",
                  backgroundColor:
                    hoveredGroup === group ? "#EDEDFC" : "transparent",
                }}
                onMouseEnter={() => handleMouseEnter(group)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Dot สี */}
                <span
                  style={{
                    display: "inline-block",
                    width: "15px",
                    height: "15px",
                    background: groupColors[group as keyof typeof groupColors],
                    borderRadius: "2px",
                  }}
                />
                {group}

                {/* ไอคอน Visibility, Add, Delete */}
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

      <div>
  <SectionHeader
    title="Collaboration Group"
    isOpen={showCollabGroup}
    toggle={() => setShowCollabGroup(!showCollabGroup)}
  />
  {showCollabGroup && (
    <>
      <ul style={{ listStyle: "none", margin: "0", padding: "0" }}>
        {collabGroups.map((group, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px",
              cursor: "pointer",
              backgroundColor:
                hoveredCollabGroup === group ? "#EDEDFC" : "transparent",
              borderRadius: "4px",
            }}
            onMouseEnter={() => setHoveredCollabGroup(group)}
            onMouseLeave={() => setHoveredCollabGroup(null)}
          >
            <span style={{ fontSize: "16px" }}>{group}</span>
            {hoveredCollabGroup === group && (
              <div style={{ display: "flex", gap: "5px" }}>
                <VisibilityIcon
                  style={{ fontSize: "18px", color: "#A8A8A8", cursor: "pointer" }}
                  onClick={() => toggleGroupVisibility(group)}
                />
                <AddIcon
                  style={{ fontSize: "18px", color: "#A8A8A8", cursor: "pointer" }}
                  onClick={() => setOpenPopupCollab(true)}
                />
                <DeleteIcon
                  style={{ fontSize: "18px", color: "#A8A8A8", cursor: "pointer" }}
                  onClick={() => handleDeleteGroup(group)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* Add New Group */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "5px",
          borderRadius: "4px",
          cursor: "pointer",
          color: "#A8A8A8",
          fontWeight: "300",
          fontSize: "16px",
        }}
        onClick={() => {
          setOpenPopupAdd(true)
        }}
      >
        <AddIcon style={{ fontSize: "18px" }} />
        <span>Add New Group</span>
      </div>
    </>
  )}
</div>


      {/* Subject Group */}
      <div>
        <SectionHeader
          title="Subject Group"
          isOpen={showSubjectGroup}
          toggle={() => setShowSubjectGroup(!showSubjectGroup)}
        />
        {showSubjectGroup && (
          <ul style={{ listStyle: "none", margin: "0", padding: "0" }}>
            {subjects.map((subject) => (
              <li key={subject.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px", cursor: "pointer" }}>
                <input type="checkbox" style={{ cursor: "pointer" }} />
                <span style={{ fontSize: "16px" }}>
                  {subject.id} - {subject.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Home and Settings */}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "10px" }}>
          <Home style={{ color: "#A8A8A8" }} />
          <span style={{ fontSize: "16px", fontWeight: "300", color: "#A8A8A8" }}>Home</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "10px" }}>
          <Settings style={{ color: "#A8A8A8" }} />
          <span style={{ fontSize: "16px", fontWeight: "300", color: "#A8A8A8" }}>Settings</span>
        </div>
      </div>
      
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

{openPopupAdd && (
        <CollabAddGroup
          open={openPopupAdd}
          onClose={() => setOpenPopupAdd(false)}
          addNewEvent={handleAddGroup}
        />
      )}
      {openPopupCollab && (
        <CollaborationPopup
          open={openPopupCollab}
          onClose={() => setOpenPopupCollab(false)}
        />
      )}
    </div>
  );
};

export default LeftSide;
