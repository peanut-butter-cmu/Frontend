import React, { useState, useEffect } from "react"
import moment from "moment"
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import InfoIcon from "@mui/icons-material/Info"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import SearchIcon from "@mui/icons-material/Search"

import MiniCalendar from "./components/MiniCalendar"
import EventPopup from "./components/EventPopup"
import { useSMCalendar } from "smart-calendar-lib"

// Define types
interface Event {
  title: string
  start: Date
  end: Date
  groups: (number | string)[]
  color?: string
}

interface Group {
  id: number | string
  title: string
  color: string
}

/**
 * 1) CalendarContainer เป็น Flex Container และกินความสูงเต็มจอ
 * 2) flexDirection: "column" จัด layout แนวตั้ง
 */
const CalendarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  // กำหนดให้กินพื้นที่สูงเท่าหน้าจอ
  minHeight: "100vh",
  boxSizing: "border-box",
  backgroundColor: "#f0f0fa",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}))

const CalendarCard = styled(Paper)(({ theme }) => ({
  borderRadius: "15px",
  padding: theme.spacing(3),
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto 24px auto",
}))

const SearchContainer = styled(Box)(() => ({
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  marginBottom: "16px",
}))

/**
 * 3) TodoCard ให้ flex: 1 เพื่อขยายเต็มพื้นที่ที่เหลือ
 *    และกำหนด display: "flex", flexDirection: "column"
 *    เพื่อให้เนื้อหาภายในจัดเรียงแนวตั้ง
 */
const TodoCard = styled(Paper)(() => ({
    borderRadius: "15px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    maxHeight: "calc(100vh - 200px)", // adjust the value (200px) as needed for your header/footer
    overflowY: "auto", // show scrollbar when content overflows
  }));

const CalendarToggleButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  backgroundColor: "#f0f0fa",
  color: "#6b5cb4",
  borderRadius: "30px",
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  "&:hover": {
    backgroundColor: "#e8e8f5",
  },
}))

