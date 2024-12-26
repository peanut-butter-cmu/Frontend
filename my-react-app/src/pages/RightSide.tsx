import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DescriptionIcon from "@mui/icons-material/Description";
import EventPopup from "./components/EventPopup";

interface Event {
  title: string;
  start: string; // Keep as string because mock data uses ISO format
  end: string;
  idGroup: number;
  color?: string; // Optional until added
}

interface RightSideProps {
  events: Event[];
  // addNewEvent: (newEvent: Event) => void;
}

const groupColors = [
  { idGroup: 1, key: "CMU", name: "CMU", color: "#615EFC" },
  { idGroup: 2, key: "Classroom", name: "Class", color: "#41B3A2" },
  {
    idGroup: [3],
    key: "Quiz",
    name: "Quiz",
    color: " #FF9100",
  },
  {
    idGroup: [4],
    key: "Assignment",
    name: "Assignment",
    color: " #FCC26D",
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

 

const RightSide: React.FC<RightSideProps> = ({ events }) => {
  const [openPopupEvent, setOpenPopupEvent] = useState(false);

  // const eventsWithColor = events.map((event) => {
  //   const groupColor = groupColors.find(
  //     (group) => group.idGroup === event.idGroup
  //   )?.color;
  //   return { ...event, color: groupColor || "#ddd" }; 
  // });

  const eventsWithColor = events.map((event) => {
    const groupColor = groupColors.find((group) =>
      Array.isArray(group.idGroup)
        ? group.idGroup.includes(event.idGroup)
        : group.idGroup === event.idGroup
    )?.color?.trim() || "#ddd"; // Default color
    return { ...event, color: groupColor };
  });

  // ฟังก์ชันจัดกลุ่ม Events ตามวันที่
  const groupEventsByDate = (events: Event[]): Record<string, Event[]> => {
    return events.reduce((acc: Record<string, Event[]>, event: Event) => {
      const dateKey = new Date(event.start).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    }, {});
  };

  // จัดกลุ่มอีเวนต์
    const groupedEvents = groupEventsByDate(eventsWithColor);

  // คำนวณอีเวนต์ของวันนี้
  const today = new Date();
  const todayFormatted = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const todayEvents = groupedEvents[todayFormatted] || [];
  return (
    <div
      style={{
        padding: "15px",
        borderRadius: "0px",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        height: "100%",
        width:"20%",
      }}
    >

      {/* Add New Event */}
      <button
         onClick={() => setOpenPopupEvent(true)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#8576FF",
          color: "#fff",
          border: "1.5px solid #8576FF",
          padding: "7px",
          fontSize: "17px",
          fontWeight: "500",
          borderRadius: "20px",
          cursor: "pointer",
          gap: "10px",
        }}
      >
        + Add New
      </button>

      {/* Search Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#F4F4F4",
          borderRadius: "8px",
          padding: "10px 14px",
          border: "1px solid #ddd",
        }}
      >
        <SearchIcon
          style={{
            color: "#757575",
            fontSize: "20px",
            marginRight: "8px",
          }}
        />

        <input
          type="text"
          placeholder="Search"
          style={{
            flex: "1",
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            fontSize: "16px",
            color: "#757575",
          }}
        />
      </div>

      

      <div
        style={{
          maxHeight: "800px",
          overflowY: "auto",
          paddingRight: "5px",
        }}
      >
        {/* Section Today */}
      <div
        style={{
          maxHeight: "800px",
          overflowY: "auto",
          paddingRight: "5px",
        }}
      >
        <p
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: "400",
              textAlign: "left",
              marginBottom: "5px",
            }}
          >
            Today
          </p>
        {/* Event Container */}
        <div>
          {todayEvents.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
                color: "#757575",
                fontSize: "16px",
                fontWeight: "400",
              }}
            >
              No Upcoming
            </div>
          ) : (
            todayEvents.map((event, index) => {
           // หา groupColor ที่ตรงกับ idGroup
const groupColor = groupColors.find((group) =>
  Array.isArray(group.idGroup)
    ? group.idGroup.includes(event.idGroup) // รองรับ idGroup แบบ Array
    : group.idGroup === event.idGroup // รองรับ idGroup แบบเดี่ยว
)?.color?.trim(); // ใช้ trim() เพื่อตัดช่องว่างใน color หากมี

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px",
                    background: "#F9F9FB",
                    borderRadius: "10px",
                    padding: "8px",
                    position: "relative",
                  }}
                >
                  {/* เส้นสีด้านซ้าย */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "8px",
                      background: groupColor || "#ddd", // ใช้สี default หากหาไม่เจอ
                      borderRadius: "10px 0 0 10px",
                    }}
                  ></div>

                  {/* เนื้อหา Event */}
                  <div style={{ flex: 1, paddingLeft: "8px" }}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "300",
                        textAlign: "left",
                        color: "#000",
                      }}
                    >
                      {event.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "300",
                        textAlign: "left",
                        marginTop: "2px",
                      }}
                    >
                      <AccessTimeIcon fontSize="small" />
                      {event.start && event.end
              ? new Date(event.start).getHours() === 0 &&
                new Date(event.start).getMinutes() === 0 &&
                new Date(event.end).getHours() === 23 &&
                new Date(event.end).getMinutes() === 59
                ? "All Day"
                : `${new Date(event.start).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${new Date(event.end).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
              : "All Day"}
                    </div>
                  </div>

                  {/* Icon ด้านขวา */}
                  {(event.idGroup === 3 || event.idGroup === 4) && (
        <div>
          <DescriptionIcon style={{ color: "#A6AEBF" }} />
        </div>
      )}
                </div>
              );
            })
          )}
        </div>
        </div>

        {/* Section Other Events */}
       {/* Section Other Events */}
<div style={{ overflowY: "auto" }}>
  {Object.keys(groupedEvents)
    .filter((date) => {
      // แปลง String "DD MMM YYYY" เป็น Date Object
      const eventDate = new Date(date);
      return eventDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(a).getTime();
      const dateB = new Date(b).getTime();
      return dateA - dateB;
    })
    .map((date) => (
      <div key={date}>
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "400",
            textAlign: "left",
            marginBottom: "8px",
          }}
        >
          {date}
        </p>
        {groupedEvents[date].map((event, index) => {
          // หา groupColor ที่ตรงกับ idGroup
const groupColor = groupColors.find((group) =>
  Array.isArray(group.idGroup)
    ? group.idGroup.includes(event.idGroup) // รองรับ idGroup แบบ Array
    : group.idGroup === event.idGroup // รองรับ idGroup แบบเดี่ยว
)?.color?.trim(); // ใช้ trim() เพื่อตัดช่องว่างใน color หากมี

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
                background: "#F9F9FB",
                borderRadius: "10px",
                padding: "8px",
                position: "relative",
              }}
            >
              {/* เส้นสีด้านซ้าย */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "8px",
                  background: groupColor || "#ddd", // ใช้สี default หากหาไม่เจอ
                  borderRadius: "10px 0 0 10px",
                }}
              ></div>

              {/* เนื้อหา Event */}
              <div style={{ flex: 1, paddingLeft: "8px" }}>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "300",
                    textAlign: "left",
                    color: "#000",
                  }}
                >
                  {event.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0px",
                    color: "#000",
                    fontSize: "14px",
                    fontWeight: "300",
                    textAlign: "left",
                    marginTop: "2px",
                  }}
                >
                  <AccessTimeIcon fontSize="small" />
                  <div style={{ marginLeft: "5px" }}>
                  {event.start && event.end
              ? new Date(event.start).getHours() === 0 &&
                new Date(event.start).getMinutes() === 0 &&
                new Date(event.end).getHours() === 23 &&
                new Date(event.end).getMinutes() === 59
                ? "All Day"
                : `${new Date(event.start).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${new Date(event.end).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
              : "All Day"}
                  </div>
                </div>
              </div>

              {/* Icon ด้านขวา */}
              {(event.idGroup === 3 || event.idGroup === 4) && (
        <div>
          <DescriptionIcon style={{ color: "#A6AEBF" }} />
        </div>
      )}
            </div>
          );
        })}
      </div>
    ))}
</div>

        </div>
        {openPopupEvent && (
        <EventPopup
          open={openPopupEvent}
          onClose={() => setOpenPopupEvent(false)}
        />
      )}
    </div>
  );
};

export default RightSide;