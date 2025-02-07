import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import CMUlogo from "./asset/CMU_Logo.png";
import { useSMCalendar } from "smart-calendar-lib";
import AccessTokenPopup from "./components/popupToken";
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
  justifyContent: "space-between",
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const smCalendar = useSMCalendar();
  const auth = smCalendar.getAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleLogin = async () => {
    let hasError = false;
    if (!username.trim()) {
      setUsernameError("Email address is required");
      hasError = true;
    } else {
      setUsernameError("");
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    } else {
      setPasswordError("");
    }
    if (hasError) return;

    try {
      await auth.login({ username, password });
      if (auth.isLoggedIn()) {
        navigate("/Planner");
      } else {
        setUsernameError("Invalid login credentials");
        setPasswordError("Invalid login credentials");
      }
    } catch (err) {
      setUsernameError("Invalid login credentials");
      setPasswordError("Invalid login credentials");
    }
  };

  return (
    <Box>
      <Header>
        <img
          src={logo}
          alt="Logo"
          style={{ maxWidth: "100px", height: "auto" }}
        />

        {/* ปุ่ม logout ถูก comment ไว้ */}
        {/* <Button
          onClick={handleLogout}
          variant="outlined"
          sx={{
            color: "#1B2AA3",
            borderColor: "#1B2AA3",
            "&:hover": {
              backgroundColor: "#1B2AA3",
              color: "#ffffff",
            },
          }}
        >
          Logout
        </Button> */}
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
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
              "Smart Uni Calendar"
            </Typography>

            <TextField
              fullWidth
              label="Email address"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                endAdornment: <Typography>@cmu.ac.th</Typography>,
              }}
              error={!!usernameError}
              helperText={usernameError}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
            />

            <Button
              onClick={handleLogin}
              variant="contained"
              fullWidth
              sx={{
                marginTop: "10px",
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
              Login
            </Button>
            <Typography
              sx={{
                marginTop: "10px",
                fontSize: "12px",
                color: "#999999",
              }}
            >
              © 2024 CMU Account, PeanutsBetter Project.
            </Typography>
          </Box>
        </Box>
      </Box>
      <AccessTokenPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </Box>
  );
};

export default LoginPage;
