'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import Image from 'next/image';

export default function VerifyForm() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  useEffect(() => {
    const url = new URL(window.location.href);
    const email = url.searchParams.get('email');
    if (email) {
      setEmail(email);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const combinedOtp = otp.split('').join('');
    
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: combinedOtp }),
        credentials: 'include',
      });

      const data = await res.json();
      
      if (res.ok) {
        setIsLoading(false);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setIsLoading(false);
        const errorMessage = data.error || 
          (res.status === 401 ? 'Invalid verification code' :
           res.status === 404 ? 'Email not found' :
           'Verification failed. Please try again.');
        setError(errorMessage);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Verification request failed:', error);
      setError('Network error. Please check your connection and try again.');
    }
  };

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = otp.split('');
      newOtp[index] = value;
      setOtp(newOtp.join(''));
      
      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  return (
    <div className="bg-[#10141B] min-h-screen">
      <div className="flex items-center bg-[#10141B] p-6">
        <Image src={"/logo.svg"} width={140} height={100} alt="logo" />
      </div>

      <div className="flex min-h-screen items-center justify-center">
        <div className="w-[400px] space-y-8">
          <div>
          <svg
              width="31"
              height="29"
              viewBox="0 0 21 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0.870971C0 0.389947 0.389947 0 0.87097 0H5.22582C5.70684 0 6.09679 0.389947 6.09679 0.87097V5.22582C6.09679 5.70684 5.70684 6.09679 5.22582 6.09679H0.870971C0.389947 6.09679 0 5.70684 0 5.22582V0.870971Z"
                fill="url(#paint0_linear_917_1056)"
              />
              <rect
                x="7.84048"
                width="6.09679"
                height="6.09679"
                rx="0.87097"
                fill="url(#paint1_linear_917_1056)"
              />
              <rect
                x="13.0674"
                y="5.22552"
                width="6.96776"
                height="6.96776"
                rx="0.87097"
                fill="url(#paint2_linear_917_1056)"
              />
              <rect
                x="6.96408"
                y="11.3225"
                width="6.96776"
                height="6.96776"
                rx="0.87097"
                fill="url(#paint3_linear_917_1056)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_917_1056"
                  x1="3.0484"
                  y1="0"
                  x2="3.0484"
                  y2="6.09679"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#28DF99" />
                  <stop offset="0.5" stop-color="#3EDD25" />
                  <stop offset="1" stop-color="#17540E" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_917_1056"
                  x1="10.8889"
                  y1="0"
                  x2="10.8889"
                  y2="6.09679"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#28DF99" />
                  <stop offset="0.5" stop-color="#3EDD25" />
                  <stop offset="1" stop-color="#17540E" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_917_1056"
                  x1="16.5513"
                  y1="5.22552"
                  x2="16.5513"
                  y2="12.1933"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#28DF99" />
                  <stop offset="0.5" stop-color="#3EDD25" />
                  <stop offset="1" stop-color="#17540E" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_917_1056"
                  x1="10.448"
                  y1="11.3225"
                  x2="10.448"
                  y2="18.2903"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#28DF99" />
                  <stop offset="0.5" stop-color="#3EDD25" />
                  <stop offset="1" stop-color="#17540E" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="mb-1 mt-[20px] text-[20px] font-semibold tracking-wider text-white">Enter Verification Code</h1>
            <p className="text-[16px] text-[#525866]">We've sent a code to<span className="text-white"> {email} </span></p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="hidden"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <div className="flex justify-between space-x-2">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  name={`otp-${index}`}
                  maxLength={1}
                  value={otp[index] || ''}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="h-[64px] w-[80px] rounded-lg border border-[#3D4240] bg-[#0C0B0E] text-center text-2xl text-white focus:outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full rounded-xl bg-[#48FF2C] py-2 font-semibold text-black hover:bg-green-500"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </form>

          <div className="mt-4">
            <Link href="/">
              <button className="w-full rounded-xl border border-gray-700 py-2 text-white">
                Go to Login Page
              </button>
            </Link>
          </div>

          <div className="text-center">
            {/* <p className="text-[14px] text-gray-500">Experiencing issues receiving the code?</p>
            <a href="#" className="text-white underline">Resend code</a> */}
          </div>
        </div>
      </div>
    </div>
  );
} 