import React from "react";

interface GenerateBlogButtonProps {
  loading: boolean;
  handleSubmit: () => void;
  disabled: boolean;
}

const GenerateBlogButton: React.FC<GenerateBlogButtonProps> = ({ loading, handleSubmit, disabled }) => {
  const style = {
    container: {
      textAlign: "center" as const,
      marginTop: "20px",
    },
    button: {
      padding: "10px 20px",
      fontSize: "1rem",
      color: "#fff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      opacity: disabled ? 0.6 : 1,
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
      <button onClick={handleSubmit} disabled={disabled} style={style.button}>
        {loading ? <div style={style.spinner} /> : 'Generate Blog'}
      </button>
    </div>
  );
};

export default GenerateBlogButton;