import React from "react";

interface BlogPromptProps {
  prompt: string;
  setPrompt: (value: string) => void;
}

const BlogPrompt: React.FC<BlogPromptProps> = ({ prompt, setPrompt }) => {
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
    textarea: {
      width: "50%",
      padding: "10px",
      fontSize: "1rem",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
  };

  return (
    <div style={style.container}>
      <label style={style.label}>Blog Topic</label>
      <textarea
        style={style.textarea}
        rows={5}
        placeholder="Enter your blog topic..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
    </div>
  );
};

export default BlogPrompt;