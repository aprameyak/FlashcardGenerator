"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";
import FlashcardCreator from "../components/FlashcardCreator";
import FlashcardViewer from "../components/FlashcardViewer";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export default function Home() {
  const { } = useUser();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px',
    },
    mainContent: {
      maxWidth: '800px',
      margin: '0 auto',
      position: 'relative' as const,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      padding: '30px',
      marginBottom: '20px',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#2d3748',
      textAlign: 'center' as const,
      marginBottom: '20px',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#4a5568',
      textAlign: 'center' as const,
      marginBottom: '30px',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '15px',
      maxWidth: '300px',
      margin: '0 auto',
    },
    button: {
      width: '100%',
      padding: '12px 24px',
      fontSize: '1rem',
      fontWeight: '600',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
    },
    primaryButton: {
      backgroundColor: '#4299e1',
      color: 'white',
      border: 'none',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#4299e1',
      border: '2px solid #4299e1',
    },
    errorContainer: {
      backgroundColor: '#fff5f5',
      border: '1px solid #fc8181',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    errorText: {
      color: '#c53030',
      fontSize: '0.875rem',
    },
    errorIcon: {
      width: '20px',
      height: '20px',
      color: '#fc8181',
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    },
  };

  const handleCreateFlashcards = async (topic: string, numCards: number) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, numCards }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (err) {
      setError("Error generating flashcards. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <SignedOut>
          <div style={styles.card}>
            <h1 style={styles.title}>Flashcard Generator</h1>
            <p style={styles.subtitle}>
              Create AI-powered flashcards instantly for better learning
            </p>
            <div style={styles.buttonContainer}>
              <SignInButton mode="modal">
                <button style={{ ...styles.button, ...styles.primaryButton }}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{ ...styles.button, ...styles.secondaryButton }}>
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div style={styles.card}>
            {error && (
              <div style={styles.errorContainer}>
                <svg
                  style={styles.errorIcon}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p style={styles.errorText}>{error}</p>
              </div>
            )}

            {isLoading && (
              <div style={styles.loadingSpinner}>
                <div style={{
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #3498db',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  animation: 'spin 1s linear infinite',
                }}>
                </div>
              </div>
            )}

            {!isLoading && (
              <>
                {flashcards.length === 0 ? (
                  <FlashcardCreator onSubmit={handleCreateFlashcards} isLoading={isLoading} />
                ) : (
                  <FlashcardViewer flashcards={flashcards} onReset={() => setFlashcards([])} />
                )}
              </>
            )}
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
