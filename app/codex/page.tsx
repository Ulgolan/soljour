"use client";

import { AuthGate } from "@/components/AuthGate";
import { SurfacePlaceholder } from "@/components/SurfacePlaceholder";

export default function CodexPage() {
  return (
    <AuthGate>
      <SurfacePlaceholder label="Codex" />
    </AuthGate>
  );
}
