import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DescriptionIcon from "@mui/icons-material/Description";
import EventPopup from "./components/EventPopup";

interface Event {
  title: string;
  start: Date;
  end: Date;
  color: string;
  group: string;
}

interface RightSideProps {
  events: Event[]; // รายการ Events
  groupedEvents: Record<string, Event[]>; // Events จัดกลุ่มตามวันที่
}


const RightSide: React.FC<RightSideProps> = ({ groupedEvents }) => {
  const [openPopupEvent, setOpenPopupEvent] = useState(false);

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
        background: "#F9F9FB",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        height: "97%",
      }}
    >
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

      {/* Add New Event */}
      <button
         onClick={() => setOpenPopupEvent(true)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFF",
          color: "#8576FF",
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
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
            marginTop: "-5px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: "400",
              textAlign: "left",
            }}
          >
            Today
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: "400",
              textAlign: "right",
            }}
          >
            {todayEvents.length > 1
              ? `${todayEvents.length} Things`
              : `${todayEvents.length} Thing`}
          </p>
        </div>

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
            todayEvents.map((event, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                  background: "#F5F7F8",
                  borderRadius: "10px",
                  padding: "10px",
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
                    background: event.color,
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
                      gap: "5px",
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "300",
                      textAlign: "left",
                      marginTop: "2px",
                    }}
                  >
                    <AccessTimeIcon fontSize="small" />
                    {event.start && event.end
      ? `${new Date(event.start).toLocaleTimeString([], {
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
                <div>
                  <DescriptionIcon style={{ color: "#A6AEBF" }} />
                </div>
              </div>
            ))
          )}
        </div>

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
                {groupedEvents[date].map((event, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "6px",
                      background: "#F5F7F8",
                      borderRadius: "10px",
                      padding: "10px",
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
                        background: event.color,
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
                          gap: "5px",
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
                            ? `${new Date(event.start).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })} - ${new Date(event.end).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}`
                            : "All Day"}
                        </div>
                      </div>
                    </div>

                    {/* Icon ด้านขวา */}
                    <div>
                      <DescriptionIcon style={{ color: "#A6AEBF" }} />
                    </div>
                  </div>
                ))}
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