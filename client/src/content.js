let groqBtn = null;
let sidebar = null;

function createButton(text, x, y) {
  groqBtn = document.createElement("button");
  groqBtn.innerText = "Ask WebEasy";
  groqBtn.style.position = "absolute";
  groqBtn.style.top = `${y + 10}px`;
  groqBtn.style.left = `${x + 10}px`;
  groqBtn.style.zIndex = 9999;
  groqBtn.style.padding = "6px 10px";
  groqBtn.style.fontSize = "14px";
  groqBtn.style.border = "none";
  groqBtn.style.borderRadius = "5px";
  groqBtn.style.background = "#111";
  groqBtn.style.color = "#fff";
  groqBtn.style.cursor = "pointer";
  groqBtn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  groqBtn.addEventListener("click", () => {
    console.log("Selected text:", text);
    chrome.runtime.sendMessage({ selectedText: text }, (response) => {
      console.log("Response from background:", response);
      if (response && !response.error) {
        showSidebar(response.original_text, response.explanation);
      }
    });
    window.getSelection().removeAllRanges();
    groqBtn.remove();
    groqBtn = null;
  });
  document.body.appendChild(groqBtn);
}

function showSidebar(originalText, explanation) {
  if (sidebar) {
    document.body.removeChild(sidebar);
  }

  sidebar = document.createElement("div");
  sidebar.style.position = "fixed";
  sidebar.style.top = "0";
  sidebar.style.right = "0";
  sidebar.style.width = "350px";
  sidebar.style.height = "100%";
  sidebar.style.background = "#fff";
  sidebar.style.boxShadow = "-2px 0 5px rgba(0,0,0,0.2)";
  sidebar.style.zIndex = 10000;
  sidebar.style.padding = "20px";
  sidebar.style.overflow = "auto";
  sidebar.style.fontFamily = "Arial, sans-serif";
  sidebar.style.boxSizing = "border-box";

  // Create sidebar content
  const header = document.createElement("h2");
  header.innerText = "Groq Explanation";
  header.style.margin = "0 0 15px 0";
  header.style.fontSize = "20px";
  header.style.color = "#333";

  const closeButton = document.createElement("button");
  closeButton.innerText = "×";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.border = "none";
  closeButton.style.background = "transparent";
  closeButton.style.fontSize = "24px";
  closeButton.style.cursor = "pointer";
  closeButton.style.color = "#333";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(sidebar);
    sidebar = null;
  });

  const originalTextTitle = document.createElement("h3");
  originalTextTitle.innerText = "Original Text:";
  originalTextTitle.style.fontSize = "16px";
  originalTextTitle.style.margin = "15px 0 5px 0";

  const originalTextContent = document.createElement("p");
  originalTextContent.innerText = originalText;
  originalTextContent.style.margin = "0 0 15px 0";
  originalTextContent.style.padding = "10px";
  originalTextContent.style.backgroundColor = "#f5f5f5";
  originalTextContent.style.borderRadius = "5px";
  originalTextContent.style.fontSize = "14px";

  const explanationTitle = document.createElement("h3");
  explanationTitle.innerText = "Explanation:";
  explanationTitle.style.fontSize = "16px";
  explanationTitle.style.margin = "15px 0 5px 0";

  const explanationContent = document.createElement("p");
  explanationContent.innerText = explanation;
  explanationContent.style.margin = "0";
  explanationContent.style.fontSize = "14px";
  explanationContent.style.lineHeight = "1.5";

  sidebar.appendChild(closeButton);
  sidebar.appendChild(header);
  sidebar.appendChild(originalTextTitle);
  sidebar.appendChild(originalTextContent);
  sidebar.appendChild(explanationTitle);
  sidebar.appendChild(explanationContent);

  document.body.appendChild(sidebar);
}

document.addEventListener("mouseup", (e) => {
  setTimeout(() => {
    // Always remove the old button if it exists
    if (groqBtn) {
      groqBtn.remove();
      groqBtn = null;
    }

    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      const x = e.pageX;
      const y = e.pageY;
      createButton(selectedText, x, y);
    }
  }, 10);
});
