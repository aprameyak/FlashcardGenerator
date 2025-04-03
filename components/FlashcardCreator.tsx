import { useState } from 'react';

interface FlashcardCreatorProps {
  onSubmit: (topic: string, numCards: number) => void;
  isLoading: boolean;
}

const FlashcardCreator = ({ onSubmit, isLoading }: FlashcardCreatorProps) => {
  const [topic, setTopic] = useState('');
  const [numCards, setNumCards] = useState(5);

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4a5568',
    },
    input: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      outline: 'none',
      '&:focus': {
        borderColor: '#4f46e5',
      },
    },
    select: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '1rem',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#4f46e5',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#4338ca',
      },
      '&:disabled': {
        backgroundColor: '#a5b4fc',
        cursor: 'not-allowed',
      },
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && numCards > 0) {
      onSubmit(topic.trim(), numCards);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="topic" style={styles.label}>
            What would you like to learn about?
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., 'JavaScript Promises')"
            style={styles.input}
            required
            minLength={3}
            maxLength={100}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="numCards" style={styles.label}>
            Number of flashcards
          </label>
          <select
            id="numCards"
            value={numCards}
            onChange={(e) => setNumCards(Number(e.target.value))}
            style={styles.select}
          >
            {[3, 5, 7, 10].map((num) => (
              <option key={num} value={num}>
                {num} cards
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          style={styles.button}
        >
          {isLoading ? 'Generating Flashcards...' : 'Create Flashcards'}
        </button>
      </form>
    </div>
  );
};

export default FlashcardCreator;
