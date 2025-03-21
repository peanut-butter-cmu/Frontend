import React from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import photo1 from "../asset/Token1.png";
import photo2 from "../asset/Token2.png";
import photo3 from "../asset/Token3.png";
import photo4 from "../asset/Token4.png";

interface AccessTokenPopupProps {
  open: boolean;
  onClose: () => void;
}

const AccessTokenPopup: React.FC<AccessTokenPopupProps> = ({
  open,
  onClose,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="access-token-popup"
      aria-describedby="instructions-to-generate-access-token"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "700px",
          overflowY: "auto",
          backgroundColor: "white",
          border: "none",
          borderRadius: "10px",
          boxShadow: 24,
          padding: "40px",
        }}
      >
        <Typography
          id="access-token-popup"
          variant="h6"
          sx={{
            marginBottom: "15px",
            fontWeight: "bold",
            textAlign: "center",
            color: "#5263F3",
          }}
        >
          Instructions to Generate Access Token
        </Typography>
        <Typography
          id="instructions-to-generate-access-token"
          variant="body1"
          sx={{ marginBottom: "10px" }}
        >
          1. Log in to your Mango account.{" "}
          <a
            href="https://mango-cmu.instructure.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#5263F3", textDecoration: "none" }}
          >
            mango-cmu.instructure.com
          </a>
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          2. Click on the <strong>Account</strong> tab in the menu.
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          3. Select <strong>Settings</strong>.
        </Typography>
        <Box sx={{ textAlign: "center", marginBottom: "10px" }}>
          <img
            src={photo1}
            alt="Example Screenshot"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </Box>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          4. Scroll down to the section <strong>Approved Integrations</strong>{" "}
          and click the <strong>New Access Token</strong> button.
        </Typography>
        <Box sx={{ textAlign: "center", marginBottom: "10px" }}>
          <img
            src={photo2}
            alt="Example Screenshot"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </Box>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          5. Enter <strong>"Use to Calendar"</strong> in the purpose field.
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          6. Click the <strong>Generate Token</strong> button.
        </Typography>
        <Box sx={{ textAlign: "center", marginBottom: "10px" }}>
          <img
            src={photo3}
            alt="Example Screenshot"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </Box>
        <Typography variant="body1" sx={{ marginBottom: "20px" }}>
          7. Copy the generated token and paste it into the provided field.
        </Typography>
        <Box sx={{ textAlign: "center", marginBottom: "10px" }}>
          <img
            src={photo4}
            alt="Example Screenshot"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              backgroundColor: "#5263F3",
              color: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#1B2AA3",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AccessTokenPopup;