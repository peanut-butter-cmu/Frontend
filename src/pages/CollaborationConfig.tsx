import React, { useState } from "react";
import Divider from "@mui/material/Divider";
import { Button } from "@mui/material";

const CollaborationConfig: React.FC = () => {

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#f9f9fb",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          marginTop: "10px",
          marginBottom: "5px",
          display: "flex",
          alignItems: "center",
          padding: "16px 270px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "34px",
            fontWeight: 300,
          }}
        >
          Setting
        </h2>
      </div>

      <Divider sx={{ borderColor: "#e5e5e5", mb: 2 }} />
      
    </div>
  );
};

export default CollaborationConfig;
