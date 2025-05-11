import React from "react";
import { usePrompt } from "../context/PromptContext";

interface GenerateBlogButtonProps {
  loading: boolean;
  handleSubmit: () => void;
}

const GenerateBlogButton: React.FC<GenerateBlogButtonProps> = ({ loading, handleSubmit }) => {
  const { contentPrompt } = usePrompt();

  const style = {
    container: {
      textAlign: "center" as const,
      marginTop: "20px",
    },
    button: {
      padding: "20px 40px",
      fontSize: "1.2rem",
      color: "#fff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "8px",
      cursor: contentPrompt.trim() && !loading ? "pointer" : "not-allowed",
      opacity: contentPrompt.trim() && !loading ? 1 : 0.6,
    },
    spinner: {
      width: "20px",
      height: "20px",
      border: "3px solid rgba(0, 0, 0, 0.1)",
      borderTopColor: "#007bff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };

  return (
    <div style={style.container}>
      <button
        onClick={handleSubmit}
        disabled={!contentPrompt.trim() || loading}
        style={style.button}
      >
        {loading ? <div style={style.spinner} /> : "Generate Blog"}
      </button>
    </div>
  );
};

export default GenerateBlogButton;