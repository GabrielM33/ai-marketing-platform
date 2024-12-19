"use client";

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/projects");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) {
    return null; // Prevent flash of content while redirecting
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to AI Marketing Platform
      </h1>
      <div className="space-x-4">
        <SignInButton mode="modal">
          <Button variant="default">Sign in</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="outline">Sign up</Button>
        </SignUpButton>
      </div>
    </div>
  );
}
