'use client'
import React, { useState } from "react";
 
import NextImage from "next/image";
 
const OtherNavbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; // Redirect to home page after logout
  };

  return (
    <>
      <nav className="max-w-[1250px] sticky top-0 z-50 bg-[#10141B] px-4 mx-auto py-8 flex items-center justify-between gap-2">
        <a href="/">
          <NextImage src={'/logo.svg'} width={142} height={42} alt="logo" />
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

        <div className="flex items-center gap-4 ">
          <div className="relative">
            <div 
              className="flex items-center cursor-pointer gap-4"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <h1 className="font-semibold hidden sm:inline-flex">Reece.J</h1>
              <NextImage
                src={'/user.png'}
                width={52}
                height={52}
                className="sm:w-[52px] w-10 h-10 rounded-full object-cover sm:h-[52px] "
                alt=""
              />
            </div>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1A1F2B] rounded-lg shadow-lg py-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-[#71798A] hover:text-white hover:bg-[#10141B] transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
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
        <div
          onClick={toggleDrawer}
          className="absolute cursor-pointer top-5 right-4"
        >
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
      </div>
    </>
  );
};

export default OtherNavbar;
