"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";
import { fetchGoogleSheetData, getGoogleOAuthURL, getStoredGoogleToken } from "@/app/lib/services/auth";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, { withCredentials: true });

socket.on("connect", () => console.log("✅ Connected to WebSocket Server:", socket.id));
socket.on("disconnect", () => console.log("❌ Disconnected from WebSocket Server"));

const Dashboard = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState(null);
  
  // Create Table Modal state
  const [showCreateTableModal, setShowCreateTableModal] = useState(false);
  const [numColumns, setNumColumns] = useState(1);
  const [columnDetails, setColumnDetails] = useState([{ name: "", type: "Text" }]);

  useEffect(() => {
    const checkAuthentication = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("access_token");

      if (accessToken) {
        localStorage.setItem("googleAccessToken", accessToken);
        setUserAuthenticated(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        try {
          const storedToken = await getStoredGoogleToken();
          if (storedToken) {
            localStorage.setItem("googleAccessToken", storedToken);
            setUserAuthenticated(true);
          } else {
            const localToken = localStorage.getItem("googleAccessToken");
            if (localToken) setUserAuthenticated(true);
          }
        } catch (error) {
          console.error("Authentication check failed:", error);
        }
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    if (!userAuthenticated || !spreadsheetId) return;

    // 🔄 Polling Interval: Fetch data every 10 seconds
    const pollingInterval = setInterval(() => {
      console.log("📡 Polling Google Sheet...");
      fetchDataFromGoogleSheet(false); // Avoid triggering WebSocket emit
    }, 10000);

    return () => clearInterval(pollingInterval);
  }, [userAuthenticated, spreadsheetId]);

  useEffect(() => {
    console.log("🟢 Setting up WebSocket listener...");

    socket.on("updateGoogleSheet", (updatedData) => {
      console.log("🔄 Received WebSocket update:", updatedData);

      if (!updatedData || updatedData.length === 0) {
        console.warn("⚠️ Empty or invalid data received from WebSocket.");
        return;
      }

      const newColumns = Object.keys(updatedData[0]).map((key) => ({ name: key, type: "Text" }));
      console.log("📊 New columns:", newColumns);

      setColumns(newColumns);
      setRows((prevRows) => [...updatedData]); // Ensure re-render
    });

    return () => {
      console.log("🔴 Removing WebSocket listener...");
      socket.off("updateGoogleSheet");
    };
  }, []);

  const handleGoogleAuth = async () => {
    try {
      const authUrl = await getGoogleOAuthURL();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error fetching Google OAuth URL:", error);
    }
  };

  const extractSpreadsheetId = (sheetUrl) => {
    try {
      const url = new URL(sheetUrl);
      const parts = url.pathname.split("/d/");
      return parts[1]?.split("/")[0] || null;
    } catch (error) {
      console.error("Invalid Google Sheet URL");
      return null;
    }
  };

  const fetchDataFromGoogleSheet = async (emitWebSocket = true) => {
    if (!userAuthenticated) {
      handleGoogleAuth();
      return;
    }

    if (!googleSheetUrl && !spreadsheetId) {
      console.error("Google Sheet URL is missing");
      return;
    }

    const id = spreadsheetId || extractSpreadsheetId(googleSheetUrl);
    if (!id) {
      console.error("Invalid Google Sheet URL");
      return;
    }
    setSpreadsheetId(id);

    try {
      const token = localStorage.getItem("googleAccessToken");
      if (!token) {
        console.error("No access token found.");
        return;
      }

      const range = encodeURIComponent("Sheet1!A1:Z100");
      const data = await fetchGoogleSheetData(id, range, token);

      if (data.length > 0) {
        setColumns(Object.keys(data[0]).map((key) => ({ name: key, type: "Text" })));
        setRows(data);

        // Emit WebSocket event to notify other clients (only if called manually)
        if (emitWebSocket) {
          socket.emit("googleSheetUpdated", data);
        }
      }
    } catch (error) {
      console.error("Error fetching Google Sheets data:", error);
    }
  };

  // Create Table Modal logic
  const handleColumnChange = (index, field, value) => {
    // Update only the specific column being changed, while keeping the others intact
    const updatedColumns = [...columnDetails];
    updatedColumns[index] = {
      ...updatedColumns[index],  // keep previous state for that column
      [field]: value,            // update only the specific field (name or type)
    };
    setColumnDetails(updatedColumns);  // update the state with new column details
  };
  useEffect(() => {
    console.log("Column Details: ", columnDetails);
  }, [columnDetails]);
  
  const handleDoneClick = () => {
    const newColumns = columnDetails.map(col => ({
      name: col.name,
      type: col.type
    }));
  
    // Set new columns and reset rows
    setColumns(newColumns);  // Update columns state here
    setRows([]); // Optionally clear the rows if needed
  
    // Close the modal
    setShowCreateTableModal(false);
  };
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      {!userAuthenticated ? (
        <button
          onClick={handleGoogleAuth}
          className="mb-6 bg-blue-600 text-white px-6 py-2 rounded"
        >
          Authenticate with Google
        </button>
      ) : (
        <>
          <p className="text-green-600 mb-4">✅ You are authenticated!</p>

          <input
            type="text"
            placeholder="Enter Google Sheet URL"
            value={googleSheetUrl}
            onChange={(e) => setGoogleSheetUrl(e.target.value)}
            className="p-3 border rounded w-full mb-4"
          />

          <div className="flex space-x-4">
            <button
              onClick={() => fetchDataFromGoogleSheet(true)}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              Load Google Sheet Data
            </button>

            <button
              onClick={() => setShowCreateTableModal(true)}
              className="bg-yellow-600 text-white px-6 py-2 rounded"
            >
              Create Table
            </button>
          </div>

          {showCreateTableModal && (
            <div className="modal bg-gray-700 bg-opacity-50 fixed inset-0 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Create Table</h2>
                <div>
                  <label className="block">Number of Columns:</label>
                  <input
                    type="number"
                    value={numColumns}
                    onChange={(e) => {
                      const value = Math.max(1, parseInt(e.target.value));
                      setNumColumns(value);
                      setColumnDetails(Array(value).fill({ name: "", type: "Text" }));
                    }}
                    className="p-2 border mb-4 w-full"
                  />
                </div>

                {Array.from({ length: numColumns }).map((_, index) => (
                  <div key={index} className="mb-4">
                    <label className="block">Column {index + 1} Name:</label>
                    <input
                      type="text"
                      value={columnDetails[index]?.name}
                      onChange={(e) => handleColumnChange(index, "name", e.target.value)}
                      className="p-2 border mb-2 w-full"
                    />
                    <label className="block">Column {index + 1} Type:</label>
                    <select
                      value={columnDetails[index]?.type}
                      onChange={(e) => handleColumnChange(index, "type", e.target.value)}
                      className="p-2 border w-full"
                    >
                      <option value="Text">Text</option>
                      <option value="Date">Date</option>
                    </select>
                  </div>
                ))}

                <button
                  onClick={handleDoneClick}
                  className="bg-green-600 text-white px-6 py-2 rounded mt-4"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {rows.length > 0 && (
            <table className="w-full border-collapse border border-gray-300 mt-6">
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index} className="border p-2">{col.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border">
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="border p-2">{row[col.name] || ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
