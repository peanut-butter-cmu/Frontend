import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/material/styles";

// Divider กำหนดสไตล์เอง
const StyledDivider = styled(Divider)({
  width: "90%",
  alignSelf: "center",
  borderWidth: "1px",
});

// Props ของคอมโพเนนต์
interface CollabAddGroupProps {
  open: boolean;
  onClose: () => void;
  groupedEvents?: string[];
  addNewEvent: (data: { groupName: string; participants: string[] }) => void;
}



const CollabAddGroup: React.FC<CollabAddGroupProps> = ({
  open,
  onClose,
  groupedEvents = [],
  addNewEvent,
}) => {
  const [groupName, setGroupName] = useState("");
  const [participant, setParticipant] = useState("");
  const [participants, setParticipants] = useState<string[]>(groupedEvents);
  const [showAddParticipant, setShowAddParticipant] = useState(false);

  // ฟังก์ชันเพิ่ม Participant
  const handleAddParticipant = () => {
    if (participant && !participants.includes(participant)) {
      setParticipants([...participants, participant]);
      setParticipant("");
      setShowAddParticipant(false);
    }
  };

  // ฟังก์ชันลบ Participant
  const handleRemoveParticipant = (email: string) => {
    setParticipants(participants.filter((p) => p !== email));
  };

  // ฟังก์ชัน Submit
  const handleSubmit = () => {
    addNewEvent({ groupName, participants });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 5,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Collaboration Group
        </Typography>
      </DialogTitle>
      <StyledDivider />
      <DialogContent>
        {/* Name Group */}
        <Typography variant="subtitle1" fontWeight="500" fontSize={17}>
          Name Group
        </Typography>
        <TextField
          placeholder="Name Group"
          fullWidth
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          variant="outlined"
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
              "& fieldset": { border: "none" },
            },
          }}
        />

        {/* Participant */}
        <Typography variant="subtitle1" fontWeight="500" fontSize={17}>
          Participant
        </Typography>
        <List>
          {participants.map((p, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    background:
                      "linear-gradient(45deg, #9DBDFF 30%, #CDC1FF 90%)",
                  }}
                >
                  {p.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={p} />
              <IconButton onClick={() => handleRemoveParticipant(p)}>
                <CancelIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>

        {!showAddParticipant ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#A8A8A8",
              cursor: "pointer",
              marginTop: "10px",
            }}
            onClick={() => setShowAddParticipant(true)}
          >
            <AddIcon />
            <span style={{ marginLeft: "5px" }}>Add New Group</span>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <TextField
              placeholder="New Participant"
              fullWidth
              value={participant}
              onChange={(e) => setParticipant(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "#f5f5f5",
                  "& fieldset": { border: "none" },
                },
              }}
            />
            <IconButton onClick={handleAddParticipant}>
              <AddIcon />
            </IconButton>
          </div>
        )}

        {/* Submit and Cancel */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#15B392",
              textTransform: "none",
              "&:hover": { backgroundColor: "#128A72" },
            }}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              backgroundColor: "#FF0000",
              textTransform: "none",
              "&:hover": { backgroundColor: "#CC0000" },
            }}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollabAddGroup;
