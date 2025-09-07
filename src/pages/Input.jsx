import React, { useState, useContext } from "react";
import { FaFileAlt, FaDatabase } from "react-icons/fa";
import { MdBarChart } from "react-icons/md";
import "./Input.css";
import Api from "../utils/Api"; // axios instance
import { SessionContext } from "../utils/SessionContext"; // ✅ Added import

const Input = () => {
  const [activeTab, setActiveTab] = useState("file");
  const { setSessionId } = useContext(SessionContext); // ✅ Corrected

  // 🔹 States
  const [formData, setFormData] = useState({
    server: "",
    user: "",
    database: "",
    table: "",
    db_pass: "",
    query: "",
    driver: "ODBC Driver 18 for SQL Server",
  });
  const [file, setFile] = useState(null);
  const [powerBI, setPowerBI] = useState({
    workspace_id: "",
    dataset_id: "",
    dax: "",
    table: "",
    access_token: ""
  });

  // 🔹 Handle DB form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle PowerBI form changes
  const handlePowerBIChange = (e) => {
    const { name, value } = e.target;
    setPowerBI((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle file upload selection
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  // 🔹 File Upload API
  const handleFileSubmit = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

  try {
    const formDataObj = new FormData();
    formDataObj.append("file", file, file.name);

    const response = await Api.post("/connect/file", formDataObj, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const sessionId = response.data.session_id; // 🔑 backend gives this
    setSessionId(sessionId);

    alert("File uploaded successfully! Session started.");
  } catch (error) {
    console.error("❌ File upload error:", error);
    alert("Upload failed.");
  }
  };

  // 🔹 DB Connection API
  const handleDBSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post("/connect/sql", formData);
      console.log("✅ Database connected:", response.data);
      alert("Database connected successfully!");
    } catch (error) {
      console.error("❌ DB connection error:", error);
      alert("Database connection failed.");
    }
  };

  // 🔹 PowerBI API
  const handlePowerBISubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post("/connect/powerbi", powerBI);
      console.log("✅ PowerBI connected:", response.data);
      alert("PowerBI connected successfully!");
    } catch (error) {
      console.error("❌ PowerBI connection error:", error);
      alert("PowerBI connection failed.");
    }
  };

  // 🔹 Render UI
  const renderContent = () => {
    switch (activeTab) {
      case "file":
        return (
          <div className="upload-box">
            <input
              type="file"
              id="fileUpload"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="fileUpload" className="upload-label">
              📂 Click to upload or drag & drop a file here
            </label>

            {file && (
              <>
                <p className="helper-text">Selected: {file.name}</p>
                <button className="btn-connect" onClick={handleFileSubmit}>
                  Upload File
                </button>
              </>
            )}
          </div>
        );

case "data":
  return (
    <div className="dataobject-card">
      <form className="data-form" onSubmit={handleDBSubmit}>
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
            <label>Database Name</label>
            <input
              type="text"
              name="database"
              placeholder="Enter"
              value={formData.database}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Table Name</label>
                        <input
              type="text"
              name="table"
              placeholder="Enter"
              value={formData.table}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="user"
              placeholder="Enter"
              value={formData.user}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="db_pass"
              placeholder="Enter"
              value={formData.db_pass}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Query</label>
            <input
              type="text"
              name="query"
              placeholder="Enter"
              value={formData.query}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="btn-connect" type="submit">
          Connect to Database
        </button>
      </form>
    </div>
  );


      case "powerbi":
  return (
    <div className="dataobject-card">
      <form className="data-form" onSubmit={handlePowerBISubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Workspace ID</label>
            <input
              type="text"
              name="workspace_id"
              placeholder="e.g., a1b2c3d4-e5f6..."
              value={powerBI.workspace_id}
              onChange={handlePowerBIChange}
            />
          </div>

          <div className="form-group">
            <label>Dataset ID</label>
            <input
              type="text"
              name="dataset_id"
              placeholder="e.g., x9y8z7a6-b5c4..."
              value={powerBI.dataset_id}
              onChange={handlePowerBIChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>DAX Query</label>
            <input
              type="text"
              name="dax"
              placeholder="Enter DAX query"
              value={powerBI.dax}
              onChange={handlePowerBIChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Table</label>
            <input
              type="text"
              name="table"
              placeholder="Enter Table name"
              value={powerBI.table}
              onChange={handlePowerBIChange}
            />
          </div>

          <div className="form-group">
            <label>Access Token</label>
            <input
              type="password"
              name="access_token"
              placeholder="Enter Access Token"
              value={powerBI.access_token}
              onChange={handlePowerBIChange}
            />
          </div>
        </div>

        <button className="btn-connect" type="submit">
          Connect to Power BI
        </button>
      </form>
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