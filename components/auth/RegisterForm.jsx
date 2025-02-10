"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";

export default function RegisterForm({ initialReferralCode }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = initialReferralCode || searchParams.get("ref");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email,
          role: email === "admin@stakeprofitx.com" ? "admin" : "user",
          referralCode, // Include the referral code from URL
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (email === "admin@stakeprofitx.com") {
          localStorage.setItem("is_admin", true);
          localStorage.setItem("auth_token", JSON.stringify(data.user).email);
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/admin");
        } else {
          router.push(`/verify?email=${encodeURIComponent(email)}`);
        }
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex bg-[#10141B] p-6">
        <NextImage src={"/logo.svg"} width={160} height={100} alt="logo" />
      </div>
      <div className="flex min-h-screen items-center justify-center bg-[#10141B]">
        <div className="w-[400px] space-y-6 text-center">
          <div className="">
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
          </div>

          <h1 className="text-left text-[20px] font-semibold text-gray-200">
            Login - Sign up to your account
          </h1>

          {referralCode && (
            <p className="text-center text-sm text-gray-400">
              Referred by: {referralCode}
            </p>
          )}

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-left">
              <p className="mb-1 text-[14px] text-white">Name Surname</p>
              <label htmlFor="name" className="sr-only">
                Name Surname
              </label>
              <div className="flex items-center border border-gray-700 rounded-lg bg-[#0C0B0E] px-3 py-1">
                <svg
                  width="12"
                  height="15"
                  viewBox="0 0 12 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.3251 8.89186V12.9H6.6751V8.89186C9.33865 9.22396 11.4001 11.496 11.4001 14.25H0.600098C0.60012 12.9347 1.08015 11.6646 1.9501 10.6781C2.82005 9.69156 4.02012 9.05642 5.3251 8.89186ZM6.0001 8.17501C3.76247 8.17501 1.9501 6.36264 1.9501 4.12501C1.9501 1.88739 3.76247 0.0750122 6.0001 0.0750122C8.23772 0.0750122 10.0501 1.88739 10.0501 4.12501C10.0501 6.36264 8.23772 8.17501 6.0001 8.17501Z"
                    fill="#868C98"
                  />
                </svg>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name and surname"
                  className="w-full rounded-lg  bg-[transparent] px-4 py-2 text-gray-200 outline-none placeholder:text-[14px]"
                  required
                />
              </div>
            </div>
            <div className="text-left">
              <p className="mb-1 text-[14px] text-white">Email Address</p>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <div className="flex items-center border border-gray-700 rounded-lg bg-[#0C0B0E] px-3 py-1">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.25 4.25H16.75C16.9489 4.25 17.1397 4.32902 17.2803 4.46967C17.421 4.61032 17.5 4.80109 17.5 5V16C17.5 16.1989 17.421 16.3897 17.2803 16.5303C17.1397 16.671 16.9489 16.75 16.75 16.75H3.25C3.05109 16.75 2.86032 16.671 2.71967 16.5303C2.57902 16.3897 2.5 16.1989 2.5 16V5C2.5 4.80109 2.57902 4.61032 2.71967 4.46967C2.86032 4.32902 3.05109 4.25 3.25 4.25ZM16 7.4285L10.054 12.7535L4 7.412V15.25H16V7.4285ZM4.38325 5.75L10.0457 10.7465L15.6265 5.75H4.38325Z"
                    fill="#868C98"
                  />
                </svg>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg bg-[transparent] px-4 py-2 text-gray-200 outline-none placeholder:text-[14px]"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="w-full rounded-lg bg-[#48FF2C] py-2 font-semibold text-black disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Loading..." : "Continue"}
              </button>
            </div>
          </form>
          <div className="mt-4">
            <Link href="/">
              <button
                type="button"
                className="w-full rounded-lg border border-[#2F2F2F] py-2 font-semibold text-white"
              >
                Home Page
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
