"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Welcome to xpulse
        </h1>
        <p className="text-lg text-muted-foreground">
          Your Solana trading companion
        </p>
      </div>
    </ProtectedRoute>
  );
}
