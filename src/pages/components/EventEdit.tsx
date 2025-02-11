import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Typography,
  InputAdornment,
  Autocomplete,
  Switch,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarMonth";
import TimeTodayIcon from "@mui/icons-material/LockClockOutlined";
import VideoCallIcon from "@mui/icons-material/VideoCallOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationAddOutlined";
import PriorityIcon from "@mui/icons-material/LowPriorityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./custom-datepicker.css";
import RepeatIcon from "@mui/icons-material/Repeat";
import Event from "../asset/IconEvent.png";
import { useSMCalendar } from "smart-calendar-lib";
import Swal from "sweetalert2";

interface EventEditProps {
  open: boolean;
  onClose: () => void;
  event: {
    id: number;
    title: string;
    start: string;
    end: string;
  };
}

const EventEdit: React.FC<EventEditProps> = ({ open, onClose, event }) => {
  const [selectedColor, setSelectedColor] = useState<string>("#FF4081");
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [repeatInterval, setRepeatInterval] = useState<string>("none");
  const [reminders, setReminders] = useState<string>("none");
  const [priority, _setPriority] = useState<string>("Medium Priority");

  const [title, setTitle] = useState<string>(event.title || "");
  const [startDate, setStartDate] = useState<Date | null>(
    event.start ? new Date(event.start) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    event.end ? new Date(event.end) : null
  );
  const [startTime, setStartTime] = useState<string>(
    event.start ? new Date(event.start).toTimeString().slice(0, 5) : "00:00"
  );
  const [endTime, setEndTime] = useState<string>(
    event.end ? new Date(event.end).toTimeString().slice(0, 5) : "23:59"
  );

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setStartDate(event.start ? new Date(event.start) : null);
      setEndDate(event.end ? new Date(event.end) : null);
      setStartTime(
        event.start ? new Date(event.start).toTimeString().slice(0, 5) : "00:00"
      );
      setEndTime(
        event.end ? new Date(event.end).toTimeString().slice(0, 5) : "23:59"
      );
    }
    console.log("end :", event.end);
    console.log("start :",event.start);

    
  }, [event]);

  const handleStartTimeChange = (time: string) => {
    if (!isAllDay) {
      setStartTime(time);
      if (endTime < time) {
        setEndTime(time);
      }
    }
  };

  const handleEndTimeChange = (time: string) => {
    if (!isAllDay) {
      if (time >= startTime) {
        setEndTime(time);
      } else {
        Swal.fire({
          title: "Invalid Time",
          text: "End time must be after the start time.",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  const handleAllDayToggle = () => {
    if (
      startDate !== null &&
      endDate !== null &&
      startDate.toDateString() !== endDate.toDateString()
    ) {
      return;
    }

    setIsAllDay(!isAllDay);
    if (!isAllDay) {
      setStartTime("00:00");
      setEndTime("00:00");
    }
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);

    if (date && endDate && date.toDateString() !== endDate.toDateString()) {
      setIsAllDay(true);
      setStartTime("00:00");
      setEndTime("00:00");
    } else {
      setIsAllDay(false);
    }

    if (endDate && date && endDate < date) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
  if (startDate && date) {
    if (startDate.toDateString() !== date.toDateString()) {
      setIsAllDay(true);
      setStartTime("00:00");
      setEndTime("00:00");
    } else {
      setIsAllDay(false);
    }

    // Normalize the dates by removing the time component.
    const normalizedStart = new Date(startDate.toDateString());
    const normalizedEnd = new Date(date.toDateString());

    if (normalizedEnd >= normalizedStart) {
      setEndDate(date);
    } else {
      Swal.fire({
        title: "Invalid Date",
        text: "End date must be on or after the start date.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }
};


  const handleClose = () => {
    onClose();
  };

  const [isFocused, setIsFocused] = useState({
    conferencing: false,
    location: false,
    reminders: false,
  });

  const handleFocus = (field: string) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  const smCalendar = useSMCalendar();
  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      Swal.fire({
        title: "Invalid Dates",
        text: "Please select valid start and end dates.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const updatedEvent = {
      title,
      start: isAllDay
        ? new Date(`${startDate?.toDateString()} 00:00`)
        : new Date(`${startDate?.toDateString()} ${startTime}`),
      end: isAllDay
        ? new Date(`${endDate?.toDateString()} 23:59`)
        : new Date(`${endDate?.toDateString()} ${endTime}`),
    };
    console.log(event.id);
    Swal.fire({
      title: "Confirm Update",
      text: "Are you sure you want to update this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#050C9C",
      cancelButtonColor: "#ff0000",
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await smCalendar.updateEvent(event.id, updatedEvent);
          Swal.fire({
            title: "Event Updated!",
            text: "Your event has been updated successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            onClose();
          });
        } catch (error) {
          console.error("Error updating event:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to update the event. Please try again.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={(reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleClose();
          }
        }}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 5,
            padding: -1,
            width: "620px",
            maxWidth: "none",
          },
        }}
      >
        <DialogTitle>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={Event}
              alt="Event"
              style={{
                width: "50px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "16px",
              }}
            />
            <Typography variant="h5" fontWeight="bold">
              Event
            </Typography>
            <IconButton
              sx={{ marginLeft: "auto" }}
              onClick={onClose}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {/* Left Section */}
            <div style={{ flex: 3, paddingRight: "16px" }}>
              <TextField
                placeholder="Title"
                fullWidth
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{
                  marginBottom: 2,
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    borderRadius: 2,
                    backgroundColor: "#F5F7F8",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                }}
              />
              <div style={{ marginBottom: "-10px" }}>
                <div
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <CalendarTodayIcon
                    sx={{
                      color: "#90A4AE",
                      marginTop: "-7px",
                      fontSize: "28px",
                    }}
                  />
                  <span style={{ fontSize: "0.875rem", color: "#90A4AE" }}>
                    Start/End date
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        handleStartDateChange(date);
                      }}
                      dateFormat="dd MMM yyyy"
                      customInput={
                        <TextField
                          variant="outlined"
                          sx={{
                            width: "130px",
                            "& .MuiOutlinedInput-root": {
                              height: "35px",
                              borderRadius: 2,
                              backgroundColor: "#F5F7F8",
                              textAlign: "center",
                              "& fieldset": {
                                border: "none",
                              },
                            },
                          }}
                        />
                      }
                    />
                    <span style={{ fontSize: "0.875rem", color: "#90A4AE" }}>
                      -
                    </span>
                    <DatePicker
                      selected={endDate}
                      onChange={handleEndDateChange}
                      dateFormat="dd MMM yyyy"
                      customInput={
                        <TextField
                          variant="outlined"
                          sx={{
                            width: "130px",
                            "& .MuiOutlinedInput-root": {
                              height: "35px",
                              borderRadius: 2,
                              backgroundColor: "#F5F7F8",
                              textAlign: "center",
                              "& fieldset": {
                                border: "none",
                              },
                            },
                          }}
                        />
                      }
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Switch
                      checked={isAllDay}
                      onChange={handleAllDayToggle}
                      inputProps={{ "aria-label": "toggle all day" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "#757575", marginLeft: "4px" }}
                    >
                      All Day
                    </Typography>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <TimeTodayIcon
                  sx={{ color: "#90A4AE", marginTop: "-7px", fontSize: "28px" }}
                />

                <span style={{ fontSize: "0.875rem", color: "#90A4AE" }}>
                  Start/End Time
                </span>

                {/* Start Time Input */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Autocomplete
                    options={Array.from({ length: 24 * 4 }).map((_, index) => {
                      const hours = String(Math.floor(index / 4)).padStart(
                        2,
                        "0"
                      );
                      const minutes = String((index % 4) * 15).padStart(2, "0");
                      return `${hours}:${minutes}`;
                    })}
                    value={startTime}
                    onChange={(_, newValue) =>
                      handleStartTimeChange(newValue || "")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        sx={{
                          width: "128px",
                          "& .MuiOutlinedInput-root": {
                            height: "40px",
                            borderRadius: "8px",
                            backgroundColor: "#F5F7F8",
                            color: "#000",
                            fontSize: "1rem",
                            cursor: "pointer",
                          },
                          "& fieldset": {
                            border: "none",
                          },
                        }}
                      />
                    )}
                    freeSolo
                    disabled={
                      isAllDay ||
                      (startDate !== null &&
                        endDate !== null &&
                        startDate.toDateString() !== endDate.toDateString())
                    }
                  />
                </div>
                <span style={{ fontSize: "0.875rem", color: "#90A4AE" }}>
                  -
                </span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Autocomplete
                    options={Array.from({ length: 24 * 4 }).map((_, index) => {
                      const hours = String(Math.floor(index / 4)).padStart(
                        2,
                        "0"
                      );
                      const minutes = String((index % 4) * 15).padStart(2, "0");
                      return `${hours}:${minutes}`;
                    })}
                    value={endTime}
                    onChange={(_, newValue) =>
                      handleEndTimeChange(newValue || "")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        sx={{
                          width: "128px",
                          "& .MuiOutlinedInput-root": {
                            height: "40px",
                            borderRadius: "8px",
                            backgroundColor: "#F5F7F8",
                            color: "#000",
                            fontSize: "1rem",
                            cursor: "pointer",
                          },
                          "& fieldset": {
                            border: "none",
                          },
                        }}
                      />
                    )}
                    freeSolo
                    disabled={
                      isAllDay ||
                      (startDate !== null &&
                        endDate !== null &&
                        startDate.toDateString() !== endDate.toDateString())
                    }
                  />
                </div>
              </div>

              {/* Repeat Dropdown */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                {/* Repeat Dropdown */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginLeft: "12px",
                  }}
                >
                  <RepeatIcon sx={{ color: "#90A4AE", fontSize: "22px" }} />
                  <select
                    value={repeatInterval}
                    onChange={(e) => setRepeatInterval(e.target.value)}
                    style={{
                      padding: "0",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      color: "#90A4AE",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                    }}
                  >
                    <option value="none" hidden>
                      Repeat
                    </option>
                    <option value="none"> no repeat</option>
                    <option value="everyDay">Every day</option>
                    <option value="everyWeekday">
                      Every weekday (Mon-Fri)
                    </option>
                    <option value="everyWeek">Every week</option>
                    <option value="every2Weeks">Every 2 weeks</option>
                    <option value="everyMonth">Every month</option>
                    <option value="everyYear">Every year</option>
                  </select>
                </div>

                {/* Color Picker */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <TextField
                    type="color"
                    variant="outlined"
                    value={selectedColor}
                    InputProps={{
                      inputProps: {
                        style: {
                          width: "20px",
                          height: "23px",
                          padding: "0",
                          border: "none",
                          borderRadius: "50%",
                          appearance: "none",
                          cursor: "pointer",
                          backgroundColor: "transparent",
                        },
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        padding: "0",
                        width: "auto",
                        height: "auto",
                        "& fieldset": {
                          border: "none",
                        },
                      },
                    }}
                    onChange={(e) => setSelectedColor(e.target.value)}
                  />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: selectedColor,
                    }}
                  >
                    Color
                  </span>
                </div>
              </div>

              <TextField
                fullWidth
                placeholder="Conferencing"
                variant="outlined"
                onFocus={() => handleFocus("conferencing")}
                onBlur={() => handleBlur("conferencing")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VideoCallIcon sx={{ color: "#90A4AE" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    borderRadius: 2,
                    backgroundColor: isFocused.conferencing
                      ? "#F5F7F8"
                      : "transparent",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "#90A4AE",
                    fontSize: "0.875rem",
                    opacity: 1,
                  },
                }}
              />
              <TextField
                fullWidth
                placeholder="Location"
                variant="outlined"
                onFocus={() => handleFocus("location")}
                onBlur={() => handleBlur("location")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ color: "#90A4AE" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    borderRadius: 2,
                    backgroundColor: isFocused.location
                      ? "#F5F7F8"
                      : "transparent",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "#90A4AE",
                    fontSize: "0.875rem",
                    opacity: 1,
                  },
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginLeft: "12px",
                  marginTop: "10px",
                  marginBottom: "5px",
                }}
              >
                <NotificationsIcon
                  sx={{ color: "#90A4AE", fontSize: "22px" }}
                />
                <select
                  value={reminders}
                  onChange={(e) => setReminders(e.target.value)}
                  style={{
                    padding: "0",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "#90A4AE",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                  }}
                >
                  <option value="none" hidden>
                    Reminders
                  </option>
                  <option value="none">none</option>
                  <option value="atStart">At time event</option>
                  <option value="5min">5 min before</option>
                  <option value="10min">10 min before</option>
                  <option value="15min">15 min before</option>
                  <option value="30min">30 min before</option>
                  <option value="1hour">1 hour before</option>
                  <option value="2hour">2 hour before</option>
                  <option value="1day">1 day before</option>
                  <option value="2day">2 day before</option>
                  <option value="1week">1 week before</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginLeft: "12px",
                  marginTop: "15px",
                  marginBottom: "5px",
                }}
              >
                <PriorityIcon sx={{ color: "#90A4AE", fontSize: "22px" }} />
                <select
                  value={priority}
                  onChange={(e) => setReminders(e.target.value)}
                  style={{
                    padding: "0",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "#90A4AE",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                  }}
                >
                  <option value="none" hidden>
                    Priority{" "}
                  </option>
                  <option value="Low Priority">Low Priority</option>
                  <option value="Medium Priority">Medium Priority</option>
                  <option value="High Priority">High Priority</option>
                </select>
              </div>

              <TextField
                placeholder="Description"
                fullWidth
                variant="outlined"
                sx={{
                  marginTop: 1,
                  marginBottom: 2,

                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    borderRadius: 2,
                    backgroundColor: "#F5F7F8",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                }}
              />

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    color: "#FF0000",
                    borderColor: "#FF0000",
                    "&:hover": {
                      borderColor: "#FF0000",
                      backgroundColor: "#FFEAEA",
                    },
                  }}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    backgroundColor: "#050C9C",
                    "&:hover": {
                      backgroundColor: "#1A1D5F",
                    },
                  }}
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventEdit;