const MobliePage: React.FC = () => {
  // สำหรับส่วนปฏิทิน
  const [showCalendar, setShowCalendar] = useState<boolean>(false)
  const [currentDate] = useState<Date>(new Date) 

  // สำหรับ Event List
  const [openPopupEvent, setOpenPopupEvent] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [events, setEvents] = useState<Event[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [_isLoaded, setIsLoaded] = useState<boolean>(false)
  const smCalendar = useSMCalendar()
  const stableCalendar = React.useMemo(() => smCalendar, [])

  // ฟังก์ชันดึงข้อมูล
  const fetchEventsDynamic = async (startDate: Date, endDate: Date) => {
    try {
      const fetchedEvents = await smCalendar.getEvents(startDate, endDate)
      const fetchedGroups = await smCalendar.getGroups()

      if (Array.isArray(fetchedGroups)) {
        const formattedGroups: Group[] = fetchedGroups.map((group: any) => ({
          id: group.id,
          title: group.title,
          color: group.color,
        }))
        setGroups(formattedGroups)
      } else if ((fetchedGroups as any).groups) {
        const formattedGroups: Group[] = ((fetchedGroups as { groups: any[] }).groups).map(
          (group: any) => ({
            id: group.id,
            title: group.title,
            color: group.color,
          })
        )
        setGroups(formattedGroups)
      }

      const eventsArray = Array.isArray(fetchedEvents)
        ? fetchedEvents
        : (fetchedEvents as { calendar: any[] }).calendar

      if (!Array.isArray(eventsArray)) {
        throw new Error("Expected events to be an array")
      }

      console.log("Fetched Events:", fetchedEvents)
      console.log("Fetched Groups:", fetchedGroups)

      const formattedEvents = eventsArray.map((event: any) => ({
        title: event.title,
        start: event.start || event.date,
        end: event.end || event.date,
        groups: Array.isArray(event.groups) ? event.groups : [event.groups],
      }))

      setEvents(formattedEvents)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    const startDate = new Date()
    const endDate = moment().clone().add(1, "month").endOf("month").toDate()
    fetchEventsDynamic(startDate, endDate)
  }, [stableCalendar])

  // กำหนดสีให้กับ event
  const eventsWithColor = events.map((event) => {
    const eventGroupId = Array.isArray(event.groups)
      ? event.groups.reduce(
          (min, curr) => (Number(curr) < Number(min) ? curr : min),
          event.groups[0]
        )
      : event.groups

    const matchingGroup = groups.find(
      (group) => String(group.id) === String(eventGroupId)
    )

    return { ...event, color: matchingGroup ? matchingGroup.color : "#ddd" }
  })

  const filteredEvents = eventsWithColor.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // จัดกลุ่ม Event ตามวันที่
  const groupEventsByDate = (events: Event[]): Record<string, Event[]> => {
    const groupedEvents: Record<string, Event[]> = {}
    events.forEach((event) => {
      const startDate = new Date(event.start)
      const endDate = new Date(event.end)
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
        })
        if (!groupedEvents[dateKey]) groupedEvents[dateKey] = []
        groupedEvents[dateKey].push(event)
      }
    })
    return groupedEvents
  }

  const groupedEvents = groupEventsByDate(filteredEvents)
  const today = new Date()
  const todayFormatted = today.toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  const todayEvents = groupedEvents[todayFormatted] || []

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar)
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const formatMonth = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  return (
    <CalendarContainer>
      {/* ส่วนแสดงปฏิทิน */}
      <CalendarCard>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {showCalendar && (
            <IconButton sx={{ position: "absolute", left: 0 }}>
              <KeyboardArrowLeftIcon sx={{ color: "#6b5cb4" }} />
            </IconButton>
          )}
          <Typography variant="h4" align="center" sx={{ color: "#6b5cb4", fontWeight: 500 }}>
            {formatMonth(currentDate)}
          </Typography>
          <IconButton sx={{ ml: 1 }}>
            <InfoIcon sx={{ color: "#6b5cb4", opacity: 0.7 }} />
          </IconButton>
          {showCalendar && (
            <IconButton sx={{ position: "absolute", right: 0 }}>
              <KeyboardArrowRightIcon sx={{ color: "#6b5cb4" }} />
            </IconButton>
          )}
        </Box>

        <Typography variant="h6" align="center" sx={{ color: "#666", mt: 1, mb: 2 }}>
          Today: {formatDate(currentDate)}
        </Typography>

        {showCalendar && (
          <MiniCalendar onDateSelect={(date) => console.log("Selected date:", date)} />
        )}

        <CalendarToggleButton
          variant="contained"
          fullWidth
          onClick={toggleCalendar}
          startIcon={showCalendar ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        >
          {showCalendar ? "Hide Calendar" : "Show Calendar"}
        </CalendarToggleButton>
      </CalendarCard>

      {/* Search Section (อยู่ด้านบน TodoCard) */}
      <SearchContainer>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: "10px 14px",
            borderRadius: "15px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            width: "95%",
          }}
        >
          <SearchIcon
            sx={{
              color: "#757575",
              fontSize: "20px",
              mr: "8px",
            }}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: "16px",
              color: "#757575",
            }}
          />
        </Box>
      </SearchContainer>

      {/* Card สำหรับ ToDo List (flex: 1) */}
      <TodoCard>
        {/* ด้านในใช้ flex: 1, flexDirection: column เพื่อขยายเต็ม */}
        <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
          {/* ส่วนแสดงรายการ Today */}
          <Box sx={{ overflowY: "auto", pr: "5px" /* ถ้าต้องการ scroll */, mb: 2 }}>
            <Typography
              sx={{
                m: 0,
                fontSize: "17px",
                fontWeight: "400",
                textAlign: "left",
                mb: "5px",
              }}
            >
              Today
            </Typography>
            <Box>
              {todayEvents.length === 0 ? (
                <Box
                  sx={{
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
                </Box>
              ) : (
                todayEvents.map((event, index) => {
                  const color = event.color || "#ddd"
                  return (
                    <Box
                      key={index}
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        mb: "6px",
                        background: "#F9F9FB",
                        borderRadius: "10px",
                        p: "8px",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "8px",
                          background: color,
                          borderRadius: "10px 0 0 10px",
                        }}
                      />
                      <Box sx={{ flex: 1, pl: "8px" }}>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: "300",
                            textAlign: "left",
                            color: "#000",
                          }}
                        >
                          {event.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                            color: "#000",
                            fontSize: "14px",
                            fontWeight: "300",
                            textAlign: "left",
                            mt: "2px",
                          }}
                        >
                          <AccessTimeIcon fontSize="small" />
                          <Box sx={{ ml: "5px" }}>
                            {new Date(event.start).getTime() === new Date(event.end).getTime()
                              ? `Due: ${new Date(event.start).toLocaleTimeString([], {
                                  timeZone: "UTC",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}`
                              : new Date(event.start).getHours() === 0 &&
                                new Date(event.start).getMinutes() === 0 &&
                                new Date(event.end).getHours() === 23 &&
                                new Date(event.end).getMinutes() === 59
                              ? "All Day"
                              : `${new Date(event.start).toLocaleTimeString([], {
                                  timeZone: "UTC",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })} - ${new Date(event.end).toLocaleTimeString([], {
                                  timeZone: "UTC",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}`}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )
                })
              )}
            </Box>
          </Box>

          {/* Section Other Events */}
          <Box sx={{ overflowY: "auto", pr: "5px" }}>
            {Object.keys(groupedEvents)
              .filter((date) => {
                const eventDate = new Date(date)
                return eventDate >= today
              })
              .sort((a, b) => {
                const dateA = new Date(a).getTime()
                const dateB = new Date(b).getTime()
                return dateA - dateB
              })
              .map((date) => (
                <Box key={date} sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      m: 0,
                      fontSize: "16px",
                      fontWeight: "400",
                      textAlign: "left",
                      mb: "8px",
                    }}
                  >
                    {date}
                  </Typography>
                  {groupedEvents[date].map((event, index) => {
                    const color = event.color || "#ddd"
                    return (
                      <Box
                        key={index}
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          mb: "6px",
                          background: "#F9F9FB",
                          borderRadius: "10px",
                          p: "8px",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "8px",
                            background: color,
                            borderRadius: "10px 0 0 10px",
                          }}
                        />
                        <Box sx={{ flex: 1, pl: "8px" }}>
                          <Typography
                            sx={{
                              fontSize: "16px",
                              fontWeight: "300",
                              textAlign: "left",
                              color: "#000",
                            }}
                          >
                            {event.title}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0px",
                              color: "#000",
                              fontSize: "14px",
                              fontWeight: "300",
                              textAlign: "left",
                              mt: "2px",
                            }}
                          >
                            <AccessTimeIcon fontSize="small" />
                            <Box sx={{ ml: "5px" }}>
                              {new Date(event.start).getTime() ===
                              new Date(event.end).getTime()
                                ? `Due: ${new Date(event.start).toLocaleTimeString([], {
                                    timeZone: "UTC",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  })}`
                                : new Date(event.start).getHours() === 0 &&
                                  new Date(event.start).getMinutes() === 0 &&
                                  new Date(event.end).getHours() === 23 &&
                                  new Date(event.end).getMinutes() === 59
                                ? "All Day"
                                : `${new Date(event.start).toLocaleTimeString([], {
                                    timeZone: "UTC",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  })} - ${new Date(event.end).toLocaleTimeString([], {
                                    timeZone: "UTC",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  })}`}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              ))}
          </Box>
        </Box>
      </TodoCard>

      {openPopupEvent && (
        <EventPopup open={openPopupEvent} onClose={() => setOpenPopupEvent(false)} />
      )}
    </CalendarContainer>
  )
}

export default MobliePage
