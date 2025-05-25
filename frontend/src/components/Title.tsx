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
          color: "white", // Adjust font color for better contrast
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)", // Add text shadow for readability
        }}
      >
        Blog Producer
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Generate high-quality blog content instantly with our AI-powered blog
        producer.
      </Typography>
    </Box>
  );
};

export default Title;