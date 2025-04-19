// background.js
let latestResult = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.selectedText) {
    fetch("http://localhost:5000/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message.selectedText }),
    })
      .then((response) => response.json())
      .then((data) => {
        latestResult = {
          explanation: data.explanation,
          original_text: message.selectedText,
        };
        sendResponse(latestResult);
      })
      .catch((err) => {
        sendResponse({ error: err.message });
      });
    return true;
  }

  if (message.request === "getLatestExplanation") {
    sendResponse(latestResult || {});
  }
});
