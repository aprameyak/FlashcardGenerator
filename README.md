# FlashcardGenerator

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white&style=for-the-badge)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?logo=clerk&logoColor=white&style=for-the-badge)

## About

**FlashcardGenerator** is an AI-powered study tool built with **Next.js** and **React** that converts user-provided notes into question-and-answer flashcards using the **OpenAI** API. Users authenticate via **Clerk**, paste or type their notes, and instantly receive a structured deck of flashcards they can flip through in an interactive viewer.

## Features

- AI-generated flashcards from free-form notes via OpenAI GPT
- Interactive flashcard viewer with flip animation
- Clerk authentication protecting the flashcard creation flow
- Server-side API route (`/api/flashcards`) handles all OpenAI calls
- Clean, minimal UI focused on the study workflow
- Vercel Analytics for usage tracking

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Next.js API Routes
- **AI Integration**: OpenAI API
- **Authentication**: Clerk

## Deployment

Visit the live site at [https://flashcards-dusky-nine.vercel.app](https://flashcards-dusky-nine.vercel.app)
