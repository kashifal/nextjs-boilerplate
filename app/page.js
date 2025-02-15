"use client"
import { Suspense, useEffect } from 'react';
import RegisterForm from "@/components/auth/RegisterForm"
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
 
import './globals.css'

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#10141B] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div>
      <RegisterForm initialReferralCode={referralCode} />
    </div>
  );
}