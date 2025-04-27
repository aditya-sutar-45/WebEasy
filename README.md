![github-submission-banner](https://github.com/user-attachments/assets/a1493b84-e4e2-456e-a791-ce35ee2bcf2f)

# 🚀 WebEasy

> Easy-fy the Web

---

## 📌 Problem Statement

**Problem Statement 1 – Weave AI magic with Groq**

---

## 🎯 Objective

WebEasy solves the problem of making complex information on the internet easier to understand, instantly.
Instead of forcing users to copy confusing text and search for explanations, WebEasy lets them highlight any text and get a simple, AI-generated explanation right there on the page.

It serves students, researchers, professionals, and everyday readers who come across complicated articles, academic papers, technical blogs, or legal documents — and want quick, easy-to-understand clarifications without interrupting their flow.

While reading an article full of jargon, a user can just select any confusing sentence, click "Ask WebEasy", and immediately see a simple, friendly explanation — no need to open a new tab or search manually.

---

## 🧠 Team & Approach

### Team Name:  
Pixels

### Team Members:  
- Aditya Sutar (![github](https://github.com/aditya-sutar-45) / ![linkedIn](https://www.linkedin.com/in/aditya9sutar/) / Frontend)  
- Sushant Kumbhar (![github](https://github.com/TheSushantKumbhar) / ![linkedIn](https://www.linkedin.com/in/sushant-kumbhar-98458b275/) / Backend)  


### Your Approach:  
- We wanted to make the web more accessible, beginner-friendly, and fast to understand — especially for students and curious learners.
Instead of making people leave the page to "Google" confusing terms, WebEasy brings simple explanations directly to them.

- Key challenges you addressed  
    - Real-time selection detection: Detecting when a user selects text and giving them a smooth, non-intrusive "Ask WebEasy" button.

    - Seamless user experience: Making sure the AI explanations appear naturally, without opening a ton of new tabs or making users lose their place.

    - Extension architecture: Managing communication between the content script, background service worker, and the React popup without breaking Chrome extension rules (like not using imports in service workers).

- Any pivots, brainstorms, or breakthroughs during hacking  
    - Initially, we thought of showing the explanation inside a separate popup window. But we pivoted to displaying the explanation directly near the selected text, because it felt faster, more natural, and kept users focused on the page.

---

## 🛠️ Tech Stack
**Frontend:**
    - React.js (Vite) for building the popup interface
    - Plain JavaScript for the content script (detecting text selection, creating the "Ask WebEasy" button)

**Backend:**
    - Flask (Python) API for processing and simplifying the selected text using an LLM (Llama 3)

**Browser Extension:**
    - Chrome Extension (Manifest V3)
    - Background Service Worker for handling API calls
    - Content Script for injecting and interacting with web pages

### Sponsor Technologies Used (if any):
- [✅] **Groq:** _How you used Groq_  
- [ ] **Monad:** _Your blockchain implementation_  
- [ ] **Fluvio:** _Real-time data handling_  
- [ ] **Base:** _AgentKit / OnchainKit / Smart Wallet usage_  
- [ ] **Screenpipe:** _Screen-based analytics or workflows_  
- [ ] **Stellar:** _Payments, identity, or token usage_
*(Mark with ✅ if completed)*
---

## ✨ Key Features

### Instant Text Simplification:
Select any complex text on any webpage and instantly simplify it in kid-friendly language using AI (Llama 3).

### Smart Context Menu ("Ask WebEasy" Button):
After selecting text, a custom floating button appears right next to your selection — providing a smooth and intuitive experience.

### Real-Time API Integration:
Seamless communication between the Chrome extension and a Flask backend to fetch AI-generated explanations in real time.

### Minimal, Non-Intrusive UI:
Clean design that doesn't interfere with the original webpage layout, built with pure CSS and lightweight JavaScript.

### No External Dependencies:
Built from scratch without heavy libraries — ensuring faster performance and better control over the user experience.

---

## 📽️ Demo & Deliverables

- **Demo Video Link:** [Paste YouTube or Loom link here]  
- **Pitch Deck / PPT Link:** [Paste Google Slides / PDF link here]  

---

## ✅ Tasks & Bonus Checklist

- [✅] **All members of the team completed the mandatory task - Followed at least 2 of our social channels and filled the form** (Details in Participant Manual)  
- [ ] **All members of the team completed Bonus Task 1 - Sharing of Badges and filled the form (2 points)**  (Details in Participant Manual)
- [ ] **All members of the team completed Bonus Task 2 - Signing up for Sprint.dev and filled the form (3 points)**  (Details in Participant Manual)

*(Mark with ✅ if completed)*

---

## 🧪 How to Run the Project

### Requirements:
- Node.js / Python / Docker / etc.
- API Keys (if any)
- .env file setup (if needed)

### Clone the repo
```bash
git clone https://github.com/your-team/project-name
```

### Local Setup:
```bash

cd client
npm install

npm run build 
```
go to chrome://extensions/ and enable developer mode
upload you `dist/` folder by clicking "Load Unpacked"

### Server Setup:
```bash
cd server


```

---

## 🧬 Future Scope

List improvements, extensions, or follow-up features:

-  Full Page Summary / Explaination 
-  Image / Video Description

---

## 📎 Resources / Credits

- Groq API
- Acknowledgements  
Organizers for providing guidance, support, and a platform to innovate.
The open-source community, especially for tools like React, Flask, and the Llama 3 model, which made it possible to build WebEasy.
Google Chrome Extensions API documentation for helping us understand and implement modern browser extension development (Manifest V3).
Our team members for their creativity, late-night debugging sessions, and relentless teamwork throughout the hackathon.

---

## 🏁 Final Words
For our first hackathon this has been a very positive and fun experience we would love to come back stronger next year 💪🔥

---
