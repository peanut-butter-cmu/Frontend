import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import logo from "./asset/logo.png";
import CMUlogo from "./asset/CMU_Logo.png";
import VerifiedIcon from "@mui/icons-material/VerifiedUserRounded";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useSMCalendar } from "smart-calendar-lib";
import { UUID } from "crypto";

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

const LoginPage: React.FC = () => {
  const navigate = useNavigate(); // สร้าง navigate function
  const [showLogin, setShowLogin] = useState(false);
  const smCalendar = useSMCalendar();
  const auth = smCalendar.getAuth();

  if (!auth.isLoggedIn()) {
    let username, password;
    while (!(username = prompt('username?')))
      continue;
    while (!(password = prompt('password?')))
      continue;
    auth.login({
      username,
      password,
      mango_token: ''
    })
  } 
    

  const handleNextClick = () => {
    setShowLogin(true); // เปลี่ยนสถานะเพื่อแสดงกล่อง Login
  };
  const handleNextPlanner = () => {
    navigate("/Planner"); // เปลี่ยนไปหน้า /Planner
  };
  return (
    <Box>
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
        {!showLogin ? (
          // Access Token Section
          <Box
            sx={{
              width: "600px",
              padding: "20px",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: "600",
                color: "#5263F3",
                marginBottom: "10px",
                textAlign: "start",
              }}
            >
              Access Token
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your access token"
              variant="outlined"
              sx={{
                marginBottom: "15px",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f7f7f7",
                  borderRadius: "6px",
                },
              }}
            />
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "300",
                color: "#333333",
                marginBottom: "10px",
                borderBottom: "1px solid #dcdcdc",
              }}
            >
              How to get Access Token
            </Typography>
            <Box
              sx={{
                backgroundColor: "#eafbea",
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderRadius: "6px",
                color: "#2c7d2c",
                fontSize: "14px",
                fontWeight: "300",
                marginBottom: "20px",
              }}
            >
              <HelpOutlineIcon
                sx={{
                  marginRight: "8px",
                  color: "#2c7d2c",
                  fontSize: "18px",
                }}
              />
              Why we want your Access Token :
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                onClick={handleNextClick}
                sx={{
                  width: "20%",
                  backgroundColor: "#5263F3",
                  color: "#ffffff",
                  padding: "6px 0",
                  border: "none",
                  borderRadius: "6px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#1B2AA3",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        ) : (
          // Login Section

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* ป้าย Verify Token */}
            <Box
              sx={{
                width: "340px",
                backgroundColor: "#eafbea",
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "20px",
                color: "#2c7d2c",
              }}
            >
              <VerifiedIcon
                sx={{ color: "#2c7d2c", fontSize: "22px", marginRight: "5px" }}
              />
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Verify Token
              </Typography>
            </Box>

            {/* กล่อง Login */}
            <Box
              sx={{
                width: "340px",
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
                  fontSize: "25px",
                }}
              >
                Sign in to continue to
              </Typography>
              <Typography
                sx={{
                  fontWeight: "600",
                  color: "#5263F3",
                  marginBottom: "10px",
                  fontSize: "30px",
                }}
              >
                "Calendar Peanuts"
              </Typography>

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
                onClick={handleNextPlanner}
                variant="contained"
                fullWidth
                sx={{
                  marginTop: "20px",
                  backgroundColor: "#5263F3",
                  color: "#ffffff",
                  padding: "10px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "#1B2AA3",
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
        )}
      </Box>
    </Box>
  );
};

export default LoginPage;
