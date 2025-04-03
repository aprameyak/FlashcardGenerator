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
  const { user } = useUser();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
      padding: '40px 20px',
    },
    mainContent: {
      maxWidth: '1000px',
      margin: '0 auto',
      position: 'relative' as const,
    },
    welcomeCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      padding: '40px',
      textAlign: 'center' as const,
      marginBottom: '30px',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#1a365d',
      marginBottom: '16px',
      letterSpacing: '-0.025em',
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#4a5568',
      marginBottom: '32px',
      lineHeight: '1.6',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
      maxWidth: '320px',
      margin: '0 auto',
    },
    button: {
      padding: '12px 24px',
      fontSize: '1rem',
      fontWeight: '600',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      width: '100%',
      border: 'none',
    },
    primaryButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
      '&:hover': {
        backgroundColor: '#4338ca',
      },
    },
    secondaryButton: {
      backgroundColor: 'white',
      color: '#4f46e5',
      border: '2px solid #4f46e5',
      '&:hover': {
        backgroundColor: '#f9fafb',
      },
    },
    errorAlert: {
      backgroundColor: '#fee2e2',
      borderLeft: '4px solid #ef4444',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    errorText: {
      color: '#b91c1c',
      fontSize: '0.875rem',
    },
  };

  const handleCreateFlashcards = async (topic: string, numCards: number) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, numCards }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate flashcards');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setFlashcards(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <SignedOut>
          <div style={styles.welcomeCard}>
            <h1 style={styles.title}>AI-Powered Flashcard Generator</h1>
            <p style={styles.subtitle}>
              Transform any topic into effective study materials using advanced AI technology.
              Sign in to start creating personalized flashcards instantly.
            </p>
            <div style={styles.buttonContainer}>
              <SignInButton mode="modal">
                <button style={{ ...styles.button, ...styles.primaryButton }}>
                  Sign In to Get Started
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{ ...styles.button, ...styles.secondaryButton }}>
                  Create New Account
                </button>
              </SignUpButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div style={styles.welcomeCard}>
            <h1 style={styles.title}>Welcome, {user?.firstName || 'Student'}!</h1>
            {error && (
              <div style={styles.errorAlert}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span style={styles.errorText}>{error}</span>
              </div>
            )}
            
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
