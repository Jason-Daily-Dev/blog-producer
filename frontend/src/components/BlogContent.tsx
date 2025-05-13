import React, { useState } from "react";
import Markdown from "react-markdown";

interface BlogContentProps {
  blogContent: string;
  imageUrl?: string; // Optional prop for background image URL
  blogFormat: string; // Add blogFormat to determine how to render the content
}

const BlogContent: React.FC<BlogContentProps> = ({ blogContent, imageUrl, blogFormat }) => {
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.5); // State for background transparency
  const [textColor, setTextColor] = useState("#2c3d3f"); // State for text color

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
      position: "relative", // Enable layering
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      overflow: "hidden", // Ensure overlay stays within bounds
    },
    backgroundImage: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: backgroundOpacity, // Apply opacity to the image
      zIndex: 1, // Place it behind the content
    },
    content: {
      position: "relative" as const,
      zIndex: 2, // Place content above the background
      color: textColor, // Dynamically apply text color
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
        <div style={style.backgroundImage} /> {/* Background image layer */}
        <div style={style.content}>
          <h2>Generated Blog</h2>
          {blogFormat === "html" ? (
            <div dangerouslySetInnerHTML={{ __html: blogContent }} />
          ) : (
            <Markdown>{blogContent}</Markdown>
          )}
        </div>
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
            onChange={handleBackgroundOpacityChange}
          />
        </label>
        <label>
          Text Color:
          <input
            type="color"
            value={textColor}
            onChange={handleTextColorChange}
          />
        </label>
      </div>
    </div>
  );
};

export default BlogContent;