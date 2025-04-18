import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("hello world");

  const handleClick = () => {
    alert("button clicked");
  }

  return (
    <>
      <h1>Hello World</h1>
      <p>{message}</p>
      <button onClick={handleClick}>Click Me!</button>
    </>
  );
}

export default App;
