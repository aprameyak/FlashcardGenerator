import React, { useState } from 'react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  onReset: () => void;
}

export default function FlashcardViewer({ flashcards, onReset }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="viewer-container">
      <div className="card-counter">
        Card {currentIndex + 1} of {flashcards.length}
      </div>

      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <h3 className="card-title">Question:</h3>
            <p className="card-content">{flashcards[currentIndex].question}</p>
          </div>
          <div className="flashcard-back">
            <h3 className="card-title">Answer:</h3>
            <p className="card-content">{flashcards[currentIndex].answer}</p>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="nav-button prev-button"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="nav-button next-button"
        >
          Next
        </button>
      </div>

      <button
        onClick={onReset}
        className="reset-button"
      >
        Create New Flashcards
      </button>
    </div>
  );
} 