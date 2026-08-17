"use client";

import { AuthGate } from "@/components/AuthGate";
import { ProofSurface } from "@/components/ProofSurface";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col px-6 py-10">
      <h1 className="text-center text-3xl font-semibold tracking-tight">SolJour</h1>
      <div className="mt-8 flex-1">
        <AuthGate>
          <ProofSurface />
        </AuthGate>
      </div>
    </div>
  );
}
