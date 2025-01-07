import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import logo from "./asset/logo.png";
import CMUlogo from "./asset/CMU_Logo.png";
import { useSMCalendar } from "smart-calendar-lib";
import AccessTokenPopup from "./components/popupToken";

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
  const [mango_token, setMangoToken] = useState("");

  const [error, setError] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleLogin = async () => {
    try {
      await auth.login({
        username,
        password,
        mango_token,
      });
      if (auth.isLoggedIn()) {
        navigate("/Planner"); // เปลี่ยนไปหน้า Planner อัตโนมัติ
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    }
  };

  const handleLogout = async () => {
    await auth.logout();
    alert("You have been logged out.");
    window.location.reload();
  };

  return (
    <Box>
      <Header>
        <img
          src={logo}
          alt="Logo"
          style={{ maxWidth: "120px", height: "auto" }}
        />

        <Button
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
        </Button>
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
              "Calendar Peanuts"
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
              error={error}
              helperText={error ? "Invalid login credentials" : ""}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              helperText={error ? "Invalid login credentials" : ""}
            />

            <TextField
              fullWidth
              label="Token"
              type="Token"
              variant="outlined"
              margin="normal"
              value={mango_token}
              onChange={(e) => setMangoToken(e.target.value)}
              error={error}
              helperText={error ? "Invalid login credentials" : ""}
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
                fontSize: "14px",
                color: "#5263F3",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => setIsPopupOpen(true)} // Open popup on click
            >
              What is token?
            </Typography>
            <Typography
              sx={{
                marginTop: "10px",
                fontSize: "12px",
                color: "#999999",
              }}
            >
              © 2019 CMU Account, ITSC Chiang Mai University.
            </Typography>
          </Box>
        </Box>
      </Box>
      <AccessTokenPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)} // Close popup handler
      />
    </Box>
  );
};

export default LoginPage;
