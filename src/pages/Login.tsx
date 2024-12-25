import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/styles";
import logo from "./asset/logo.png";
import Backdrop from "./asset/Background.png";
import CMUlogo from "./asset/CMU_Logo.png";

const Background = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: `url(${Backdrop})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  zIndex: -1,
});

const Header = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  padding: "10px 20px",
  zIndex: 10,
  backgroundColor: "#ffffff",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  display: "flex",
  alignItems: "center",
});

const LoginPage: React.FC = () => {
    const navigate = useNavigate(); // สร้าง navigate function

    const handleNextClick = () => {
      navigate("/Planner"); // เปลี่ยนไปหน้า /Planner
    };
  return (
    <Box>
      <Background />

      <Header>
        <img
          src={logo}
          alt="Logo"
          style={{ maxWidth: "120px", height: "auto" }}
        />
      </Header>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            width: "400px",
            padding: "30px",
            backgroundColor: "#ffffff",
            borderRadius: "15px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <img
            src={CMUlogo}
            alt="CMU Logo"
            style={{
              width: "150px",
              height: "150px",
              marginBottom: "10px",
              borderRadius: "50%",
              backgroundColor: "#f5f5f5",
            }}
          />

          <Typography
            sx={{
              fontWeight: "400",
              marginBottom: "0px",
              fontFamily: "'Roboto', sans-serif",
              fontSize: "25px",
            }}
          >
            Sign in to continue to
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "#027BFF",
              marginBottom: "10px",
              fontFamily: "'Roboto', sans-serif",
              fontSize: "30px",
            }}
          >
            "Registration System"
          </Typography>

          {/* Form */}
          <TextField
            fullWidth
            label="Email address"
            variant="outlined"
            margin="normal"
            InputProps={{
              endAdornment: <Typography>@cmu.ac.th</Typography>,
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
          />

          <Button
            variant="contained"
            onClick={handleNextClick}
            fullWidth
            sx={{
              marginTop: "20px",
              backgroundColor: "#027BFF",
              color: "#ffffff",
              padding: "10px",
              fontWeight: "bold",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#0265D1",
              },
            }}
          >
            Next
          </Button>

          <Typography
            sx={{
              marginTop: "30px",
              fontSize: "12px",
              color: "#999999",
            }}
          >
            © 2019 CMU Account, ITSC Chiang Mai University.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
