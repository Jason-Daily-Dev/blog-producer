import React, { useEffect, useState } from "react";
import { usePrompt } from "../context/PromptContext";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

interface GenerateBlogButtonProps {
  loading: boolean;
  handleSubmit: () => void;
}

const GenerateBlogButton: React.FC<GenerateBlogButtonProps> = ({ loading, handleSubmit }) => {
  const { contentPrompt } = usePrompt();
  const [timer, setTimer] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (loading) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
      setTimer(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const handleClick = async () => {
    setError(null); // Reset error state before submission
    try {
      await handleSubmit();
    } catch (err) {
      setError("An error occurred while generating the blog. Please try again.");
    }
  };

  return (
    <Box sx={{ textAlign: "center", marginTop: "20px" }}>
      <Button
        onClick={handleClick}
        disabled={!contentPrompt.trim() || loading}
        variant="contained"
        color="primary"
        size="large"
        sx={{
          padding: "10px 20px",
          fontSize: "1rem",
          opacity: contentPrompt.trim() && !loading ? 1 : 0.6,
          backgroundColor: loading ? "#e0e0e0" : "primary.main",
          color: loading ? "#9e9e9e" : "white",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button
              disabled
              variant="contained"
              color="primary"
              size="large"
              sx={{
                padding: "10px 20px",
                fontSize: "1rem",
                backgroundColor: "#e0e0e0",
                color: "#9e9e9e",
                cursor: "not-allowed",
              }}
            >
              Generating...
            </Button>
            <Typography variant="h4" sx={{ color: '#ff5722', fontWeight: 'bold' }}>
              {timer}s
            </Typography>
          </Box>
        ) : (
          "Generate Blog"
        )}
      </Button>
      {error && (
        <Typography color="error" sx={{ marginTop: "10px" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default GenerateBlogButton;