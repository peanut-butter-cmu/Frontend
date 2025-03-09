import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

const WaitingApprovalPopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();

  const handleAccept = () => {
    onClose();
    navigate("/Collaboration");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "24px",
          backgroundColor: "#E5F5DA",
        },
      }}
    >
      <DialogContent
        sx={{
          backgroundColor: "#E5F5DA",
          textAlign: "center",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "24px 24px 0px 0px",
        }}
      >
        {/* ไอคอน */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#4B8057",
            borderRadius: "50%",
            width: 110,
            height: 110,
            mb: 2,
          }}
        >
          <AdminPanelSettingsIcon sx={{ fontSize: 60, color: "#fff" }} />
        </Box>

        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: 500,
            color: "#2F4D38",
            textAlign: "center",
          }}
        >
          Waiting for attendees' approval. <br />
          The meeting time will be generated once all <br />
          participants grant access to the calendar.
        </Typography>

        <Typography sx={{ fontSize: "14px", color: "#6A8F7A", mt: 2 }}>
          You will be notified once all participants have accepted.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "flex-end",
          backgroundColor: "#E5F5DA",
          padding: "16px",
          borderRadius: "0px 0px 24px 24px",
        }}
      >
        <Button
          onClick={handleAccept}
          sx={{
            color: "#2F4D38",
            fontSize: "16px",
            fontWeight: 500,
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          Accept <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WaitingApprovalPopup;