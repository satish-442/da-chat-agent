import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react"; // 👈 Import ChakraProvider
import Sidebar from "./components/Sidebar";
import Input from "./pages/Input";
import Clean from "./pages/Clean";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Report from "./pages/Report";
import Schedule from "./pages/Schedule";
import "./App.css";

const Layout = ({ children }) => (
  <div className="app">
    <header className="header">Welcome to DA Agent</header>
    <div className="container">
      <Sidebar />
      <main className="content">
        <div className="page-content">{children}</div>
        <div className="chat-box">Hi, How can I help you</div>
      </main>
    </div>
  </div>
);

const App = () => {
  return (
    <ChakraProvider> {/* 👈 Wrap your router here */}
      <Router>
        <Routes>
          {/* Redirect root to Input */}
          <Route path="/" element={<Navigate to="/input" replace />} />

          <Route path="/input" element={<Layout><Input /></Layout>} />
          <Route path="/clean" element={<Layout><Clean /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/chat" element={<Layout><Chat /></Layout>} />
          <Route path="/report" element={<Layout><Report /></Layout>} />
          <Route path="/schedule" element={<Layout><Schedule /></Layout>} />

          {/* 404 fallback */}
          <Route path="*" element={<Layout><h2>404 - Page Not Found</h2></Layout>} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;