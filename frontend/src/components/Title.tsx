import React from "react";

const Title: React.FC = () => {
  const style = {
    container: {
      textAlign: "center" as const,
      marginBottom: "20px",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "bold" as const,
      color: "#333",
    },
    subtitle: {
      fontSize: "1.2rem",
      color: "#666",
    },
  };

  return (
    <div style={style.container}>
      <h1 style={style.title}>Blog Producer</h1>
      <p style={style.subtitle}>
        Generate high-quality blog content instantly with our AI-powered blog producer.
      </p>
    </div>
  );
};

export default Title;