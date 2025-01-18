import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DescriptionIcon from "@mui/icons-material/Description";
import EventPopup from "./components/EventPopup";

interface Event {
  title: string;
  start: string;
  end: string;
  groups: string | string[];
  color?: string;
}

interface RightSideProps {
  events: Event[];
}

const groupColors = [
  {
    groups: "8a9e8a40-9e8e-4464-8495-694b0012af80",
    key: "CMU",
    name: "CMU",
    color: "#615EFC",
  },
  {
    groups: "53adc81a-1089-4e84-a1c4-a77d1e1434c3",
    key: "Classroom",
    name: "Class",
    color: "#41B3A2",
  },
  {
    groups: ["427b92fc-d055-4109-b164-ca9313c2ee95"],
    key: "Quiz",
    name: "Quiz",
    color: " #FF9100",
  },
  {
    groups: ["6121a9c8-ec3f-47aa-ba8b-fbd28ccf27c8"],
    key: "Assignment",
    name: "Assignment",
    color: " #FCC26D",
  },
  {
    groups: "9314e483-dc11-438f-8855-046755ac0b64",
    key: "Final",
    name: "Final",
    color: "#FF0000",
  },
  {
    groups: "a9c0c854-f59f-47c7-b75d-c35c568856cd",
    key: "Midterm",
    name: "Midterm",
    color: "#FF0000",
  },
  {
    groups: "0bee62f7-4f9f-4735-92ac-2041446aac91",
    key: "Holiday",
    name: "Holiday",
    color: "#9DBDFF",
  },
  {
    groups: "156847db-1b7e-46a3-bc4f-15c19ef0ce1b",
    key: "Owner",
    name: "Owner",
    color: "#D6C0B3",
  },
];

const RightSide: React.FC<RightSideProps> = ({ events }) => {
  const [openPopupEvent, setOpenPopupEvent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // const eventsWithColor = events.map((event) => {
  //   const groupColor = groupColors.find(
  //     (group) => group.idGroup === event.idGroup
  //   )?.color;
  //   return { ...event, color: groupColor || "#ddd" };
  // });

  const eventsWithColor = events.map((event) => {
    const groupColor =
      groupColors
        .find((group) => {
          if (Array.isArray(group.groups)) {
            return Array.isArray(event.groups)
              ? event.groups.some((g) => group.groups.includes(g))
              : group.groups.includes(event.groups);
          } else {
            return Array.isArray(event.groups)
              ? event.groups.includes(group.groups)
              : group.groups === event.groups;
          }
        })
        ?.color?.trim() || "#ddd";

    return { ...event, color: groupColor };
  });

  const filteredEvents = eventsWithColor.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupEventsByDate = (events: Event[]): Record<string, Event[]> => {
    const groupedEvents: Record<string, Event[]> = {};

    events.forEach((event) => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);

      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dateKey = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        if (!groupedEvents[dateKey]) groupedEvents[dateKey] = [];
        groupedEvents[dateKey].push(event);
      }
    });

    return groupedEvents;
  };

  const groupedEvents = groupEventsByDate(filteredEvents);

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
        width: "20%",
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
          maxHeight: "830px",
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
                // const groupColor =
                groupColors
                  .find((group) =>
                    Array.isArray(group.groups)
                      ? group.groups.includes(event.groups as string)
                      : group.groups === event.groups
                  )
                  ?.color?.trim() || "#ddd";

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
                        background: event.color || "#ddd",
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
                        <div style={{ marginLeft: "5px" }}>
                          {new Date(event.start).getTime() ===
                          new Date(event.end).getTime()
                            ? `Due: ${new Date(event.start).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }
                              )}`
                            : new Date(event.start).getHours() === 0 &&
                              new Date(event.start).getMinutes() === 0 &&
                              new Date(event.end).getHours() === 23 &&
                              new Date(event.end).getMinutes() === 59
                            ? "All Day"
                            : `${new Date(event.start).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })} - ${new Date(event.end).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }
                              )}`}
                        </div>
                      </div>
                    </div>
                    {/* Icon ด้านขวา */}
                    {Array.isArray(event.groups) &&
                      (event.groups.includes(
                        "427b92fc-d055-4109-b164-ca9313c2ee95"
                      ) ||
                        event.groups.includes(
                          "6121a9c8-ec3f-47aa-ba8b-fbd28ccf27c8"
                        )) && (
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
        <div style={{ overflowY: "auto" }}>
          {Object.keys(groupedEvents)
            .filter((date) => {
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
                  // const groupColor =
                  groupColors
                    .find((group) =>
                      Array.isArray(group.groups)
                        ? group.groups.includes(event.groups as string)
                        : group.groups === event.groups
                    )
                    ?.color?.trim() || "#ddd";

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
                          background: event.color || "#ddd",
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
                            {new Date(event.start).getTime() ===
                            new Date(event.end).getTime()
                              ? `Due: ${new Date(
                                  event.start
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}`
                              : new Date(event.start).getHours() === 0 &&
                                new Date(event.start).getMinutes() === 0 &&
                                new Date(event.end).getHours() === 23 &&
                                new Date(event.end).getMinutes() === 59
                              ? "All Day"
                              : `${new Date(event.start).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )} - ${new Date(event.end).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )}`}
                          </div>
                        </div>
                      </div>

                      {/* Icon ด้านขวา */}
                      {Array.isArray(event.groups) &&
                        (event.groups.includes(
                          "427b92fc-d055-4109-b164-ca9313c2ee95"
                        ) ||
                          event.groups.includes(
                            "6121a9c8-ec3f-47aa-ba8b-fbd28ccf27c8"
                          )) && (
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
