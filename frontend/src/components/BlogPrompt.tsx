import React from "react";
import { usePrompt } from "../context/PromptContext";

const BlogPrompt: React.FC = () => {
  const { contentPrompt, setContentPrompt } = usePrompt();

  return (
    <div style={{width: "100%",  display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        <div style={{ flex: 1, backgroundColor: "#ADD8E6", padding: "20px", borderRadius: "8px" }}>
          <label>
            Blog Content Instruction:
            <textarea
              value={contentPrompt}
              onChange={(e) => setContentPrompt(e.target.value)}
              placeholder="Enter instructions for the blog content..."
              style={{ width: "100%", height: "160px", borderRadius: "8px", border: "1px solid #007BFF" }}
            />
          </label>
        </div>
    </div>
  );
};

export default BlogPrompt;