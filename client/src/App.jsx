import React, { useState, useEffect } from "react";
import {
  explain,
  fetchCurrentLevel,
  fetchLevels,
  selectLevel,
} from "./api/api";

const App = () => {
  const [simplicity, setSimplicity] = useState(3);
  const [levels, setLevels] = useState({});
  const [inputText, setInputText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
    <div className="bg-gray-50 font-sans h-full w-full overflow-hidden flex flex-col">
      {/* Header - Compact for extension */}
      <header className="bg-indigo-600 text-white py-3 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">WebEasy</h1>
          <p className="text-sm text-indigo-100">Text Simplifier</p>
        </div>
      </header>

      {/* Main content with scroll */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 h-full">
        {/* Error and status messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-2 text-sm flex justify-between items-center">
            <span className="text-red-600 text-xs">{error}</span>
            <button
              onClick={retryConnection}
              className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded p-2 text-sm text-center">
            {message}
          </div>
        )}

        {/* Level Selection */}
        <section className="bg-white rounded shadow-sm p-3">
          <h2 className="text-md font-medium text-indigo-600 mb-2">
            Simplicity Level
          </h2>

          {Object.keys(levels).length > 0 ? (
            <>
              <div className="grid grid-cols-5 gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleLevelChange(level)}
                    disabled={loading}
                    className={`py-1 px-1 rounded text-sm font-medium transition-colors ${
                      simplicity === level
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {levels[level]?.name || `L${level}`}
                  </button>
                ))}
              </div>

              {levels[simplicity] && (
                <p className="bg-gray-50 p-2 rounded text-gray-600 text-xs border-l-2 border-indigo-400">
                  {levels[simplicity].description}
                </p>
              )}
            </>
          ) : (
            <div className="text-gray-500 italic text-xs text-center py-2">
              {error || "Loading levels..."}
            </div>
          )}
        </section>

        {/* Input Section */}
        <section className="bg-white rounded shadow-sm p-3">
          <h2 className="text-md font-medium text-indigo-600 mb-2">
            Enter Text
          </h2>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text you want to simplify..."
            disabled={loading}
            className="w-full h-32 p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 mb-2 resize-none"
          />

          <div className="flex justify-end">
            <button
              onClick={handleExplain}
              disabled={loading || Object.keys(levels).length === 0}
              className={`py-2 px-4 rounded text-sm font-medium transition-colors ${
                loading || Object.keys(levels).length === 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {loading
                ? "Processing..."
                : Object.keys(levels).length === 0
                ? "Not Available"
                : "Simplify Text"}
            </button>
          </div>
        </section>

        {/* Output Section */}
        {explanation && (
          <section className="bg-white rounded shadow-sm p-3">
            <h2 className="text-md font-medium text-indigo-600 mb-2">
              Simplified Explanation
            </h2>

            <div className="bg-gray-50 p-3 rounded border-l-2 border-indigo-400 text-gray-700 text-sm overflow-y-auto max-h-64">
              {explanation}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
