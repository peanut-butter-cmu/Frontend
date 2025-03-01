import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface Meeting {
  id: number;
  title: string;
  description?: string;
  next?: string;
  accepted?: number;
  declined?: number;
  pending?: number;
  totalPeople?: number;
}

const AwaitingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
  const statuses = [
    {
      label: "Accepted",
      count: meeting.accepted,
      color: "#000",
      bgColor: "#EAFAEA",
    },
    {
      label: "Declined",
      count: meeting.declined,
      color: "#000",
      bgColor: "#FFE2E2",
    },
    {
      label: "Pending",
      count: meeting.pending,
      color: "#000",
      bgColor: "#F5F5F5",
    },
  ];

  return (
    <Card
      sx={{
        width: "300px",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "400", fontSize: "18px", fontFamily: "Kanit" }}
          >
            {meeting.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "14px", color: "#666", fontFamily: "Kanit" }}
          >
            {meeting.pending}/{meeting.totalPeople} people
          </Typography>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            marginTop: "10px",
          }}
        >
          {statuses.map((status) => (
            <div
              key={status.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 12px",
                backgroundColor: status.bgColor,
                borderRadius: "8px",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 400,
                  fontSize: "15px",
                  color: status.color,
                  fontFamily: "Kanit",
                }}
              >
                {status.label}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 400,
                  fontSize: "15px",
                  color: status.color,
                  fontFamily: "Kanit",
                }}
              >
                {status.count}
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AwaitingCard;
