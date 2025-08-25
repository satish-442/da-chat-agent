import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { path: "/input", label: "Input" },
    { path: "/clean", label: "Clean" },
    { path: "/profile", label: "Profile" },
    { path: "/chat", label: "Chat" },
    { path: "/report", label: "My report" },
    { path: "/schedule", label: "My schedule" },
  ];

  return (
    <aside className="sidebar">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            isActive ? "menu-btn active" : "menu-btn"
          }
        >
          {item.label}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;