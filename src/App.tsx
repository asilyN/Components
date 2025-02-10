import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import EmojiPicker from "./components/EmojiPicker";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useToastNotification from "./components/ToastifyNotification";

function App() {
  const [count, setCount] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const { showToast } = useToastNotification();

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    showToast(`You selected: ${emoji}`);
  };

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

      <EmojiPicker onSelect={handleEmojiSelect} />

      {selectedEmoji && <h2 className="text-2xl mt-4">Selected: {selectedEmoji}</h2>}
      <ToastContainer />
    </>
  );
}

export default App;
