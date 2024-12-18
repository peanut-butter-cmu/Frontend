import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Typography,
  InputAdornment,
  Switch,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarMonth";
import TimeTodayIcon from "@mui/icons-material/LockClockOutlined";
import VideoCallIcon from "@mui/icons-material/VideoCallOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationAddOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RepeatIcon from "@mui/icons-material/Repeat";
import Event from "../asset/IconEvent.png";

interface EventPopupProps {
    open: boolean;
    onClose: () => void;
  }

const EventPopup: React.FC<EventPopupProps> = ({ open, onClose  }) => {
    const [selectedColor, setSelectedColor] = useState<string>("#FF4081");
    const [startTime, setStartTime] = useState<string>("12:00 pm");
    const [endTime, setEndTime] = useState<string>("08:00 pm");
    const [isAllDay, setIsAllDay] = useState<boolean>(false);
    const [repeatInterval, setRepeatInterval] = useState<string>("none");
    const [reminders, setReminders] = useState<string>("none");

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

  return (
    <>
      <Dialog
  open={open}
  onClose={(reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      handleClose(); // อนุญาตให้ปิดได้เฉพาะเมื่อไม่ใช่การคลิก backdrop หรือกด ESC
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
                      selected={new Date()}
                      onChange={(date) => console.log(date)}
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
                      selected={new Date()}
                      onChange={(date) => console.log(date)}
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
                      onChange={() => setIsAllDay(!isAllDay)}
                      inputProps={{ "aria-label": "toggle all day" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#757575",
                        marginLeft: "4px",
                      }}
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
                  <input
                    type="text"
                    value={startTime.split(" ")[0]}
                    onChange={(e) =>
                      setStartTime(
                        `${e.target.value} ${
                          startTime.includes("pm") ? "pm" : "am"
                        }`
                      )
                    }
                    placeholder="HH:MM"
                    style={{
                      width: "60px",
                      padding: "8px",
                      textAlign: "center",
                      backgroundColor: "#F5F7F8",
                      border: "none",
                      borderRadius: "8px",
                      color: "#000",
                      fontSize: "1rem",
                    }}
                  />
                  <select
                    value={startTime.includes("pm") ? "pm" : "am"}
                    onChange={(e) => {
                      const timeWithoutPeriod = startTime.split(" ")[0];
                      setStartTime(`${timeWithoutPeriod} ${e.target.value}`);
                    }}
                    style={{
                      padding: "4px",
                      backgroundColor: "#F5F7F8",
                      border: "none",
                      borderRadius: "8px",
                      color: "#000",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                  </select>
                </div>

                <span style={{ fontSize: "0.875rem", color: "#90A4AE" }}>
                  -
                </span>

                {/* End Time Input */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <input
                    type="text"
                    value={endTime.split(" ")[0]}
                    onChange={(e) =>
                      setEndTime(
                        `${e.target.value} ${
                          endTime.includes("pm") ? "pm" : "am"
                        }`
                      )
                    }
                    placeholder="HH:MM"
                    style={{
                      width: "60px",
                      padding: "8px",
                      textAlign: "center",
                      backgroundColor: "#F5F7F8",
                      border: "none",
                      borderRadius: "8px",
                      color: "#000",
                      fontSize: "1rem",
                    }}
                  />
                  <select
                    value={endTime.includes("pm") ? "pm" : "am"}
                    onChange={(e) => {
                      const timeWithoutPeriod = endTime.split(" ")[0];
                      setEndTime(`${timeWithoutPeriod} ${e.target.value}`);
                    }}
                    style={{
                      padding: "4px",
                      backgroundColor: "#F5F7F8",
                      border: "none",
                      borderRadius: "8px",
                      color: "#000",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                  </select>
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
                    <option value="custom">Custom...</option>
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
                  <option value="none">At start event</option>
                  <option value="everyDay">5 min</option>
                  <option value="everyWeekday">10 min</option>
                  <option value="everyWeek">30 min</option>
                  <option value="every2Weeks">1 hour</option>
                  <option value="custom">Custom...</option>
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

export default EventPopup;
