'use client';
import RegisterForm from "@/components/auth/RegisterForm";
import { useSearchParams } from 'next/navigation';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  return (
    <div className="min-h-screen bg-[#10141B]">
      <RegisterForm initialReferralCode={referralCode} />
    </div>
  );
} 