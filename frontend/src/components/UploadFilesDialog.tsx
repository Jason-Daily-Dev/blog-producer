import React from "react";

interface UploadFilesDialogProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadFilesDialog: React.FC<UploadFilesDialogProps> = ({ handleFileChange }) => {
  const style = {
    container: {
      marginBottom: "20px",
      textAlign: "center" as const,
    },
    label: {
      display: "block",
      fontSize: "1rem",
      fontWeight: "bold" as const,
      marginBottom: "8px",
    },
    input: {
      display: "inline-block",
      width: "50%",
      padding: "10px",
      fontSize: "1rem",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
  };

  return (
    <div style={style.container}>
      <label style={style.label}>Upload Images (optional)</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        style={style.input}
      />
    </div>
  );
};

export default UploadFilesDialog;