import React from "react";

interface BlogContentProps {
  blogContent: string;
}

const BlogContent: React.FC<BlogContentProps> = ({ blogContent }) => {
  const style = {
    container: {
      marginTop: "20px",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold" as const,
      marginBottom: "10px",
    },
    content: {
      fontSize: "1rem",
      lineHeight: "1.6",
      color: "#333",
    },
  };

  return (
    <div style={style.container}>
      <h2 style={style.title}>Generated Blog</h2>
      <div style={style.content}>{blogContent}</div>
    </div>
  );
};

export default BlogContent;