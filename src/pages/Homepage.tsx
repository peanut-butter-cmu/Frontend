import React from "react";
import Event from "../pages/asset/1.png";
import { useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";
import { styled } from "@mui/styles";
import logo from "../pages/asset/LogoIcon.svg";

const Header = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "98vw",
  padding: "10px 20px",
  zIndex: 10,
  backgroundColor: "#ffffff",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  display: "flex",
  alignItems: "center",
});
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate("/Login");
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Header>
        <img
          src={logo}
          alt="Logo"
          style={{ maxWidth: "100px", height: "auto" }}
        />
      </Header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          height: "100vh",
        }}
      >
        <h1
          style={{
            fontSize: "2.3rem",
            fontWeight: "400",
            marginBottom: "-10px",
          }}
        >
          Smart Uni Calendar
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#A1A1A4",
            marginBottom: "40px",
            fontWeight: "300",
          }}
        >
          Connect with your university system to seamlessly integrate.
          <br />
          class schedules, exam timetables, and important events
        </p>
        <Button
          onClick={handleNextClick}
          sx={{
            color: "white",
            border: "none",
            padding: "7px 12px",
            borderRadius: "5px",
            fontFamily: "'kanit', sans-serif",
            fontWeight: "300",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "30px",
            backgroundColor: "#5263F3",
            "&:hover": {
              backgroundColor: "#1B2AA3",
            },
          }}
        >
          Sign in CMU Account
        </Button>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <img
            src={Event}
            alt="Event"
            style={{
              width: "1400px",
              height: "500px",
              marginRight: "16px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
