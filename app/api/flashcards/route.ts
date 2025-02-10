import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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

    const systemPrompt = `Generate ${numCards} flashcards about ${topic} in this exact JSON format:
    [
      {
        "id": "1",
        "question": "Brief, clear question",
        "answer": "Concise, accurate answer"
      }
    ]
    Keep answers under 50 words. Focus on key concepts.`;

    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: systemPrompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = completion.choices[0].text;
    let flashcards;
    
    try {
      flashcards = JSON.parse(content || '[]');
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      // Fallback to generate basic flashcards if parsing fails
      flashcards = Array.from({ length: numCards }, (_, i) => ({
        id: `card-${i}`,
        question: `Question ${i + 1} about ${topic}?`,
        answer: `Answer ${i + 1} about ${topic}.`
      }));
    }

    return NextResponse.json(flashcards);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create flashcards' },
      { status: 500 }
    );
  }
} 