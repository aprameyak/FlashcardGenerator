import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { topic, numCards } = await request.json();

    if (!topic || !numCards) {
      return NextResponse.json(
        { error: 'Topic and number of cards are required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert educator specializing in creating effective flashcards for learning. Create flashcards that promote active recall and deep understanding."
        },
        {
          role: "user",
          content: `Create ${numCards} high-quality flashcards about "${topic}" following these guidelines:

1. Questions should:
   - Be clear and specific
   - Test one concept at a time
   - Encourage critical thinking and understanding
   - Use Bloom's taxonomy action verbs (analyze, evaluate, explain, compare)
   - Focus on application and understanding, not just recall
   - Avoid yes/no questions

2. Answers should:
   - Be concise but complete (under 50 words)
   - Include only essential information
   - Use simple, clear language
   - Provide concrete examples where helpful
   - Focus on key concepts and understanding

Format the output as a JSON array with exactly ${numCards} items like this:
[
  {
    "id": "1",
    "question": "Question text here",
    "answer": "Answer text here"
  }
]`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content;
    let flashcards: Flashcard[] = [];
    
    try {
      const parsedContent = JSON.parse(content || '[]');
      flashcards = Array.isArray(parsedContent) ? parsedContent : [];
      
      flashcards = flashcards.map((card: Flashcard, index: number) => ({
        id: card.id || `${index + 1}`,
        question: card.question?.trim().replace(/^Q:|Question:/, '').trim() || '',
        answer: card.answer?.trim().replace(/^A:|Answer:/, '').trim() || ''
      }));

      flashcards = flashcards.filter((card: Flashcard) => 
        card.question && 
        card.answer && 
        card.question.length > 10 && 
        card.answer.length > 10
      );

      if (flashcards.length < numCards * 0.7) {
        throw new Error('Not enough valid flashcards generated');
      }

      return NextResponse.json(flashcards);

    } catch (error) {
      console.error('Error processing flashcards:', error);
      return NextResponse.json(
        { error: 'Failed to generate valid flashcards' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create flashcards' },
      { status: 500 }
    );
  }
}
