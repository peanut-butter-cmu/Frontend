import React, { useState, FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Typography,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Switch,
} from "@mui/material";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarTodayIcon from "@mui/icons-material/LockClockOutlined";
import PersonIcon from "@mui/icons-material/Person2Outlined";
import CloseIcon from "@mui/icons-material/Close";
import VideoCallIcon from "@mui/icons-material/VideoCallOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationsActiveOutlined";
import Collab from "../asset/IconCo.png";


// Props Interface
interface CollaborationPopupProps {
  open: boolean;
  onClose: () => void;
}

const CollaborationPopup: FC<CollaborationPopupProps> = ({ open, onClose }) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectAllDays, setSelectAllDays] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>("12:00");
  const [endTime, setEndTime] = useState<string>("08:00");
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [group] = useState<string>("Project Adv Copm");
  const [selectedColor, setSelectedColor] = useState<string>("#FF4081"); // เพิ่ม selectedColor

  const handleDaysChange = (
    _event: React.MouseEvent<HTMLElement>,
    newDays: string[]
  ) => {
    setSelectedDays(newDays);
    setSelectAllDays(newDays.length === 7);
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
    <Dialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          sx={{
            "& .MuiPaper-root": {
              borderRadius: 5,
            },
          }}
        >
      {/* Header */}
      <DialogTitle>
        <div style={{ display: "flex", alignItems: "center" }}>
        <img
              src={Collab}
              alt="Event"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "16px",
              }}
            />
          <Typography variant="h5" fontWeight="bold">
            Collaboration
          </Typography>
          <IconButton onClick={onClose} sx={{ marginLeft: "auto" }}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      {/* Content */}
      <DialogContent>
        {/* Title */}
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
        {/* Days of the Week */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarMonthIcon
            sx={{ color: "#90A4AE", marginTop: "-18px", fontSize: "28px" }}
          />
          <ToggleButtonGroup
            value={selectedDays}
            onChange={handleDaysChange}
            aria-label="days of the week"
            sx={{
              display: "flex",
              // gap: "10px",
              justifyContent: "center",
              marginBottom: 2,
            }}
          >
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <ToggleButton
                key={day}
                value={day}
                sx={{
                  textTransform: "none",
                  fontSize: "0.875rem",
                  padding: "2px 12px",
                  borderRadius: "8px",
                  border: "1px solid #000",
                  // borderLeft: "2px solid #000 !important",
                  "&.Mui-selected": {
                    backgroundColor: "#000",
                    color: "#fff",
                  },
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                {day}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "-18px",
            }}
          >
            <Switch
              checked={selectAllDays}
            //   onChange={handleToggleAllDay}
              inputProps={{ "aria-label": "select all days" }}
            />
            <span style={{ fontSize: "0.875rem", color: "#757575" }}>
              All Days
            </span>
          </div>
        </div>


        {/* Date Selection */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
            width: "100%",
            marginBottom: "15px",
            marginLeft: "50px",
          }}
        >
          {/* Hours Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "0.875rem", color: "#90A4AE" }}>
              Hours
            </span>
            <Select
              options={Array.from({ length: 24 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}`,
              }))}
              styles={{
                control: (base) => ({
                  ...base,
                  width: "60px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#F5F7F8",
                  border: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }),
                singleValue: (base) => ({
                  ...base,
                  textAlign: "center",
                }),
                placeholder: (base) => ({
                  ...base,
                  display: "none",
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: "4px",
                }),
                indicatorSeparator: () => ({
                  display: "none",
                }),
              }}
              isClearable={false}
              onChange={(selectedOption) => console.log(selectedOption)}
            />
          </div>

          {/* Minutes Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "0.875rem", color: "#90A4AE" }}>
              Minutes
            </span>
            <Select
              options={Array.from({ length: 60 }, (_, i) => ({
                value: i,
                label: `${i}`,
              }))}
              styles={{
                control: (base) => ({
                  ...base,
                  width: "60px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#F5F7F8",
                  border: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }),
                singleValue: (base) => ({
                  ...base,
                  textAlign: "center",
                }),
                placeholder: (base) => ({
                  ...base,
                  display: "none",
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: "4px",
                }),
                indicatorSeparator: () => ({
                  display: "none",
                }),
              }}
              isClearable={false}
              onChange={(selectedOption) => console.log(selectedOption)}
            />
          </div>

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

        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CalendarTodayIcon
              sx={{ color: "#90A4AE", marginTop: "-7px", fontSize: "28px" }}
            />
            <span style={{ fontSize: "0.875rem", color: "#90A4AE" }}>
              Start/End date
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              <span style={{ fontSize: "0.875rem", color: "#90A4AE" }}>-</span>
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
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: "0.875rem", color: "#90A4AE" }}>
            Start/End Time
          </span>

          {/* Start Time Input */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="text"
              value={startTime.split(" ")[0]}
              onChange={(e) =>
                setStartTime(
                  `${e.target.value} ${startTime.includes("pm") ? "pm" : "am"}`
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
                padding: "8px",
                backgroundColor: "#F5F7F8",
                border: "none",
                borderRadius: "4px",
                color: "#000",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              <option value="am">AM</option>
              <option value="pm">PM</option>
            </select>
          </div>

          <span style={{ fontSize: "1.2rem", color: "#000" }}>-</span>

          {/* End Time Input */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="text"
              value={endTime.split(" ")[0]}
              onChange={(e) =>
                setEndTime(
                  `${e.target.value} ${endTime.includes("pm") ? "pm" : "am"}`
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
              All
            </Typography>
          </div>
        </div>

        {/* Group */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
          <PersonIcon sx={{ color: "#90A4AE", marginRight: 1 }} />
          <Typography display="inline" color="gray">
            Group
          </Typography>
          <Chip
            label={group}
            sx={{ backgroundColor: "#F5F7F8", marginLeft: 2 }}
          />
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
                <VideoCallIcon />
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
                <LocationOnIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "40px",
              borderRadius: 2,
              backgroundColor: isFocused.location ? "#F5F7F8" : "transparent",
            },
            "& fieldset": {
              border: "none",
            },
          }}
        />
        <TextField
          fullWidth
          placeholder="Reminders"
          variant="outlined"
          onFocus={() => handleFocus("reminders")}
          onBlur={() => handleBlur("reminders")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <NotificationsIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "40px",
              borderRadius: 2,
              backgroundColor: isFocused.reminders ? "#F5F7F8" : "transparent",
            },
            "& fieldset": {
              border: "none",
            },
          }}
        />

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

        {/* <Typography sx={{ color: "#A8A8A8", marginBottom: 2 }}>
          napatsiri_p@cmu.ac.th • Free • Private
        </Typography> */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "20px",
              backgroundColor: "#96B6C5",
              "&:hover": {
                backgroundColor: "#405D72",
              },
            }}
          >
            Generate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationPopup;
