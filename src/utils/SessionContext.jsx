import React, { createContext, useState, useEffect } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    // Attempt to retrieve the sessionId from localStorage on component mount
    let storedSessionId = localStorage.getItem("sessionId");

    if (!storedSessionId) {
      // If no sessionId exists, generate a new one
      storedSessionId = `session-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("sessionId", storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []); // The empty dependency array ensures this runs only once on mount

  // The values to be provided to all components in the session
  const value = {
    sessionId,
    setSessionId,
    chatMessages,
    setChatMessages,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};