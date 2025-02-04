import React, { useState } from "react";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface MiniCalendarProps {

}

const MiniCalendar: React.FC<MiniCalendarProps> = ({  }) => {
  const [currentMonth, setCurrentMonth] = useState(moment());

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
//   const isToday = (date: moment.Moment) => moment().isSame(date, "day");

  return (
    <div style={{ textAlign: "center", padding: "1px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          style={{ border: "none", backgroundColor: "transparent", cursor: "pointer", padding: "3px 6px" }}
          onClick={handlePreviousMonth}
        >
          <ArrowBackIcon style={{ fontSize: "20px" }} />
        </button>
        <h4 style={{ margin: "0", fontSize: "30px", fontWeight: "300" }}>
          {currentMonth.format("MMMM YYYY")}
        </h4>
        <button
          style={{ border: "none", backgroundColor: "transparent", cursor: "pointer", padding: "3px 6px" }}
          onClick={handleNextMonth}
        >
          <ArrowForwardIcon style={{ fontSize: "20px" }} />
        </button>
      </div>

      {/* Days Header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", fontWeight: "400", fontSize: "20px", color: "#888" , marginTop: "20px", marginBottom: "20px" }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} style={{ textAlign: "center" }}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginTop: "20px" }}>
        {generateCalendar().map((day, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              width: "60px",
              height: "70px",
              lineHeight: "20px",
              textAlign: "center",
              fontSize: "25px",
              borderRadius: "50%",
              margin: "0 auto",
              backgroundColor:  "transparent",
              color: "black",
              fontWeight: "normal",
            }}
            // onClick={() => onDateSelect(day.format("YYYY-MM-DD"))}
          >
            {day.date()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
