'use client';
import { Suspense } from 'react';
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#10141B] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>}>
      <LoginForm />
    </Suspense>
  );
}