import React, { useState } from "react";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";


interface CalendarProps {
  startDate?: string | Date;
}

const Calendar: React.FC<CalendarProps> = ({ startDate }) => {
  // สร้าง moment object จาก startDate ถ้ามี
  const selectedDate = startDate ? moment(startDate) : null;

  // กำหนด currentMonth เป็นเดือนที่ได้รับจาก startDate ถ้ามี ไม่เช่นนั้นใช้วันที่ปัจจุบัน
  const [currentMonth, setCurrentMonth] = useState(
    moment(startDate ? startDate : undefined)
  );

  const generateCalendar = () => {
    const startOfMonth = currentMonth.clone().startOf("month").startOf("week");
    const endOfMonth = currentMonth.clone().endOf("month").endOf("week");

    const calendar = [];
    let day = startOfMonth.clone();
    while (day.isBefore(endOfMonth, "day")) {
      calendar.push(day.clone());
      day.add(1, "day");
    }
    return calendar;
  };

  const handlePreviousMonth = () =>
    setCurrentMonth(currentMonth.clone().subtract(1, "month"));
  const handleNextMonth = () =>
    setCurrentMonth(currentMonth.clone().add(1, "month"));

  return (
    <div style={{ textAlign: "center", padding: "1px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          style={{
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            padding: "3px 6px",
          }}
          onClick={handlePreviousMonth}
        >
          <ArrowBackIcon style={{ fontSize: "20px" }} />
        </button>
        <h4 style={{ margin: "0", fontSize: "30px", fontWeight: "300" }}>
          {currentMonth.format("MMMM YYYY")}
        </h4>
        <button
          style={{
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            padding: "3px 6px",
          }}
          onClick={handleNextMonth}
        >
          <ArrowForwardIcon style={{ fontSize: "20px" }} />
        </button>
      </div>

      {/* Days Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          fontWeight: "400",
          fontSize: "20px",
          color: "#888",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} style={{ textAlign: "center" }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginTop: "20px" }}>
        {generateCalendar().map((day, index) => {
          // ตรวจสอบว่า day ตรงกับ selectedDate หรือไม่
          const isSelected = selectedDate && day.isSame(selectedDate, "day");

          return (
            <div
              key={index}
              style={{
                position: "relative",
                width: "50px",
                height: "50px",
                margin: "0 auto",
                borderRadius: "50%",
                textAlign: "center",
              }}
            >
              {/* วางไอคอนดาวเบื้องหลัง */}
              {isSelected && (
                <StarIcon
                  style={{
                    color: "yellow",
                    fontSize: "70px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 0,
                  }}
                />
              )}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  lineHeight: "55px",
                  fontSize: "25px",
                  color: "black",
                  fontWeight: isSelected ? "bold" : "normal",
                }}
              >
                {day.date()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
