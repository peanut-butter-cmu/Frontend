import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSMCalendar } from "smart-calendar-lib";
import Swal from "sweetalert2";

interface Person {
  status: string; // "accepted", "declined", "pending"
}

interface Meeting {
  id: number;
  title: string;
  description?: string;
  next?: string;
  members?: Person[];
  invites?: Person[];
}

const PendingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
  const smCalendar = useSMCalendar();
  const navigate = useNavigate();

  // รวมสมาชิกจาก members กับ invites
  const allPeople = [
    ...(meeting.members ?? []),
    ...(meeting.invites ?? []),
  ];
  const totalPeople = allPeople.length;

  // acceptedCount: จำนวนสมาชิกทั้งหมดใน members (ไม่ filter) + invites ที่มี status "accepted"
  const acceptedCount =
    (meeting.members?.length ?? 0) +
    (meeting.invites?.filter((person) => person.status === "accepted")
      .length ?? 0);

  const declinedCount = allPeople.filter(
    (person) => person.status === "declined"
  ).length;

  const pendingCount = allPeople.filter(
    (person) => person.status === "pending"
  ).length;

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        await smCalendar.deleteSharedEvent(meeting.id);
        Swal.fire("Deleted!", "Your event has been deleted.", "success");
        // Optionally refresh data or update state to remove the card from the UI
      } catch (error) {
        Swal.fire("Error", "Failed to delete event", "error");
      }
    }
  };


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
            onClick={() => navigate("/Collaboration-Edit", { state: meeting })}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            sx={{
              color: "#e5e5e5",
              transition: "color 0.3s",
              "&:hover": { color: "#ff0000" },
            }}
            onClick={handleDelete}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>

        {/* Card Header */}
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

        {/* Container แสดงไอคอนและตัวเลข */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  }}
>
  {/* กลุ่มแรก: ไอคอนคน ชิดซ้าย */}
  <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
    <GroupIcon fontSize="small" />
    <Typography
      variant="body2"
      sx={{
        fontSize: "14px",
        fontWeight: "300",
        fontFamily: "Kanit",
      }}
    >
      people {acceptedCount}/{totalPeople}
    </Typography>
  </Box>

  {/* กลุ่มที่สอง: ไอคอนอื่นๆ ชิดขวา */}
  <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
    {/* ไอคอนเช็ค */}
    <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <CheckCircleIcon color="success" fontSize="small" />
      <Typography
        variant="body2"
        sx={{
          fontSize: "14px",
          fontWeight: "300",
          fontFamily: "Kanit",
        }}
      >
        {acceptedCount}
      </Typography>
    </Box>
    {/* ไอคอนกากบาท */}
    <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <CancelIcon color="error" fontSize="small" />
      <Typography
        variant="body2"
        sx={{
          fontSize: "14px",
          fontWeight: "300",
          fontFamily: "Kanit",
        }}
      >
        {declinedCount}
      </Typography>
    </Box>
    {/* ไอคอนเครื่องหมายคำถาม */}
    <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <HelpIcon fontSize="small" sx={{ color: "#9E9E9E" }} />
      <Typography
        variant="body2"
        sx={{
          fontSize: "14px",
          fontWeight: "300",
          fontFamily: "Kanit",
        }}
      >
        {pendingCount}
      </Typography>
    </Box>
  </Box>
</Box>


        {/* ปุ่ม Action */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            marginTop: "10px",
            padding: "4px",
            backgroundColor: "#e3e0ff",
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "0px 2px 6px rgba(123, 97, 255, 0.3)",
            color: "#000",
            fontFamily: "Kanit",
            fontSize: "15px",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#6542f4",
              boxShadow: "0px 4px 10px rgba(123, 97, 255, 0.5)",
              color: "#fff",
            },
          }}
          onClick={() => navigate("/Collaboration-Gen")}
        >
          Click For Genarate
        </Button>
      </CardContent>
    </Card>
  );
};

export default PendingCard;
