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
  const { } = useUser();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <SignedOut>
          <div className="flex flex-col items-center space-y-6 bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Flashcards App</h1>
            <p className="text-gray-600 text-center mb-6">Sign in or create an account to start learning</p>
            <div className="space-y-4">
              <SignInButton mode="modal">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-2 px-6 rounded-lg border-2 border-blue-600 transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            {flashcards.length === 0 ? (
              <FlashcardCreator onSubmit={handleCreateFlashcards} isLoading={isLoading} />
            ) : (
              <FlashcardViewer flashcards={flashcards} onReset={() => setFlashcards([])} />
            )}
          </div>
        </SignedIn>
      </div>
    </div>
  );
}