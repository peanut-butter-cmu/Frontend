import React, { useState , useEffect } from "react";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventPopup from "./components/EventPopup";
import { useSMCalendar } from "smart-calendar-lib";


interface Event {
  title: string;
  start: Date;
  end: Date;
  groups: (number | string)[];
  color?: string; 
}

interface RightSideProps {
  events: Event[];
}

interface Group {
  id: number | string;
  color: string;
}

const RightSide: React.FC<RightSideProps> = () => {
  const [openPopupEvent, setOpenPopupEvent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [_isLoaded, setIsLoaded] = useState(false);
  const smCalendar = useSMCalendar();
  const stableCalendar = React.useMemo(() => smCalendar, []);

    // ฟังก์ชันสำหรับดึงข้อมูลตามช่วงวันที่ที่กำหนด
    const fetchEventsDynamic = async (startDate: Date, endDate: Date) => {
      try {
        const fetchedEvents = await smCalendar.getEvents(startDate, endDate);
        const fetchedGroups = await smCalendar.getGroups();

        // console.log(fetchedEvents);
        // console.log(fetchedGroups);

        // ดึงข้อมูล groups
        if (Array.isArray(fetchedGroups)) {
          const formattedGroups: Group[] = fetchedGroups.map((group: any) => ({
            id: group.id,
            title: group.title,
            color: group.color,
            colorts: group.colorts || group.color,
          }));
          setGroups(formattedGroups);
        } else if ((fetchedGroups as any).groups) {
          const formattedGroups: Group[] = ((fetchedGroups as { groups: any[] }).groups).map((group: any) => ({
            id: group.id,
            title: group.title,
            color: group.color,
            colorts: group.colorts || group.color,
          }));
          setGroups(formattedGroups);
        }
        
        const eventsArray = Array.isArray(fetchedEvents)
        ? fetchedEvents
        : (fetchedEvents as { calendar: any[] }).calendar;
      
      if (!Array.isArray(eventsArray)) {
        throw new Error("Expected events to be an array");
      }
      
        console.log("Fetched Events:", fetchedEvents);
        console.log("Fetched Groups:", fetchedGroups);
    
        const formattedEvents = eventsArray.map((event: any) => ({
          title: event.title,
          start: event.start || event.date,
          end: event.end || event.date,
          groups: Array.isArray(event.groups) ? event.groups : [event.groups],
        }));
    
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    // ตั้งช่วงวันที่: startDate เป็นวันที่ 15 ของเดือนก่อนหน้า และ endDate เป็นวันที่ 15 ของเดือนถัดไป
    useEffect(() => {
      const startDate = new Date();
      const endDate = moment().clone().add(1, "month").endOf("month").toDate();
      fetchEventsDynamic(startDate, endDate);
    }, [stableCalendar]);

    const eventsWithColor = events.map((event) => {
      // ถ้า event.groups เป็น array ให้หา group id ที่น้อยที่สุด
      const eventGroupId = Array.isArray(event.groups)
        ? event.groups.reduce((min, curr) =>
            Number(curr) < Number(min) ? curr : min
          , event.groups[0])
        : event.groups;
      
      // หา group ที่มี id ตรงกับ eventGroupId ที่เลือกมา
      const matchingGroup = groups.find(
        (group) => String(group.id) === String(eventGroupId)
      );
      
      return { ...event, color: matchingGroup ? matchingGroup.color : "#ddd" };
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
          timeZone: "UTC",
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
    timeZone: "UTC",
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
                const color = event.color || "#ddd";
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
                        background: color,
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
                                  timeZone: "UTC",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }
                              )}`
                              : (
                                // เงื่อนไขเดิม: 00:00 -> 23:59 (Local Time)
                                (
                                  new Date(event.start).getHours() === 0 &&
                                  new Date(event.start).getMinutes() === 0 &&
                                  new Date(event.end).getHours() === 23 &&
                                  new Date(event.end).getMinutes() === 59
                                )
                                // เพิ่มเงื่อนไขใหม่: 00:00 -> 00:00 (UTC)
                                || (
                                  new Date(event.start).getUTCHours() === 0 &&
                                  new Date(event.start).getUTCMinutes() === 0 &&
                                  new Date(event.end).getUTCHours() === 0 &&
                                  new Date(event.end).getUTCMinutes() === 0
                                )
                              )
                              ? "All Day"
                            : `${new Date(event.start).toLocaleTimeString([], {
                              timeZone: "UTC",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })} - ${new Date(event.end).toLocaleTimeString(
                                [],
                                {
                                  timeZone: "UTC",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }
                              )}`}
                        </div>
                      </div>
                    </div>
                    
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
  const color = (event as any).color || "#ddd";
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
          background: color,
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
                                  timeZone: "UTC",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}`
                                : (
                                  // เงื่อนไขเดิม: 00:00 -> 23:59 (Local Time)
                                  (
                                    new Date(event.start).getHours() === 0 &&
                                    new Date(event.start).getMinutes() === 0 &&
                                    new Date(event.end).getHours() === 23 &&
                                    new Date(event.end).getMinutes() === 59
                                  )
                                  // เพิ่มเงื่อนไขใหม่: 00:00 -> 00:00 (UTC)
                                  || (
                                    new Date(event.start).getUTCHours() === 0 &&
                                    new Date(event.start).getUTCMinutes() === 0 &&
                                    new Date(event.end).getUTCHours() === 0 &&
                                    new Date(event.end).getUTCMinutes() === 0
                                  )
                                )
                                ? "All Day"
                              : `${new Date(event.start).toLocaleTimeString(
                                  [],
                                  {
                                    timeZone: "UTC",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )} - ${new Date(event.end).toLocaleTimeString(
                                  [],
                                  {
                                    timeZone: "UTC",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )}`}
                          </div>
                        </div>
                      </div>
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
