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

    const systemPrompt = `Create ${numCards} high-quality flashcards about "${topic}" following these guidelines:

1. Questions should:
   - Be clear and specific
   - Test one concept at a time
   - Encourage critical thinking
   - Use action words (explain, compare, analyze, define)
   - Avoid yes/no questions

2. Answers should:
   - Be concise but complete (under 50 words)
   - Include only essential information
   - Use simple, clear language
   - Include examples where helpful
   - Focus on key concepts and understanding

Format the output as a JSON array exactly like this:
[
  {
    "id": "1",
    "question": "What is the fundamental principle of [concept]?",
    "answer": "Clear, concise explanation with key points."
  }
]

For technical topics:
- Include practical applications
- Break down complex concepts
- Use analogies when helpful
- Cover both theory and implementation

For non-technical topics:
- Focus on main ideas and relationships
- Include important dates, names, or terms
- Highlight cause-and-effect relationships
- Connect concepts to real-world examples`;

    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: systemPrompt,
      max_tokens: 1000, 
      temperature: 0.7,
    });

    const content = completion.choices[0].text;
    let flashcards;
    
    try {
      flashcards = JSON.parse(content || '[]');
      
      flashcards = flashcards.map((card: any, index: number) => ({
        id: card.id || `${index + 1}`,
        question: card.question.trim(),
        answer: card.answer.trim()
      }));

      flashcards = flashcards.filter((card: any) => 
        card.question && 
        card.answer && 
        card.question.length > 10 && 
        card.answer.length > 10
      );

    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
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
