"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useUser } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/home"); 
    }
  }, [isSignedIn, router]);

  return (
    <div>
      <SignedOut>
        <div className="flex flex-col items-center space-y-4">
          <SignInButton />
          <SignUpButton />
        </div>
      </SignedOut>
      <SignedIn>
        <p>Redirecting...</p>
      </SignedIn>
    </div>
  );
}
