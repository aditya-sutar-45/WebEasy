let groqBtn = null;

function createButton(text, x, y) {
  groqBtn = document.createElement("button");
  groqBtn.innerText = "Ask Groq";
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
    window.getSelection().removeAllRanges();
    groqBtn.remove();
    groqBtn = null;
  });

  document.body.appendChild(groqBtn);
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
