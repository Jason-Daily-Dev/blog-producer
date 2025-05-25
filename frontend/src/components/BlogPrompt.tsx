import React from "react";
import { usePrompt } from "../context/PromptContext";
import { Box, TextField, Typography } from "@mui/material";

const BlogPrompt: React.FC = () => {
  const { contentPrompt, setContentPrompt } = usePrompt();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          flex: 1,
          width: "80%", // Adjust box size to fit better within the layout
          maxWidth: "600px", // Limit maximum width for better responsiveness
          padding: "20px", // Add padding for better spacing
          backgroundColor: "#E0F7FA", // Light cyan background for a fresh look
          color: "#004D40", // Dark teal font color for better contrast
          border: "1px solid #004D40", // Add a border for a polished appearance
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow for a modern look
        }}
      >
        <Typography variant="h6" gutterBottom>
          Blog Content Instruction:
        </Typography>
        <TextField
          value={contentPrompt}
          onChange={(e) => setContentPrompt(e.target.value)}
          placeholder="Enter instructions for the blog content..."
          multiline
          rows={6}
          fullWidth
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default BlogPrompt;