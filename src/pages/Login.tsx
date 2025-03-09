import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CMUlogo from "./asset/CMU_Logo.png";
import { useSMCalendar } from "smart-calendar-lib";
import logo from "../pages/asset/LogoIcon.svg";
import TermsPopup from "./components/termpopup";

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
  justifyContent: "space-between",
}));

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const smCalendar = useSMCalendar();
  const auth = smCalendar.getAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

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

    if (!acceptedTerms) {
      setTermsError(true);
      hasError = true;
    } else {
      setTermsError(false);
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleLogin();
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        boxSizing: "border-box",
        position: "relative",
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

      {/* Container สำหรับฟอร์มล็อกอิน */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "93%",
          height: "100%",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            width: { xs: "90%", sm: "340px" },
            p: { xs: "20px", sm: "30px" },
            backgroundColor: "#ffffff",
            borderRadius: "15px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <Box
            component="img"
            src={CMUlogo}
            alt="CMU Logo"
            sx={{
              width: { xs: "120px", sm: "150px" },
              height: { xs: "120px", sm: "150px" },
              mb: 2,
              borderRadius: "50%",
              backgroundColor: "#f5f5f5",
              mx: "auto",
            }}
          />

          <Typography
            sx={{
              fontWeight: 400,
              mb: 0,
              fontSize: { xs: "20px", sm: "25px" },
            }}
          >
            Sign in to continue to
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              color: "#5263F3",
              mb: 2,
              fontSize: { xs: "24px", sm: "30px" },
            }}
          >
            "Smart Uni Calendar"
          </Typography>

          {/* ห่อ TextField และปุ่มภายใน form */}
          <form onSubmit={handleSubmit}>
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

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{ color: termsError ? "red" : "inherit" }}
                >
                  I have read and agree to the{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTerms(true);
                    }}
                    sx={{
                      color: "#5263F3",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Terms and Conditions
                  </Link>
                </Typography>
              }
              sx={{
                mt: 1,
                "& .MuiFormControlLabel-label": { fontSize: "0.875rem" },
              }}
            />
            {termsError && (
              <Typography
                variant="caption"
                sx={{ color: "red", display: "block", mt: 0.5 }}
              >
                You must accept the Terms and Conditions to proceed.
              </Typography>
            )}

            <TermsPopup open={openTerms} onClose={() => setOpenTerms(false)} />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#5263F3",
                color: "#ffffff",
                py: 1,
                fontWeight: "bold",
                fontSize: { xs: "14px", sm: "16px" },
                "&:hover": {
                  backgroundColor: "#1B2AA3",
                },
              }}
            >
              Login
            </Button>
          </form>

          <Typography sx={{ mt: 2, fontSize: "12px", color: "#999999" }}>
            © 2024 CMU Account, PeanutsBetter Project.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;