import React, { useState, useEffect } from "react";

const App = () => {
  const [selectedText, setSelectedText] = useState("");
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    chrome.runtime.sendMessage(
      { request: "getLatestExplanation" },
      (response) => {
        if (response && response.explanation) {
          setExplanation(response.explanation);
          setSelectedText(response.original_text);
        }
      }
    );
  }, []);

  return (
    <div>
      <h1>Groq Explanation</h1>
      <p>Original Text: {selectedText}</p>
      <p>Explanation: {explanation}</p>
    </div>
  );
};

export default App;
