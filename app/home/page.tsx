"use client";

import { useState } from "react";

export default function Page() {
    const [text, setText] = useState("");
    const [flashcards, setFlashcards] = useState<string[]>([]);

  const handleSubmit = () => {
    if (text.trim()) {
      setFlashcards([...flashcards, text]);
      setText(""); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Create Flashcards</h1>

      <textarea
        className="w-full max-w-md p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={4}
        placeholder="Enter text for a flashcard..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
        onClick={handleSubmit}
      >
        Add Flashcard
      </button>

      {flashcards.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2">Your Flashcards</h2>
          <div className="space-y-2">
            {flashcards.map((card, index) => (
              <div key={index} className="p-3 bg-white shadow rounded-lg">
                {card}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}