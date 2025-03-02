import { useState, useEffect } from "react";
import { supabase } from "../../server/supabaseclient";
import useToastNotification from "./ToastifyNotification"; // Import the custom toast hook

const emojis = ["😀", "😂", "😍", "😎", "😭", "🤔", "🔥", "👍", "🎉", "🌟"];

export default function EmojiPicker() {
  const [showPicker, setShowPicker] = useState(false);
  const [savedEmojis, setSavedEmojis] = useState<string[]>([]);
  const { showToast } = useToastNotification(); // Use the toast notification hook

  // Fetch emojis from Supabase
  useEffect(() => {
    const fetchEmojis = async () => {
      const { data, error } = await supabase
        .from("emoji")
        .select("chosen_emoji")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching emojis:", error);
        showToast("Error fetching emojis ❌"); // Show toast on fetch error
      } else {
        setSavedEmojis(data.map((e) => e.chosen_emoji));
      }
    };
    fetchEmojis();
  }, []);

  // Save emoji to Supabase
  const handleEmojiSelect = async (emoji: string) => {
    setShowPicker(false);
    const { error } = await supabase.from("emoji").insert([{ chosen_emoji: emoji }]); 

    if (error) {
      console.error("❌ Error saving emoji:", error);
      showToast("Failed to save emoji ❌"); // Show error toast
    } else {
      setSavedEmojis((prev) => [emoji, ...prev]); // Update UI instantly
      showToast("Emoji saved successfully! 🎉"); // Show success toast
    }
  };

  return (
    <div className="relative text-center mt-10">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-6"
      >
        Pick Emoji
      </button>

      {showPicker && (
        <div className="absolute mt-4 bg-white border shadow-md rounded-lg p-3 grid grid-cols-5 gap-2">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiSelect(emoji)}
              className="text-2xl hover:bg-gray-200 p-2 rounded-lg hover:scale-110 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Display saved emojis */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Recently Picked Emojis:</h2>
        <div className="flex gap-2 text-2xl">
          {savedEmojis.map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
