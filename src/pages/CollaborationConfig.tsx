import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Autocomplete,
  Box,
  IconButton,
  Typography,
  Avatar,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AddIcon from "@mui/icons-material/Add";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./components/custom-datepicker.css";
import RemoveIcon from "@mui/icons-material/Remove";
import Swal from "sweetalert2";
import WaitingApprovalPopup from "./components/WaitingApprovalPopup";

const CollaborationConfig: React.FC = () => {
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const [minDuration, setMinDuration] = useState(30);
  const [maxDuration, setMaxDuration] = useState(60);
  const durationError = minDuration > maxDuration;

  const handleMinChange = (hours: number, minutes: number) => {
    if (hours > 23) {
      setHelperMsg("Hour must not exceed 23");
      return;
    }
    if (minutes > 60) {
      setHelperMsg("Minutes must not exceed 60");
      return;
    }
    const newMin = hours * 60 + minutes;
    if (newMin === 0) {
      setHelperMsg("Minimum duration cannot be 0 hour 0 mins.");
      return;
    }
    if (newMin > maxDuration) {
      setHelperMsg("Minimum duration must not exceed maximum duration.");
    } else {
      setHelperMsg("");
    }
    setMinDuration(newMin);
  };
  
  const handleMaxChange = (hours: number, minutes: number) => {
    if (hours > 23) {
      setHelperMsg("Hour must not exceed 23");
      return;
    }
    if (minutes > 60) {
      setHelperMsg("Minutes must not exceed 60");
      return;
    }
    const newMax = hours * 60 + minutes;
    if (newMax === 0) {
      setHelperMsg("Maximum duration cannot be 0 hour 0 mins.");
      return;
    }
    if (newMax < minDuration) {
      setHelperMsg("Maximum duration must not be less than minimum duration.");
    } else {
      setHelperMsg("");
    }
    setMaxDuration(newMax);
  };
  
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("18:00");
  const [timeError, setTimeError] = useState({ start: false, end: false });
  const [dateError, setDateError] = useState(false);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (endDate && date && date > endDate) {
      setDateError(true);
    } else {
      setDateError(false);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (startDate && date && date < startDate) {
      setDateError(true);
    } else {
      setDateError(false);
    }
  };

  const validateTime = (start: any, end: any) => {
    if (start && end) {
      if (start > end) {
        setTimeError({ start: true, end: true });
      } else {
        setTimeError({ start: false, end: false });
      }
    }
  };
  const handleStartTimeChange = (newValue: any) => {
    setStartTime(newValue);
    validateTime(newValue, endTime);
  };

  const handleEndTimeChange = (newValue: any) => {
    setEndTime(newValue);
    validateTime(startTime, newValue);
  };

  const timeOptions = Array.from({ length: 24 * 4 }).map((_, index) => {
    const hours = String(Math.floor(index / 4)).padStart(2, "0");
    const minutes = String((index % 4) * 15).padStart(2, "0");
    return `${hours}:${minutes}`;
  });

  const [repeatOption, setRepeatOption] = useState("none");
  const [reminders, setReminders] = useState<string[]>(["none"]);
  const [searchValue, setSearchValue] = useState("");
  const [errorText, setErrorText] = useState("");
  const [helperMsg, setHelperMsg] = useState("");

  const handleAddReminder = () => {
    if (reminders.length < 3) {
      setReminders([...reminders, "none"]);
    }
  };

  const handleRemoveReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  const handleReminderChange = (index: number, value: string) => {
    const updatedReminders = [...reminders];
    updatedReminders[index] = value;
    setReminders(updatedReminders);
  };

  const [meetingName, setMeetingName] = useState("");
  const [idealDaysError, setIdealDaysError] = useState(false);
  const [attendeesError, setAttendeesError] = useState(false);
  const [meetingNameError, setMeetingNameError] = useState(false);

  const [openPopup, setOpenPopup] = useState(false);
  const handleSave = () => {
    let isValid = true;

    if (!meetingName.trim()) {
      setMeetingNameError(true);
      isValid = false;
    } else {
      setMeetingNameError(false);
    }

    if (selectedDays.length === 0) {
      setIdealDaysError(true);
      isValid = false;
    } else {
      setIdealDaysError(false);
    }

    if (attendees.length < 1) {
      setAttendeesError(true);
      isValid = false;
    } else {
      setAttendeesError(false);
    }

    if (minDuration > maxDuration) {
      setHelperMsg("Minimum duration must not exceed maximum duration.");
      isValid = false;
    } else {
      setHelperMsg("");
    }

    if (startDate && endDate && startDate > endDate) {
      setDateError(true);
      isValid = false;
    } else {
      setDateError(false);
    }

    if (startTime && endTime && startTime > endTime) {
      setTimeError({ start: true, end: true });
      isValid = false;
    } else {
      setTimeError({ start: false, end: false });
    }

    if (isValid) {
      setOpenPopup(true);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel and go back?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/Collaboration");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#fff",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div
        style={{
          marginTop: "10px",
          marginBottom: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 270px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "34px",
            fontWeight: 300,
          }}
        >
          Collaboration
        </h2>
      </div>

      <Divider sx={{ borderColor: "#e5e5e5", mb: 2, width: "100%" }} />

      <div
        style={{
          display: "flex",
          flex: 1,
          overflowY: "auto",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        {/* กล่องสีขาวบน */}
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            backgroundColor: "#ffffff",
            padding: "30px 100px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
            border: attendeesError ? "2px solid red" : "none",
          }}
        >
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          >
            <Box sx={{ mb: 1 }}>
              <Typography sx={{ fomtsize: "12px", fontWeight: "500" }}>
                Attendees
              </Typography>
            </Box>

            <TextField
              fullWidth
              size="small"
              placeholder="Search for attendees to add..."
              value={searchValue}
              onChange={(e) => {
                const val = e.target.value;
                setSearchValue(val);
                if (!val.trim()) {
                  setHelperMsg("");
                  setErrorText("");
                  return;
                }
                setHelperMsg("Tap Enter to add an email address");
                setErrorText("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const emailRegex = /!/;
                  if (!emailRegex.test(searchValue)) {
                    setErrorText("Invalid email address");
                    setHelperMsg("");
                  } else {
                    setErrorText("");
                    setHelperMsg("");
                    const newEmail = searchValue + "@cmu.ac.th";
                    setAttendees((prev) => [...prev, newEmail]);
                    setSearchValue("");
                  }
                }
              }}
              error={Boolean(errorText)}
              helperText={errorText || helperMsg}
              FormHelperTextProps={{
                sx: {
                  color: "#5263F3",
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9999px",
                  "& fieldset": {
                    borderColor: "#ddd",
                  },
                  "&:hover fieldset": {
                    borderColor: "#bbb",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#665af0",
                  },
                },
                "& .MuiOutlinedInput-root.Mui-error fieldset": {
                  borderColor: "#f44336 !important",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography sx={{ color: "#777" }}>@cmu.ac.th</Typography>
                  </InputAdornment>
                ),
              }}
            />

            {/* รายการผู้ใช้หลัก */}
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                maxWidth: 600,
                margin: "auto",
              }}
            >
              {/* แถวแรก */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                }}
              >
                <Avatar
                  alt="User"
                  src="https://via.placeholder.com/40"
                  sx={{ width: 35, height: 35 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "400",
                      m: 0,
                      lineHeight: 0.7,
                      color: "#000",
                    }}
                  >
                    You
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#5263F3",
                    }}
                  >
                    nnapatsiri@cmu.ac.th
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {attendees.map((email, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    borderTop: "1px solid #ddd",
                  }}
                >
                  <Avatar sx={{ width: 35, height: 35 }}>A</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "400",
                        m: 0,
                        lineHeight: 0.7,
                        color: "#5263F3",
                      }}
                    >
                      {email}
                    </Typography>
                    <Typography variant="body2">
                      <Box
                        component="span"
                        sx={{
                          mr: 1,
                          fontSize: "12px",
                          color: "#666666",
                        }}
                      >
                        Wait to calendar access
                      </Box>
                    </Typography>
                  </Box>

                  <IconButton
                    size="small"
                    sx={{ color: "#ff0000" }}
                    onClick={() => {
                      setAttendees((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>

            {attendees.length === 0 && (
              <Box
                sx={{
                  bgcolor: "#F8EFD4",
                  color: "#635D4A",
                  p: 2,
                  mt: 2,
                  borderRadius: "6px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WarningAmberIcon sx={{ color: "#C4A647" }} />
                  <Typography variant="body2" sx={{ fontWeight: "500" }}>
                    Please add at least one other attendee to this meeting.
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </div>
        {attendeesError && (
          <Typography
            style={{
              color: "#ff0000",
              marginBottom: "20px",
              marginTop: "-10px",
              fontSize: "14px",
            }}
          >
            You need at least 2 attendees (including yourself).
          </Typography>
        )}
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            backgroundColor: "#ffffff",
            marginBottom: "20px",
            padding: "30px 100px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Meeting Name */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "-10px",
            }}
          >
            <Typography
              sx={{
                fontWeight: "400",
                fontFamily: "kanit",
                fontSize: "16px",
                color: "#000000",
              }}
            >
              Meeting Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={meetingName}
              onChange={(e) => {
                setMeetingName(e.target.value);
                if (meetingNameError && e.target.value.trim()) {
                  setMeetingNameError(false);
                }
              }}
              error={meetingNameError}
              helperText={meetingNameError ? "Please enter a meeting name" : ""}
              FormHelperTextProps={{
                sx: {
                  color: "#ff0000",
                  fontSize: "14px",
                },
              }}
              InputProps={{
                style: {
                  backgroundColor: meetingNameError ? "#ffe6e6" : "#f9f9fb",
                  borderRadius: "8px",
                  padding: 0,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  minHeight: "45px",
                  "& fieldset": {
                    border: "none",
                  },
                  "& .MuiInputBase-input": {
                    padding: "6px 8px",
                  },
                },
              }}
            />
          </div>
          {/* Ideal Days */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "-10px",
            }}
          >
            <Typography
              sx={{
                fontWeight: "400",
                fontFamily: "kanit",
                fontSize: "16px",
                color: "#000000",
              }}
            >
              Ideal days
            </Typography>
            <div
              style={{
                display: "flex",
                gap: "10px",
                fontFamily: "kanit",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <Button
                  key={day}
                  variant="contained"
                  onClick={() => toggleDay(day)}
                  sx={{
                    minWidth: "50px",
                    height: "50px",
                    padding: "5px",
                    borderRadius: "50%",
                    textTransform: "none",
                    backgroundColor: selectedDays.includes(day)
                      ? "#5263F3"
                      : "#f9f9fb",
                    color: selectedDays.includes(day) ? "#FFFFFF" : "#000000",
                    "&:hover": {
                      backgroundColor: selectedDays.includes(day)
                        ? "#5263F3"
                        : "#e0e0e0",
                    },
                  }}
                >
                  {day}
                </Button>
              ))}
            </div>
            {idealDaysError && (
              <Typography
                sx={{
                  color: "#ff0000",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                Please select at least one day.
              </Typography>
            )}
          </div>

          {/* Duration */}
          <div style={{ marginBottom: "-10px" }}>
            <Typography
              sx={{
                fontWeight: "400",
                fontFamily: "kanit",
                fontSize: "16px",
                marginBottom: "10px",
                color: "#000",
              }}
            >
              Duration
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                justifyContent: "space-between",
              }}
            >
              {/* Minimum */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  alignItems: "center",
                  border: durationError ? "1px solid red" : "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "5px",
                  flex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#888",
                    marginBottom: "-6px",
                    fontFamily: "kanit",
                  }}
                >
                  Minimum
                </Typography>
                <Box
                  sx={{ display: "flex", gap: "15px", alignItems: "baseline" }}
                >
                <Select
  value={Math.floor(minDuration / 60)}
  onChange={(e) =>
    handleMinChange(
      parseInt(String(e.target.value), 10),
      minDuration % 60
    )
  }
  variant="standard"
  sx={{
    width: "50px",
    textAlign: "center",
    height: "30px", 
  }}
  MenuProps={{
    PaperProps: {
      sx: {
        maxHeight: 200,
      },
    },
  }}
>
  {Array.from({ length: 24 }, (_, index) => (
    <MenuItem key={index} value={index}>
      {index}
    </MenuItem>
  ))}
</Select>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "300",
                      fontFamily: "kanit",
                    }}
                  >
                    Hour
                  </Typography>
                  <Select
  value={minDuration % 60}
  onChange={(e) =>
    handleMinChange(
      Math.floor(minDuration / 60),
      parseInt(String(e.target.value), 10) || 0
    )
  }
  variant="standard"
  sx={{ width: "50px", textAlign: "center" }}
>
  <MenuItem value={0}>0</MenuItem>
  <MenuItem value={30}>30</MenuItem>
</Select>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "300",
                      fontFamily: "kanit",
                    }}
                  >
                    Mins
                  </Typography>
                </Box>
              </Box>

              {/* Maximum */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  alignItems: "center",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "5px",
                  flex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#888",
                    marginBottom: "-6px",
                    fontFamily: "kanit",
                  }}
                >
                  Maximum
                </Typography>
                <Box
                  sx={{ display: "flex", gap: "15px", alignItems: "baseline" }}
                >
                 <Select
  value={Math.floor(maxDuration / 60)}
  onChange={(e) =>
    handleMaxChange(
      parseInt(String(e.target.value), 10),
      maxDuration % 60
    )
  }
  variant="standard"
  sx={{
    width: "50px",
    textAlign: "center",
    height: "30px", 
  }}
  MenuProps={{
    PaperProps: {
      sx: {
        maxHeight: 200, 
      },
    },
  }}
