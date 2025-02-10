"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";
import FlashcardCreator from "../components/FlashcardCreator";
import FlashcardViewer from "../components/FlashcardViewer";
import "./styles.css";

// Define the Flashcard type
interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export default function Home() {
  const { isSignedIn } = useUser();
  // Properly type the useState
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateFlashcards = async (topic: string, numCards: number) => {
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Sending request with:", { topic, numCards });
      
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, numCards }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received data:", data);
      
      if (Array.isArray(data)) {
        setFlashcards(data as Flashcard[]);
      } else {
        setError("Received invalid data format");
      }
    } catch (error) {
      console.error('Error creating flashcards:', error);
      setError("Failed to create flashcards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <SignedOut>
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-2xl font-bold mb-4">Welcome to Flashcards App</h1>
          <SignInButton />
          <SignUpButton />
        </div>
      </SignedOut>
      <SignedIn>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {flashcards.length === 0 ? (
          <FlashcardCreator onSubmit={handleCreateFlashcards} isLoading={isLoading} />
        ) : (
          <FlashcardViewer flashcards={flashcards} onReset={() => setFlashcards([])} />
        )}
      </SignedIn>
    </div>
  );
}