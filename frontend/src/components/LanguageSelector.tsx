import React from "react";
import { usePrompt } from "../context/PromptContext";
import { 
  Box, 
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";

const LANGUAGE_OPTIONS = [
  { value: "english", label: "ENGLISH" },
  { value: "simplified_chinese", label: "简体中文" },
  { value: "traditional_chinese", label: "繁體中文" },
];

const LanguageSelector: React.FC = () => {
  const { selectedLanguages, setSelectedLanguages } = usePrompt();

  const handleLanguageChange = (
    event: React.MouseEvent<HTMLElement>,
    newLanguages: string[]
  ) => {
    if (newLanguages.length > 0) {
      setSelectedLanguages(newLanguages);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "600px",
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          borderRadius: "10px",
          border: "1px solid #ccc",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(4px)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "#00796B", fontWeight: 600, marginBottom: "10px" }}
        >
          Language Selection:
        </Typography>

        <ToggleButtonGroup
          value={selectedLanguages}
          onChange={handleLanguageChange}
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "10px",
            "& .MuiToggleButton-root": {
              borderRadius: "20px",
              padding: "8px 20px",
              fontWeight: "bold",
              fontSize: "14px",
              border: "1px solid #00796B",
              color: "#00796B",
              backgroundColor: "transparent",
              '&.Mui-selected': {
                backgroundColor: "#00796B",
                color: "#FFF",
                '&:hover': {
                  backgroundColor: "#004D40",
                },
              },
              '&:hover': {
                backgroundColor: "#E0F2F1",
              },
            },
          }}
          aria-label="language"
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default LanguageSelector;