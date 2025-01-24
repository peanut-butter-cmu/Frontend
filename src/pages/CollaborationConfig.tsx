import React, { useState } from "react";
import Divider from "@mui/material/Divider";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
  Chip,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./components/custom-datepicker.css";
import RemoveIcon from "@mui/icons-material/Remove";

const CollaborationConfig: React.FC = () => {
  const [attendees, setAttendees] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddAttendee = () => {
    if (currentEmail && !attendees.includes(currentEmail)) {
      setAttendees([...attendees, currentEmail]);
      setCurrentEmail("");
    }
  };

  const handleRemoveAttendee = (email: string) => {
    setAttendees(attendees.filter((attendee) => attendee !== email));
  };

  const [minDuration, setMinDuration] = useState(30);
  const [maxDuration, setMaxDuration] = useState(60);

  const handleMinChange = (value: number) => {
    if (value >= 0 && value <= maxDuration) {
      setMinDuration(value);
    }
  };

  const handleMaxChange = (value: number) => {
    if (value >= minDuration) {
      setMaxDuration(value);
    }
  };

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("18:00");

  const handleStartDateChange = (date: Date | null) => setStartDate(date);
  const handleEndDateChange = (date: Date | null) => setEndDate(date);
  const handleStartTimeChange = (value: string) => setStartTime(value);
  const handleEndTimeChange = (value: string) => setEndTime(value);

  const timeOptions = Array.from({ length: 24 * 4 }).map((_, index) => {
    const hours = String(Math.floor(index / 4)).padStart(2, "0");
    const minutes = String((index % 4) * 15).padStart(2, "0");
    return `${hours}:${minutes}`;
  });

  const [reminders, setReminders] = useState<string[]>(["none"]);

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

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#f9f9fb",
        flexDirection: "column",
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
          flexDirection: "column",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            backgroundColor: "#ffffff",
            padding: "30px 90px",
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
                fontWeight: "500",
                fontFamily: "kanit",
                fontSize: "16px",
                color: "#000000",
              }}
            >
              Meeting Name
            </Typography>
            <TextField
              fullWidth
              InputProps={{
                style: {
                  backgroundColor: "#f9f9fb",
                  borderRadius: "8px",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
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
                fontWeight: "500",
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
                      ? "#0000FF"
                      : "#f9f9fb",
                    color: selectedDays.includes(day) ? "#FFFFFF" : "#000000",
                    "&:hover": {
                      backgroundColor: selectedDays.includes(day)
                        ? "#0000FF"
                        : "#e0e0e0",
                    },
                  }}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div style={{ marginBottom: "-10px" }}>
            <Typography
              sx={{
                fontWeight: "500",
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
                  Minimum
                </Typography>
                <Box
                  sx={{ display: "flex", gap: "15px", alignItems: "baseline" }}
                >
                  <TextField
                    type="text"
                    value={Math.floor(minDuration / 60)
                      .toString()
                      .padStart(2, "0")}
                    onChange={(e) => {
                      const hours = parseInt(e.target.value, 10) || 0;
                      const mins = minDuration % 60;
                      handleMinChange(hours * 60 + mins);
                    }}
                    inputProps={{
                      min: 0,
                      max: 99,
                      style: { textAlign: "center" },
                    }}
                    variant="standard"
                    sx={{
                      width: "50px",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "300",
                      fontFamily: "kanit",
                    }}
                  >
                    Hour
                  </Typography>
                  <TextField
                    type="text"
                    value={(minDuration % 60).toString().padStart(2, "0")}
                    onChange={(e) => {
                      const mins = parseInt(e.target.value, 10) || 0;
                      if (mins >= 0 && mins < 60) {
                        handleMinChange(
                          Math.floor(minDuration / 60) * 60 + mins
                        );
                      }
                    }}
                    inputProps={{
                      min: 0,
                      max: 59,
                      style: { textAlign: "center" },
                    }}
                    variant="standard"
                    sx={{
                      width: "50px",
                    }}
                  />
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
                  <TextField
                    type="text"
                    value={Math.floor(maxDuration / 60)
                      .toString()
                      .padStart(2, "0")}
                    onChange={(e) => {
                      const hours = parseInt(e.target.value, 10) || 0;
                      const mins = maxDuration % 60;
                      handleMaxChange(hours * 60 + mins);
                    }}
                    inputProps={{
                      min: 0,
                      max: 99,
                      style: { textAlign: "center" },
                    }}
                    variant="standard"
                    sx={{
                      width: "50px",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "300",
                      fontFamily: "kanit",
                    }}
                  >
                    Hour
                  </Typography>
                  <TextField
                    type="text"
                    value={(maxDuration % 60).toString().padStart(2, "0")}
                    onChange={(e) => {
                      const mins = parseInt(e.target.value, 10) || 0;
                      if (mins >= 0 && mins < 60) {
                        handleMaxChange(
                          Math.floor(maxDuration / 60) * 60 + mins
                        );
                      }
                    }}
                    inputProps={{
                      min: 0,
                      max: 59,
                      style: { textAlign: "center" },
                    }}
                    variant="standard"
                    sx={{
                      width: "50px",
                    }}
                  />
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
          </div>

          {/* Ideal Time */}
          <div style={{ marginBottom: "-10px" }}>
            <Typography
              sx={{
                fontWeight: "500",
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
                gap: "20px",
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
                      sx={{
                        width: "180px",
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
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

                <Typography sx={{ fontSize: "1.5rem", color: "#0000FF" }}>
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
                      sx={{
                        width: "180px",
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",

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
                  onChange={(e, newValue) =>
                    handleStartTimeChange(newValue || "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
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

                <Typography sx={{ fontSize: "1.5rem", color: "#0000FF" }}>
                  -
                </Typography>

                {/* End Time */}
                <Autocomplete
                  options={timeOptions}
                  value={endTime}
                  onChange={(e, newValue) =>
                    handleEndTimeChange(newValue || "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      sx={{
                        width: "180px",
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          textAlign: "center",

                          "& .MuiInputBase-input": {
                            textAlign: "right",
                            fontFamily: "kanit",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </div>
          </div>

          {/* Repeat */}
          <Typography
            sx={{
              fontWeight: "500",
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
              <Select defaultValue="none">
                <MenuItem value="none">none</MenuItem>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
            <TextField
              defaultValue="0"
              type="number"
              fullWidth
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
                fontWeight: "500",
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
                    color: "#0000FF",
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
              fontWeight: "500",
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
            }}
          >
            <Button
              variant="contained"
              sx={{
                border: "2px solid #0000FF",
                backgroundColor: "#FFFFFF",
                color: "#0000FF",
                textTransform: "none",
                maxWidth: "120px",
                borderRadius: "20px",
                padding: "5px 20px",
                fontSize: "16px",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#0000FF",
                  color: "#FFFFFF",
                },
              }}
            >
              Generate
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default CollaborationConfig;
