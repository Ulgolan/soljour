"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-16">
      <h1 className="mb-8 text-center text-2xl font-semibold">SolJour — sign in</h1>
      <LoginForm onSuccess={() => router.push("/")} />
    </div>
  );
}
