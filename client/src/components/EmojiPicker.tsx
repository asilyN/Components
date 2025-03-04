// import React, { useState, useEffect } from "react";
// import useToastNotification from "./ToastifyNotification"; 

// const API_URL = "http://localhost:3000/api/emojis";

// const emojis = ["😀", "😂", "😍", "😎", "😭", "🤔", "🔥", "👍", "🎉", "🌟"];

// interface EmojiPickerProps {
//   onSelect: (emoji: string) => void;
// }

// export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
//   const [showPicker, setShowPicker] = useState(false);
//   const [savedEmojis, setSavedEmojis] = useState<string[]>([]);
//   const { showToast } = useToastNotification();

  
//   useEffect(() => {
//     const fetchEmojis = async () => {
//       try {
//         const response = await fetch(API_URL);
//         const data = await response.json();
//         console.log(data);

//         if (!response.ok) throw new Error(data.error);
//         setSavedEmojis(data.map((e: { chosen_emoji: string }) => e.chosen_emoji));
//       } catch (error) {
//         console.error("❌ Error fetching emojis:", error);
//         showToast("Error fetching emojis ❌");
//       }
//     };

//     fetchEmojis();
//   }, []);

  
//   const handleEmojiSelect = async (emoji: string) => {
//     setShowPicker(false);
//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ emoji }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error);

//       setSavedEmojis((prev) => [emoji, ...prev]);
//       showToast("Emoji saved successfully! 🎉");
//     } catch (error) {
//       console.error("❌ Error saving emoji:", error);
//       showToast("Failed to save emoji ❌");
//     }
//   };

//   return (
//     <div className="relative text-center mt-10">
//       <button
//         onClick={() => setShowPicker(!showPicker)}
//         className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-6 "
//       >
//         Pick Emoji
//       </button>

//       {showPicker && (
//         <div className="absolute mt-4 bg-white border shadow-md rounded-lg p-3 grid grid-cols-5 gap-2 w-60">
//           {emojis.map((emoji) => (
//             <button
//               key={emoji}
//               onClick={() => handleEmojiSelect(emoji)}
//               className="text-3xl hover:bg-gray-200 p-1 rounded-lg hover:scale-110 transition-transform -ml-3 -mr-3 "
//             >
//               {emoji}
//             </button>
//           ))}
//         </div>
//       )}

      
//       <div className="mt-6">
//         <h2 className="text-lg font-semibold mb-2">Recently Picked Emojis:</h2>
//         <div className="flex gap-2 text-2xl">
//           {savedEmojis.map((e, i) => (
//             <span key={i}>{e}</span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
