import React, { useState } from "react";
import { FaFileAlt, FaDatabase } from "react-icons/fa";
import { MdBarChart } from "react-icons/md";
import "./Input.css";

const Input = () => {
  const [activeTab, setActiveTab] = useState("file");
  const [formData, setFormData] = useState({
    server: "",
    username: "",
    database: "",
    table: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "file":
        return (
          <div className="upload-box">
            <input type="file" id="fileUpload" style={{ display: "none" }} />
            <label htmlFor="fileUpload" className="upload-label">
              📂 Click to upload or drag & drop a file here
            </label>
          </div>
        );

      case "data":
        return (
                <div className="dataobject-card">
          <form className="data-form">
            <div className="form-row">
              <div className="form-group">
                <label>Server</label>
                <input
                  type="text"
                  name="server"
                  placeholder="Enter"
                  value={formData.server}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <select
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="admin">Admin</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Database Name</label>
                <select
                  name="database"
                  value={formData.database}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="db1">Database 1</option>
                  <option value="db2">Database 2</option>
                </select>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Table Name</label>
                <select
                  name="table"
                  value={formData.table}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="table1">Table 1</option>
                  <option value="table2">Table 2</option>
                </select>
              </div>
            </div>
          </form>
          </div>
        );

case "powerbi":
  return (
    <div className="powerbi-card">
      <h2>Connect to Power BI Dataset</h2>
      <div className="form-group">
        <label>Workspace ID</label>
        <input
          type="text"
          name="workspace"
          placeholder="e.g., a1b2c3d4-e5f6..."
        />
      </div>
      <div className="form-group">
        <label>Dataset ID</label>
        <input
          type="text"
          name="dataset"
          placeholder="e.g., x9y8z7a6-b5c4..."
        />
      </div>
      <button className="btn-connect">Connect to Power BI</button>
      <p className="helper-text">Enter details and click "Connect"</p>
    </div>
  );


      default:
        return null;
    }
  };

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "file" ? "active" : ""}`}
          onClick={() => setActiveTab("file")}
        >
          <FaFileAlt className="icon" />
          File Formats
        </button>
        <button
          className={`tab-btn ${activeTab === "data" ? "active" : ""}`}
          onClick={() => setActiveTab("data")}
        >
          <FaDatabase className="icon" />
          Data Object
        </button>
        <button
          className={`tab-btn ${activeTab === "powerbi" ? "active" : ""}`}
          onClick={() => setActiveTab("powerbi")}
        >
          <MdBarChart className="icon" />
          PowerBI Dataset
        </button>
      </div>

      <div className="tab-content">{renderContent()}</div>
    </div>
  );
};

export default Input;
