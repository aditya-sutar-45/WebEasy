import React, { useState, useEffect, useRef } from "react";
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
  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const instructionsRef = useRef(null);

  useEffect(() => {
    fetchCurrentLevel(setError, setSimplicity);
    fetchLevels(setError, setLevels);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (instructionsRef.current && !instructionsRef.current.contains(event.target)) {
        setShowInstructions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      
      // Level change successful, but no notification displayed
      await response.json();
    } catch (error) {
      console.error("Error setting level:", error);
      setError("Failed to update level on server, but using it locally.");
    } finally {
      setLoading(false);
    }
  };

  const showTemporaryNotification = (message) => {
    setNotification(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotification("");
    }, 3000);
  };

  const handleExplain = async () => {
    if (!inputText.trim()) {
      showTemporaryNotification("Please enter text to explain");
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

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  // Custom scrollbar styles
  const scrollbarStyle = `
    /* Scrollbar styles */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #b0b7ed;
      border-radius: 10px;
      transition: all 0.2s ease;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #8287dc;
    }
    
    /* For Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: #b0b7ed #f1f1f1;
    }
    
    /* For the text area */
    textarea::-webkit-scrollbar {
      width: 6px;
    }
    
    textarea::-webkit-scrollbar-thumb {
      background: #c7c7c7;
    }
    
    textarea::-webkit-scrollbar-thumb:hover {
      background: #a0a0a0;
    }
    
    /* Dropdown animation */
    .dropdown-menu {
      transform-origin: top;
      transition: transform 0.2s ease, opacity 0.2s ease;
      transform: scaleY(0);
      opacity: 0;
    }
    
    .dropdown-menu.open {
      transform: scaleY(1);
      opacity: 1;
    }
  `;

  return (
    <div className="bg-gray-50 font-sans h-full w-full overflow-hidden flex flex-col relative">
      {/* Custom scrollbar styles */}
      <style>{scrollbarStyle}</style>
      
      {/* Popup Notification */}
      {showNotification && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-100 border border-green-200 text-green-700 rounded-md shadow-md py-2 px-4 text-sm animate-fade-in-out">
            {notification}
          </div>
        </div>
      )}

      {/* Header - Compact for extension */}
      <header className="bg-indigo-600 text-white py-3 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">WebEasy</h1>
          <div className="flex items-center space-x-2">
            {/* Instructions dropdown */}
            <div className="relative" ref={instructionsRef}>
              <button
                onClick={toggleInstructions}
                className="bg-indigo-500 hover:bg-indigo-400 text-white text-xs py-1 px-2 rounded transition-colors flex items-center"
              >
                <span className="mr-1">?</span>
                <span>How to Use</span>
                <span className="ml-1">{showInstructions ? '▲' : '▼'}</span>
              </button>
              
              {/* Dropdown menu */}
              <div 
                className={`absolute right-0 top-full mt-1 w-64 bg-white rounded shadow-lg z-50 dropdown-menu ${showInstructions ? 'open' : ''}`}
              >
                <div className="p-3 text-sm">
                  <h3 className="font-medium text-indigo-700 mb-2 border-b border-indigo-100 pb-1">
                    How to Use WebEasy
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                    <li>Choose a <strong>Simplicity Level</strong> that matches your needs</li>
                    <li>Paste or type complex text in the box</li>
                    <li>Click <strong>Simplify Text</strong></li>
                    <li>Review your simplified explanation</li>
                    <li>Adjust level if needed and try again</li>
                  </ol>
                  <div className="mt-2 bg-indigo-50 p-2 rounded text-xs text-indigo-600">
                    <strong>Tip:</strong> Level 1 is most basic, Level 5 is most detailed
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-indigo-100">Text Simplifier</p>
          </div>
        </div>
      </header>

      {/* Main content with scroll */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 h-full">
        {/* Error message */}
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
                    className={`py-1 px-2 rounded text-xs font-medium transition-colors ${
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
              className={`py-1 px-3 rounded text-sm font-medium transition-colors ${
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

        {/* Output Section with Formatted Text */}
        {explanation && (
          <section className="bg-white rounded shadow-sm p-3">
            <h2 className="text-md font-medium text-indigo-600 mb-2">
              Simplified Explanation
            </h2>

            <div className="bg-gray-50 p-3 rounded border-l-2 border-indigo-400 text-gray-700 text-sm overflow-y-auto max-h-64">
              {explanation.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-2 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;