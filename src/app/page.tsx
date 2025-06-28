"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

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
