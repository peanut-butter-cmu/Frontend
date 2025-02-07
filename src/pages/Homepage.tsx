import React from "react";
import Event from "../pages/asset/1.png";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import logo from "../pages/asset/LogoIcon.svg";

const Header = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  padding: theme.spacing(1, 2),
  zIndex: 10,
  backgroundColor: "#ffffff",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  display: "flex",
  alignItems: "center",
}));

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate("/Login");
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",       
        height: "100vh",       
        overflow: "hidden",    
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <Header>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            maxWidth: { xs: "80px", sm: "100px" },
            width: "100%",
            height: "auto",
          }}
        />
      </Header>

      {/* Container สำหรับเนื้อหาหลัก */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          pt: { xs: 8, sm: 10 }, 
          px: { xs: 2, sm: 3 },
          backgroundColor: "#f9f9f9",
          width: "100%",
          height: "100%",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.3rem" },
            fontWeight: 400,
            mb: { xs: "5px", sm: "10px" },
          }}
        >
          Smart Uni Calendar
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "1rem", sm: "1.2rem" },
            color: "#A1A1A4",
            mb: { xs: 2, sm: 4 },
            fontWeight: 300,
          }}
        >
          Connect with your university system to seamlessly integrate.
          <br />
          class schedules, exam timetables, and important events
        </Typography>
        <Button
          onClick={handleNextClick}
          sx={{
            color: "white",
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            borderRadius: "5px",
            fontFamily: "'kanit', sans-serif",
            fontWeight: 300,
            fontSize: { xs: "14px", sm: "16px" },
            mb: { xs: 2, sm: 3 },
            backgroundColor: "#5263F3",
            "&:hover": {
              backgroundColor: "#1B2AA3",
            },
          }}
        >
          Sign in CMU Account
        </Button>

        {/* Container สำหรับรูป Event */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: { xs: "100%", sm: "800px", md: "1200px" },
            mx: "auto",
            // กำหนดความสูงสูงสุดให้รูปเพื่อไม่ให้เกินจอ
            maxHeight: { xs: "30vh", sm: "50vh" },
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={Event}
            alt="Event"
            sx={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
