import { useState } from 'react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  onReset: () => void;
}

const FlashcardViewer = ({ flashcards, onReset }: FlashcardViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    },
    progress: {
      textAlign: 'center' as const,
      marginBottom: '20px',
      color: '#4a5568',
      fontSize: '0.875rem',
    },
    card: {
      perspective: '1000px',
      height: '300px',
      marginBottom: '24px',
      cursor: 'pointer',
    },
    cardInner: {
      position: 'relative' as const,
      width: '100%',
      height: '100%',
      textAlign: 'center' as const,
      transition: 'transform 0.6s',
      transformStyle: 'preserve-3d' as const,
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
    },
    cardFace: {
      position: 'absolute' as const,
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    cardBack: {
      transform: 'rotateY(180deg)',
      backgroundColor: '#f8fafc',
    },
    text: {
      fontSize: '1.25rem',
      color: '#1a365d',
      lineHeight: '1.6',
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
    },
    button: {
      flex: '1',
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    navButton: {
      backgroundColor: '#e2e8f0',
      color: '#4a5568',
      '&:hover': {
        backgroundColor: '#cbd5e1',
      },
      '&:disabled': {
        backgroundColor: '#f1f5f9',
        cursor: 'not-allowed',
      },
    },
    resetButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      '&:hover': {
        backgroundColor: '#dc2626',
      },
    },
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.min(prev + 1, flashcards.length - 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div style={styles.container}>
      <div style={styles.progress}>
        Card {currentIndex + 1} of {flashcards.length}
      </div>

      <div style={styles.card} onClick={() => setIsFlipped(!isFlipped)}>
        <div style={styles.cardInner}>
          <div style={styles.cardFace}>
            <p style={styles.text}>{currentCard.question}</p>
          </div>
          <div style={{ ...styles.cardFace, ...styles.cardBack }}>
            <p style={styles.text}>{currentCard.answer}</p>
          </div>
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{ ...styles.button, ...styles.navButton }}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          style={{ ...styles.button, ...styles.navButton }}
        >
          Next
        </button>
      </div>

      <button
        onClick={onReset}
        style={{ ...styles.button, ...styles.resetButton }}
      >
        Create New Flashcards
      </button>
    </div>
  );
};

export default FlashcardViewer;
