import React from "react";
import "./App.css";
import Employees from "./components/Employee";

function App() {

  return (
    <>
      <div>
        <Employees />

      </div>

    </>
  );
}

export default App;














// import "./App.css";
// import EmojiPicker from "./components/EmojiPicker";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import useToastNotification from "./components/ToastifyNotification";

// function App() {
//   const [count, setCount] = useState(0);
//   const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
//   const { showToast } = useToastNotification();

//   const handleEmojiSelect = (emoji: string) => {
//     setSelectedEmoji(emoji);
//     showToast(`You selected: ${emoji}`);
//   };

//   return (
//     <>
//       <div></div>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//       </div>

//       <EmojiPicker onSelect={handleEmojiSelect} />

//       {selectedEmoji && (
//         <h2 className="text-2xl mt-4">Selected: {selectedEmoji}</h2>
//       )}
//       <ToastContainer />
//     </>
//   );
// }

// export default App;

