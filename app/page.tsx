"use client";

import { AuthGate } from "@/components/AuthGate";
import { Chronicle } from "@/components/Chronicle";

export default function Home() {
  return (
    <AuthGate>
      <Chronicle />
    </AuthGate>
  );
}
