import { Card, Typography, IconButton } from "@mui/material";
import Divider from "@mui/material/Divider";
import RemoveIcon from "@mui/icons-material/Remove";
import Calendar from "../pages/components/Calendar";
import React from "react";

const mockEvents = [
  {
    date: "Wednesday, 14 February 2024",
    time: "14:00 - 14:30",
  },
  {
    date: "Wednesday, 14 February 2024",
    time: "14:00 - 14:30",
  },
  {
    date: "Wednesday, 14 February 2024",
    time: "14:00 - 14:30",
  },
  {
    date: "Wednesday, 14 February 2024",
    time: "14:00 - 14:30",
  },
  {
    date: "Wednesday, 14 February 2024",
    time: "14:00 - 14:30",
  },
  {
    date: "Wednesday, 14 February 2024",
    time: "14:00 - 14:30",
  },
  {
    date: "Wednesday, 14 February 2024",
    time: "14:00 - 14:30",
  },
  {
    date: "Wednesday, 14 February 2024",
    time: "14:00 - 14:30",
  },
  {
    date: "Wednesday, 14 February 2024",
    time: "14:00 - 14:30",
  },
  {
    date: "Wednesday, 14 February 2024",
    time: "14:00 - 14:30",
  },
];

const CollabGanerate = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          marginTop: "10px",
          marginBottom: "5px",
          display: "flex",
          alignItems: "center",
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

      <Divider sx={{ borderColor: "#e5e5e5", mb: 2 }} />
      {/* <div
        style={{

          padding: "0px 300px", 
        }}
      >
        <Typography fontWeight="500" fontSize="25px">
        Project Kickoff
        </Typography>
      </div> */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          padding: "32px 0",
          marginTop: "-10px",
        }}
      >
        <div
          style={{
            backgroundColor: "#EAE6FB",
            padding: "40px",
            borderRadius: "12px",
            display: "flex",
            gap: "40px",
            width: "90%",
            maxWidth: "800px",
            minHeight: "500px",
          }}
        >
          {/* Calendar Section */}
          <div
            style={{
              // backgroundColor: "#F8F8F8",
              // padding: "40px",
              borderRadius: "10px",
              flex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar />
          </div>

          {/* Events Section */}
          <div
            style={{
              backgroundColor: "#fff",
              padding: "15px",
              borderRadius: "12px",
              width: "420px",
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            {mockEvents.map((event, index) => (
              <Card
                key={index}
                sx={{
                  marginBottom: "12px",
                  padding: "12px",
                  borderRadius: "50px",
                  backgroundColor: "#F8FAFC",
                  boxShadow: "none",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="500"
                  sx={{ marginLeft: "20px" }}
                >
                  {event.date}
                </Typography>
                <Typography variant="body2" sx={{ marginLeft: "20px" }}>
                  Time: {event.time}
                </Typography>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <button
          style={{
            backgroundColor: "#ff0000",
            color: "white",
            fontSize: "17px",
            fontWeight: "400",
            height: "45px",
            borderRadius: "15px",
            border: "none",
            cursor: "pointer",
            width: "200px",
          }}
        >
          Cancel
        </button>

        <button
          style={{
            backgroundColor: "#15B392",
            color: "white",
            fontSize: "17px",
            fontWeight: "400",
            height: "45px",
            borderRadius: "15px",
            border: "none",
            cursor: "pointer",
            width: "200px",
          }}
        >
          Save to calendar
        </button>
      </div>
    </div>
  );
};

export default CollabGanerate;
