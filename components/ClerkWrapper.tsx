"use client";

import { ReactNode } from 'react';

interface ClerkWrapperProps {
  children: ReactNode;
}

export default function ClerkWrapper({ children }: ClerkWrapperProps) {
  // Check if we're in a browser environment and Clerk is available
  if (typeof window === 'undefined') {
    // Server-side rendering - render without Clerk
    return <>{children}</>;
  }

  // Client-side - check if Clerk is available
  const isClerkAvailable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!isClerkAvailable) {
    // Render without Clerk components
    return <>{children}</>;
  }

  // Render with Clerk components
  return <>{children}</>;
}
