import { useState } from "react";

const emojis = ["😀", "😂", "😍", "😎", "😭", "🤔", "🔥", "👍", "🎉", "🌟"];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

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
              onClick={() => {
                onSelect(emoji);
                setShowPicker(false);
              }}
              className="text-2xl hover:bg-gray-200 p-2 rounded-lg hover:scale-110 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
