'use client';
import { Suspense } from 'react';
import RegisterForm from "@/components/auth/RegisterForm";
import { useSearchParams } from 'next/navigation';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#10141B] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>}>
      <RegisterPageContent />
    </Suspense>
  );
}

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  return (
    <div className="min-h-screen bg-[#10141B]">
      <RegisterForm initialReferralCode={referralCode} />
    </div>
  );
} 