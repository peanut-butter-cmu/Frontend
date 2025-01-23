import React from "react";
import Divider from "@mui/material/Divider";
import { Button, Card, CardContent, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Collaboration: React.FC = () => {
  const groups = [
    { title: "Meeting Adv CPE", description: "Every Tuesday for 30 mins", next: "Tue, 05 Feb at 14:00" },
    { title: "Meeting Adv CPE", description: "Every Tuesday for 30 mins", next: "Tue, 05 Feb at 14:00" },
    { title: "Meeting Adv CPE", description: "Every Tuesday for 30 mins", next: "Tue, 05 Feb at 14:00" },
  ];

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
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#7b61ff",
            color: "#fff",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#6a53e0" },
            marginLeft: "-20px",
          }}
        >
          Add Group
        </Button>
      </div>

      <Divider sx={{ borderColor: "#e5e5e5", mb: 2 }} />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          marginTop: "30px",
          padding: "0 40px",
        }}
      >
        {groups.map((group, index) => (
         <Card
         key={index}
         sx={{
           width: "300px",
           borderRadius: "12px",
           boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
           position: "relative", // เพิ่ม position relative ที่ Card
         }}
       >
         <CardContent>
           <div
             style={{
               position: "absolute", // ทำให้ div อยู่ในตำแหน่งแบบ absolute
               top: "8px", // เว้นระยะจากด้านบน
               right: "8px", // เว้นระยะจากด้านขวา
               display: "flex", // ใช้ flex สำหรับจัด icon
               gap: "8px", // ระยะห่างระหว่าง icon
             }}
           >
             <IconButton
               onMouseEnter={(e) => (e.currentTarget.style.color = "#1D24CA")}
               onMouseLeave={(e) => (e.currentTarget.style.color = "#e5e5e5")}
               sx={{
                 color: "#e5e5e5",
                 transition: "color 0.3s",
               }}
             >
               <EditIcon fontSize="small" />
             </IconButton>
             <IconButton
               onMouseEnter={(e) => (e.currentTarget.style.color = "#ff0000")}
               onMouseLeave={(e) => (e.currentTarget.style.color = "#e5e5e5")}
               sx={{
                 color: "#e5e5e5",
                 transition: "color 0.3s",
               }}
             >
               <DeleteIcon fontSize="small" />
             </IconButton>
           </div>
       
           <div
             style={{
               display: "flex",
               justifyContent: "space-between",
             }}
           >
             <div
               style={{
                 display: "flex",
                 flexDirection: "column",
                 gap: "8px",
               }}
             >
               <div
                 style={{
                   width: "40px",
                   height: "40px",
                   backgroundColor: "#e0e0e0",
                   borderRadius: "50%",
                 }}
               ></div>
               <Typography
                 variant="subtitle1"
                 sx={{
                   fontWeight: "400",
                   fontSize: "18px",
                   textAlign: "center",
                   fontFamily: "Kanit",
                 }}
               >
                 {group.title}
               </Typography>
             </div>
           </div>
           <Typography
             variant="body2"
             color="textSecondary"
             sx={{ fontSize: "14px", fontWeight: "300", fontFamily: "Kanit" }}
           >
             {group.description}
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
                 color: "#6a53e0",
                 fontFamily: "Kanit",
               }}
             >
               Next: {group.next}
             </Typography>
           </div>
         </CardContent>
       </Card>
       
        ))}
      </div>
    </div>
  );
};

export default Collaboration;
