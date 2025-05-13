import React, { useState } from "react";
import Markdown from "react-markdown";

interface BlogContentProps {
  blogContent: string;
  imageUrl?: string; // Optional prop for background image URL
  blogFormat: string; // Add blogFormat to determine how to render the content
}

const BlogContent: React.FC<BlogContentProps> = ({ blogContent, imageUrl, blogFormat }) => {
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.5); // State for background transparency
  const [textColor, setTextColor] = useState("#fff"); // State for text color

  const handleBackgroundOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      console.log("Background opacity changed to:", value);
      setBackgroundOpacity(value);
    }
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Text color changed to:", e.target.value);
    setTextColor(e.target.value);
  };

  const style = {
    container: {
      marginTop: "20px",
      padding: "20px",
      backgroundColor: imageUrl ? `rgba(0, 0, 0, ${backgroundOpacity})` : "#fff", // Use RGBA for adjustable transparency
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      backgroundImage: imageUrl ? `url(${imageUrl})` : undefined, // Set background image if provided
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: textColor, // Use dynamic text color
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold" as const,
      marginBottom: "10px",
    },
    content: {
      fontSize: "1rem",
      lineHeight: "1.6",
    },
    controls: {
      marginTop: "10px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "10px",
    },
  };

  return (
    <div>
      <div style={style.container}>
        <h2 style={style.title}>Generated Blog</h2>
        {blogFormat === "html" ? (
          <div dangerouslySetInnerHTML={{ __html: blogContent }} />
        ) : (
          <Markdown>{blogContent}</Markdown>
        )}
      </div>
      <div style={style.controls}>
        <label>
          Background Transparency:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={backgroundOpacity}
            onChange={handleBackgroundOpacityChange} // Use the new handler
          />
        </label>
        <label>
          Text Color:
          <input
            type="color"
            value={textColor}
            onChange={handleTextColorChange} // Use the new handler
          />
        </label>
      </div>
    </div>
  );
};

export default BlogContent;