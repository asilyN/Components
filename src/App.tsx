import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import EmojiPicker from "./components/EmojiPicker";

function App() {
  const [count, setCount] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

      {/* Emoji Picker Component */}
      <EmojiPicker onSelect={(emoji) => setSelectedEmoji(emoji)} />

      {/* Selected Emoji Display */}
      {selectedEmoji && <h2 className="text-2xl mt-4">Selected: {selectedEmoji}</h2>}
    </>
  );
}

export default App;
