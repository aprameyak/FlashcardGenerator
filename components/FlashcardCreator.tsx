interface FlashcardCreatorProps {
  onSubmit: (topic: string, numCards: number) => void;
  isLoading: boolean;
}

export default function FlashcardCreator({ onSubmit, isLoading }: FlashcardCreatorProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const topic = (form.elements.namedItem('topic') as HTMLInputElement).value;
    const numCards = parseInt((form.elements.namedItem('numCards') as HTMLInputElement).value);
    onSubmit(topic, numCards);
  };

  return (
    <div className="creator-container">
      <h2 className="form-title">Create Your Flashcards</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="topic">
            What would you like to learn about?
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            required
            className="form-input"
            placeholder="e.g., JavaScript Basics, World History, Biology"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="numCards">
            Number of Flashcards (1-10)
          </label>
          <input
            type="number"
            id="numCards"
            name="numCards"
            required
            min="1"
            max="10"
            defaultValue="5"
            className="form-input"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="submit-button"
        >
          {isLoading ? 'Generating Flashcards...' : 'Create Flashcards'}
        </button>
      </form>
    </div>
  );
} 