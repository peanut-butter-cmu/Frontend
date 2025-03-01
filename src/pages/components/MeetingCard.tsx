import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

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

const MeetingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
  const navigate = useNavigate();

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
            position: "absolute",
            top: "8px",
            right: "8px",
            display: "flex",
            gap: "1px",
          }}
        >
          <IconButton
            sx={{
              color: "#e5e5e5",
              transition: "color 0.3s",
              "&:hover": { color: "#1D24CA" },
            }}
            onClick={() => navigate("/Collaboration-View")}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            sx={{
              color: "#e5e5e5",
              transition: "color 0.3s",
              "&:hover": { color: "#ff0000" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "25px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "400",
                fontSize: "18px",
                textAlign: "center",
                fontFamily: "Kanit",
              }}
            >
              {meeting.title}
            </Typography>
          </div>
        </div>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ fontSize: "14px", fontWeight: "300", fontFamily: "Kanit" }}
        >
          {meeting.description}
        </Typography>
        <div
          style={{
            marginTop: "10px",
            padding: "6px 12px",
            backgroundColor: "#e3e0ff",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              fontSize: "15px",
              color: "#000",
              fontFamily: "Kanit",
            }}
          >
            Next: {meeting.next}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
