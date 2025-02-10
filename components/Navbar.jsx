'use client'
import React, { useState } from "react";
import Link from "next/link";
import NextImage from 'next/image'

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const links = [
    { name: "Home", href: "/", isActive: true },
    {
      name: "Staking calculator",
      href: "/staking-calculator",
      isActive: false,
    },
    { name: "About us", href: "/about-us", isActive: false },
    { name: "FAQ", href: "/faq", isActive: false },
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <nav className="max-w-[1250px] px-4 mx-auto py-8 flex items-center justify-between gap-2">
        <a href="/">
          <NextImage src={"/logo.svg"} width={140} height={100} alt="logo" />
        </a>

        <div className="xl:flex hidden items-center gap-6 xl:gap-[34px]">
          {links.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              className={`font-medium hover:text-white ${
                index === 0 ? "text-white" : "text-[#71798A]"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex  items-center gap-4 ">
          <div className="sm:flex hidden items-center gap-4">
            {/* <Link href="/login" className="bg-[#48FF2C] hover:bg-[#46ce30] sm:text-[16px] text-sm rounded-lg sm:rounded-[12px] px-4 sm:px-7 py-1.5 sm:py-2 font-semibold text-black">
              Login
            </Link> */}
            <Link href="/" className="hover:bg-[#48FF2C] text-[#48FF2C] sm:text-[16px] text-sm rounded-lg sm:rounded-[12px] px-4 sm:px-7 py-1.5 sm:py-2 font-semibold border border-[#3E3E3E]  hover:text-black">
              Register
            </Link>
          </div>
          <div
            onClick={toggleDrawer}
            className="text-[#71798A] lg:hidden hover:text-white cursor-pointer "
          >
            <svg
              className="w-8 h-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
             
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9h16.5m-16.5 6.75h16.5"
              />
            </svg>
          </div>
        </div>
      </nav>

      {/* drawer */}
      <div
        className={`flex flex-col transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out h-screen justify-center sm:px-6 py-8 px-4 w-full sm:w-1/2 fixed top-0 left-0 bg-[#0c0f14]  gap-6 xl:gap-[34px]`}
      >
        <div onClick={toggleDrawer} className="absolute cursor-pointer top-5 right-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-8 text-[#71798A] hover:text-white"
            width="15"
            height="15"
            viewBox="0 0 15 15"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M11.782 4.032a.575.575 0 1 0-.813-.814L7.5 6.687L4.032 3.218a.575.575 0 0 0-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 0 0 .814.814L7.5 8.313l3.469 3.469a.575.575 0 0 0 .813-.814L8.313 7.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {links.map((link, index) => (
          <a
            key={link.name}
            href={link.href}
            className={`font-medium text-xl  hover:text-white ${
              index === 0 ? "text-white" : "text-[#71798A]"
            }`}
          >
            {link.name}
          </a>
        ))}

        <div className="flex sm:hidden flex-col w-full mt-10 gap-4">
          <button className="bg-[#48FF2C] hover:bg-[#46ce30] sm:text-[16px] text-sm rounded-lg sm:rounded-[12px] px-4 sm:px-7 py-1.5 sm:py-2 font-semibold text-black">
            Login
          </button>
          <button className="hover:bg-[#48FF2C] text-[#48FF2C] sm:text-[16px] text-sm rounded-lg sm:rounded-[12px] px-4 sm:px-7 py-1.5 sm:py-2 font-semibold border border-[#3E3E3E]  hover:text-black">
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
