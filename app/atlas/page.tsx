"use client";

import { AuthGate } from "@/components/AuthGate";
import { SurfacePlaceholder } from "@/components/SurfacePlaceholder";

export default function AtlasPage() {
  return (
    <AuthGate>
      <SurfacePlaceholder label="Atlas" />
    </AuthGate>
  );
}
