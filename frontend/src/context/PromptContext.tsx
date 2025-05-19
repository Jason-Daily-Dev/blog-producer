import React, { createContext, useContext, useState } from "react";

interface PromptContextProps {
  contentPrompt: string;
  setContentPrompt: (value: string) => void;
  imagePrompt: string;
  setImagePrompt: (value: string) => void;
}

const PromptContext = createContext<PromptContextProps | undefined>(undefined);

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contentPrompt, setContentPrompt] = useState("");

  return (
    <PromptContext.Provider value={{ contentPrompt, setContentPrompt }}>
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompt = (): PromptContextProps => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error("usePrompt must be used within a PromptProvider");
  }
  return context;
};