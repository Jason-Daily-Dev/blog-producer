import React from "react";
import { Box, Typography } from "@mui/material";

const Title: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          color: "white",
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
        }}
      >
        Blog Producer
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          color: "white",
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)", // ✨ same shadow as title
          maxWidth: "700px", // keep it readable
          margin: "0 auto",  // center the block
          paddingX: "16px",
        }}
      >
        Generate high-quality blog content instantly with our AI-powered blog producer.
      </Typography>
    </Box>
  );
};

export default Title;