import React from "react";
import { usePrompt } from "../context/PromptContext";
import { 
  Box, 
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";

const LANGUAGE_OPTIONS = [
  { value: "english", label: "English" },
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
          width: "80%",
          maxWidth: "600px",
          padding: "15px",
          backgroundColor: "#FFF3E0",
          color: "#E65100",
          border: "1px solid #E65100",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Language Selection:
        </Typography>
        
        <ToggleButtonGroup
          value={selectedLanguages}
          onChange={handleLanguageChange}
          aria-label="language selection"
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px',
            '& .MuiToggleButton-root': {
              border: '2px solid #E65100',
              borderRadius: '20px',
              padding: '8px 16px',
              color: '#E65100',
              backgroundColor: 'transparent',
              '&.Mui-selected': {
                backgroundColor: '#E65100',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#D84315',
                },
              },
              '&:hover': {
                backgroundColor: '#FFF3E0',
              },
            }
          }}
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