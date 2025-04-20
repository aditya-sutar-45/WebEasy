import React, { useState, useEffect } from "react";
import {
  explain,
  fetchCurrentLevel,
  fetchLevels,
  selectLevel,
} from "./api/api";
import "./css/App.css";

const App = () => {
  const [simplicity, setSimplicity] = useState(3);
  const [levels, setLevels] = useState({});
  const [inputText, setInputText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchCurrentLevel(setError, setSimplicity);
    fetchLevels(setError, setLevels);
  }, []);

  const handleLevelChange = async (level) => {
    setSimplicity(level);

    try {
      setLoading(true);
      setError("");
      const response = await selectLevel(level);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error setting level:", error);
      setError("Failed to update level on server, but using it locally.");
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!inputText.trim()) {
      setMessage("Please enter text to explain");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await explain(inputText, simplicity);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Error getting explanation:", error);
      setError(
        "Failed to get explanation from server. Check if the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const retryConnection = () => {
    fetchCurrentLevel();
    fetchLevels();
  };

  return (
    <div>
      <div>
        <h1>WebEasy</h1>

        {error && (
          <div>
            <span>{error}</span>
            <button onClick={retryConnection}>Retry Connection</button>
          </div>
        )}

        {message && <div>{message}</div>}

        <div>
          <h2>Select Simplicity Level</h2>
          {Object.keys(levels).length > 0 ? (
            <>
              <div>
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleLevelChange(level)}
                    disabled={loading}
                  >
                    {levels[level]?.name || `Level ${level}`}
                  </button>
                ))}
              </div>
              {levels[simplicity] && <p>{levels[simplicity].description}</p>}
            </>
          ) : (
            <div>{error || "Loading simplicity levels..."}</div>
          )}
        </div>

        <div>
          <h2>Enter Text to Simplify</h2>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text you want to simplify..."
            disabled={loading}
          />
          <button
            onClick={handleExplain}
            disabled={loading || Object.keys(levels).length === 0}
          >
            {loading
              ? "Processing..."
              : Object.keys(levels).length === 0
              ? "Levels Not Available"
              : "Simplify Text"}
          </button>
        </div>

        {explanation && (
          <div>
            <h2>Simplified Explanation</h2>
            <div>{explanation}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
