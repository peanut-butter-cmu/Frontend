import React from "react";
import Event from "../pages/asset/homepage.png";
import VectorThree from "../pages/asset/Vector (3).png";
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

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          pt: { xs: 6, sm: 19 }, // เพิ่มค่า padding-top ให้มากขึ้นเพื่อเลื่อนเนื้อหาลงมา
          textAlign: "center",
          px: { xs: 2, sm: 3 },
          backgroundColor: "#f9f9f9",
          width: "100%",
          height: "100%",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: "38px",
            fontWeight: 500,
            fontFamily: "Kanit",
            mb: { xs: "5px", sm: "10px" },
            background:
              "linear-gradient(90deg, #F5AC53 0%, #D06B9E 16%, #5C3EE6 41%, #30A0FA 71%, #BC84FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Never Miss an Event, Stay in Sync, and Plan Smarter
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: "38px",
            fontWeight: 500,
            fontFamily: "Kanit",
            mb: { xs: "5px", sm: "10px" },
            background: "#000",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          with UniCalendar!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "16px",
            fontFamily: "Kanit",
            color: "#A7A8AA",
            mb: { xs: 2, sm: 4 },
            fontWeight: 300,
          }}
        >
          Automatically sync CMU events, get instant reminders, and find the
          perfect time for group meetings—all in one place!
        </Typography>
        <Button
          onClick={handleNextClick}
          sx={{
            color: "white",
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            borderRadius: "16px",
            fontFamily: "'kanit', sans-serif",
            fontWeight: 300,
            fontSize: { xs: "14px", sm: "16px" },
            marginTop: "15px",
            backgroundColor: "#5263F3",
            "&:hover": {
              backgroundColor: "#1B2AA3",
            },
          }}
        >
          Sign in CMU Account
        </Button>

        {/* กล่องพื้นหลัง */}
        <Box
          sx={{
            position: "absolute",
            width: 1240,
            height: 602,
            top: 432,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.5,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            background: "#F9F9F9",
            boxShadow: "0px 0px 32px 0px #5262F34D inset",
            zIndex: -10,
          }}
        />

        {/* Vector (3) ที่อยู่นอกกล่องพื้นหลังด้านบนซ้าย */}
        <Box
          component="img"
          src={VectorThree}
          alt="Vector Top Left"
          sx={{
            position: "absolute",
            top: 432 - 250, // ปรับ offset ตามต้องการ
            left: "calc(50% - 620px - 300px)", // 620 = 1240/2
            zIndex: -11,
          }}
        />

        {/* Vector (3) ที่อยู่นอกกล่องพื้นหลังด้านล่างขวา */}
        <Box
          component="img"
          src={VectorThree}
          alt="Vector Top Left"
          sx={{
            position: "absolute",
            top: 432 + 100,
            left: "calc(50% - 620px + 800px)", // 620 = 1240/2
            zIndex: -11,
          }}
        />

        {/* Container สำหรับรูป Event */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: { xs: "100%", sm: "800px", md: "1200px" },
            mx: "auto",
            maxHeight: { xs: "30vh", sm: "50vh" },
            overflow: "hidden",

            mt: "90px",
          }}
        >
          <Box
            component="img"
            src={Event}
            alt="Event"
            sx={{
              width: "90%",
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
