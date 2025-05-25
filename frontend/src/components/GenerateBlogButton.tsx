import React from "react";
import { usePrompt } from "../context/PromptContext";
import { Box, Button, CircularProgress } from "@mui/material";

interface GenerateBlogButtonProps {
  loading: boolean;
  handleSubmit: () => void;
}

const GenerateBlogButton: React.FC<GenerateBlogButtonProps> = ({ loading, handleSubmit }) => {
  const { contentPrompt } = usePrompt();

  return (
    <Box sx={{ textAlign: "center", marginTop: "20px" }}>
      <Button
        onClick={handleSubmit}
        disabled={!contentPrompt.trim() || loading}
        variant="contained"
        color="primary"
        size="large"
        sx={{
          padding: "10px 20px",
          fontSize: "1rem",
          opacity: contentPrompt.trim() && !loading ? 1 : 0.6,
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Blog"}
      </Button>
    </Box>
  );
};

export default GenerateBlogButton;