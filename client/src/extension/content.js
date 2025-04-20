const SIDEBAR_ID = "webeasy-sidebar";
const BTN_CLASS = "webeasy-btn";

let groqBtn = null;
let sidebarInjected = false;

function injectStyles() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("sidebar.css");
  document.head.appendChild(link);
}

function injectSidebar() {
  return new Promise((resolve, reject) => {
    if (sidebarInjected) return resolve();

    fetch(chrome.runtime.getURL("sidebar.html"))
      .then((res) => res.text())
      .then((html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        const sidebar = tempDiv.firstElementChild;
        document.body.appendChild(sidebar);

        document
          .getElementById("webeasy-close-btn")
          .addEventListener("click", closeSidebar);

        sidebarInjected = true;
        resolve(); // Sidebar injected successfully
      })
      .catch((error) => {
        console.error("Failed to inject sidebar HTML:", error);
        reject(error); // Reject the promise if there is an error
      });
  });
}

function showSidebar(original, explanation) {
  injectSidebar()
    .then(() => {
      const originalTextElement = document.getElementById(
        "webeasy-original-text"
      );
      const explanationTextElement = document.getElementById(
        "webeasy-explanation"
      );

      if (originalTextElement && explanationTextElement) {
        originalTextElement.innerText = original;
        explanationTextElement.innerText = explanation;

        const sidebar = document.getElementById(SIDEBAR_ID);
        if (sidebar) sidebar.classList.add("open");
      } else {
        console.error("Sidebar elements not found!");
      }
    })
    .catch((error) => {
      console.error("Error injecting sidebar:", error);
    });
}

function closeSidebar() {
  const el = document.getElementById(SIDEBAR_ID);
  if (el) el.classList.remove("open");
}

function createButton(text, x, y) {
  groqBtn = document.createElement("button");
  groqBtn.innerText = "Ask WebEasy";
  groqBtn.className = BTN_CLASS;
  groqBtn.style.top = `${y + 10}px`;
  groqBtn.style.left = `${x + 10}px`;

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

document.addEventListener("mouseup", (e) => {
  setTimeout(() => {
    if (groqBtn) {
      groqBtn.remove();
      groqBtn = null;
    }

    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      createButton(selectedText, e.pageX, e.pageY);
    }
  }, 10);
});

injectStyles();
