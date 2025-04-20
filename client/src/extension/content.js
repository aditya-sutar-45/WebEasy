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
  if (sidebarInjected) return;

  const sidebar = document.createElement("div");
  sidebar.id = SIDEBAR_ID;
  sidebar.className = "webeasy-sidebar";
  sidebar.innerHTML = `
    <div class="webeasy-sidebar-header">
      <h2>WebEasy Explanation</h2>
      <button class="webeasy-close-btn" id="webeasy-close-btn">x</button>
    </div>
    <div class="webeasy-content">
      <h3>Original Text:</h3>
      <div id="webeasy-original-text" class="webeasy-original-text"></div>
      <h3>Explanation:</h3>
      <div id="webeasy-explanation" class="webeasy-explanation"></div>
    </div>
  `;
  document.body.appendChild(sidebar);

  document
    .getElementById("webeasy-close-btn")
    .addEventListener("click", closeSidebar);
  sidebarInjected = true;
}

function showSidebar(original, explanation) {
  if (!sidebarInjected) injectSidebar();

  document.getElementById("webeasy-original-text").innerText = original;
  document.getElementById("webeasy-explanation").innerText = explanation;

  setTimeout(() => {
    document.getElementById(SIDEBAR_ID).classList.add("open");
  }, 10);
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
