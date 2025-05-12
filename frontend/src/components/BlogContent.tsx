import React from "react";
import Markdown from "react-markdown";

interface BlogContentProps {
  blogContent: string;
  imageUrl?: string; // Optional prop for background image URL
}

const BlogContent: React.FC<BlogContentProps> = ({ blogContent, imageUrl }) => {
  const style = {
    container: {
      marginTop: "20px",
      padding: "20px",
      backgroundColor: imageUrl ? "rgba(0, 0, 0, 0.5)" : "#fff", // Add transparency for background
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      backgroundImage: imageUrl ? `url(${imageUrl})` : undefined, // Set background image if provided
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: imageUrl ? "#fff" : "#333", // Adjust text color for better contrast
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
  };

  return (
    <div style={style.container}>
      <h2 style={style.title}>Generated Blog</h2>
      <Markdown>{blogContent}</Markdown>
    </div>
  );
};

export default BlogContent;