>
  {Array.from({ length: 24 }, (_, index) => (
    <MenuItem key={index} value={index}>
      {index}
    </MenuItem>
  ))}
</Select>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "300",
                      fontFamily: "kanit",
                    }}
                  >
                    Hour
                  </Typography>

                  <Select
  value={maxDuration % 60}
  onChange={(e) =>
    handleMaxChange(
      Math.floor(maxDuration / 60),
      parseInt(String(e.target.value), 10) || 0
    )
  }
  variant="standard"
  sx={{ width: "50px", textAlign: "center" }}
>
  <MenuItem value={0}>0</MenuItem>
  <MenuItem value={30}>30</MenuItem>
</Select>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "300",
                      fontFamily: "kanit",
                    }}
                  >
                    Mins
                  </Typography>
                </Box>
              </Box>
            </Box>
            {durationError && (
              <Typography sx={{ color: "red", fontSize: "14px", mt: 1 }}>
                Minimum duration must not exceed maximum duration.
              </Typography>
            )}
          </div>

          {/* Ideal Time */}
          <div style={{ marginBottom: "-10px" }}>
            <Typography
              sx={{
                fontWeight: "400",
                fontFamily: "kanit",
                fontSize: "16px",
                marginBottom: "10px",
                color: "#000",
              }}
            >
              Ideal time
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
              }}
            >
              {/* Date Row */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {/* Start Date */}
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  dateFormat="dd MMM yyyy"
                  customInput={
                    <TextField
                      variant="outlined"
                      error={dateError}
                      sx={{
                        width: "180px",
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          borderColor: dateError ? "#ff0000" : "#ccc",
                          textAlign: "center",
                          "& .MuiInputBase-input": {
                            textAlign: "center",
                            fontFamily: "kanit",
                          },
                        },
                      }}
                    />
                  }
                />

                <Typography sx={{ fontSize: "1.5rem", color: "#5263F3" }}>
                  -
                </Typography>

                {/* End Date */}
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  dateFormat="dd MMM yyyy"
                  customInput={
                    <TextField
                      variant="outlined"
                      error={dateError}
                      sx={{
                        width: "180px",
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          borderColor: dateError ? "#ff0000" : "#ccc",
                          textAlign: "center",
                          "& .MuiInputBase-input": {
                            textAlign: "center",
                            fontFamily: "kanit",
                          },
                        },
                      }}
                    />
                  }
                />
              </Box>
              {dateError && (
                <Typography
                  sx={{ color: "red", fontSize: "14px", marginTop: "5px" }}
                >
                  Start date cannot be after end date.
                </Typography>
              )}
              {/* Time Row */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {/* Start Time */}
                <Autocomplete
                  options={timeOptions}
                  value={startTime}
                  onChange={(_e, newValue) => handleStartTimeChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      error={timeError.start}
                      sx={{
                        width: "180px",
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                        },
                        "& .MuiInputBase-input": {
                          textAlign: "right",
                          fontFamily: "kanit",
                        },
                      }}
                    />
                  )}
                />

                <Typography sx={{ fontSize: "1.5rem", color: "#5263F3" }}>
                  -
                </Typography>

                {/* End Time */}
                <Autocomplete
                  options={timeOptions}
                  value={endTime}
                  onChange={(_e, newValue) => handleEndTimeChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      error={timeError.end}
                      sx={{
                        width: "180px",
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                        },
                        "& .MuiInputBase-input": {
                          textAlign: "right",
                          fontFamily: "kanit",
                        },
                      }}
                    />
                  )}
                />
              </Box>
              {(timeError.start || timeError.end) && (
                <Typography
                  sx={{ color: "red", fontSize: "14px", marginTop: "5px" }}
                >
                  Start time cannot be after end time.
                </Typography>
              )}
            </div>
          </div>

          {/* Repeat */}
          <Typography
            sx={{
              fontWeight: "400",
              fontFamily: "kanit",
              fontSize: "16px",
              marginBottom: "-10px",
              color: "#000",
            }}
          >
            Repeat
          </Typography>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <FormControl
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  height: "40px",
                  fontSize: "16px",
                  fontFamily: "kanit",
                },
              }}
            >
              <Select
                defaultValue="none"
                value={repeatOption}
                onChange={(e) => setRepeatOption(e.target.value)}
              >
                <MenuItem value="none">none</MenuItem>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
            <TextField
              type="number"
              defaultValue="1"
              fullWidth
              disabled={
                !(repeatOption === "Weekly" || repeatOption === "Monthly")
              }
              inputProps={{
                min: 1,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  fontSize: "16px",
                  fontFamily: "kanit",
                },
              }}
            />
          </div>

          {/* Reminder */}
          <Box>
            <Typography
              sx={{
                fontWeight: "400",
                fontFamily: "kanit",
                fontSize: "16px",
                marginBottom: "8px",
                marginTop: "-10px",
                color: "#000",
              }}
            >
              Reminder
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "8px",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {reminders.map((reminder, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Select
                    value={reminder}
                    onChange={(e) =>
                      handleReminderChange(index, e.target.value)
                    }
                    sx={{
                      width: "160px",
                      backgroundColor: "#fff",
                      borderRadius: "4px",
                      height: "40px",
                      fontSize: "16px",
                      fontFamily: "kanit",
                    }}
                  >
                    <MenuItem value="none" hidden>
                      Reminders
                    </MenuItem>
                    <MenuItem value="none">none</MenuItem>
                    <MenuItem value="atStart">At time event</MenuItem>
                    <MenuItem value="5min">5 min before</MenuItem>
                    <MenuItem value="10min">10 min before</MenuItem>
                    <MenuItem value="15min">15 min before</MenuItem>
                    <MenuItem value="30min">30 min before</MenuItem>
                    <MenuItem value="1hour">1 hour before</MenuItem>
                    <MenuItem value="2hour">2 hour before</MenuItem>
                    <MenuItem value="1day">1 day before</MenuItem>
                    <MenuItem value="2day">2 day before</MenuItem>
                    <MenuItem value="1week">1 week before</MenuItem>
                  </Select>
                  <IconButton
                    onClick={() => handleRemoveReminder(index)}
                    sx={{
                      color: "red",
                      padding: "4px",
                      visibility: reminders.length === 1 ? "hidden" : "visible",
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {reminders.length < 3 && (
                <IconButton
                  onClick={handleAddReminder}
                  sx={{
                    color: "#5263F3",
                    padding: "6px",
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Priority */}
          <Typography
            sx={{
              fontWeight: "400",
              fontFamily: "kanit",
              fontSize: "16px",
              marginBottom: "-10px",
              marginTop: "-10px",
              color: "#000",
            }}
          >
            Priority
          </Typography>
          <FormControl
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                height: "40px",
                fontSize: "16px",
                fontFamily: "kanit",
              },
            }}
          >
            <Select defaultValue="">
              <MenuItem value="Low Priority">Low Priority</MenuItem>
              <MenuItem value="Medium Priority">Medium Priority</MenuItem>
              <MenuItem value="High Priority">High Priority</MenuItem>
            </Select>
          </FormControl>

          {/* Generate Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              sx={{
                border: "1px solid #ff0000",
                backgroundColor: "#FFFFFF",
                color: "#ff0000",
                textTransform: "none",
                maxWidth: "120px",
                borderRadius: "20px",
                padding: "5px 20px",
                fontSize: "16px",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#ff0000",
                  color: "#FFFFFF",
                },
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                border: "1px solid #5263F3",
                backgroundColor: "#FFFFFF",
                color: "#5263F3",
                textTransform: "none",
                maxWidth: "120px",
                borderRadius: "20px",
                padding: "5px 20px",
                fontSize: "16px",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#5263F3",
                  color: "#FFFFFF",
                },
              }}
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
          <WaitingApprovalPopup
            open={openPopup}
            onClose={() => setOpenPopup(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default CollaborationConfig;
