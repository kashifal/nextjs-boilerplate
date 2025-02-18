"use client";
import React, { useState } from "react";
import OtherNavbar from "@/components/OtherNavbar";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const tabs = [
    {
      id: 1,
      name: "Stakings",
      svg: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 1.14581C5.56604 1.14581 1.14587 5.56598 1.14587 11C1.14587 16.434 5.56604 20.8541 11 20.8541C16.434 20.8541 20.8542 16.434 20.8542 11C20.8542 5.56598 16.434 1.14581 11 1.14581ZM11 19.4791C6.32412 19.4791 2.52087 15.6759 2.52087 11C2.52087 6.32406 6.32412 2.52081 11 2.52081C15.676 2.52081 19.4792 6.32406 19.4792 11C19.4792 15.6759 15.676 19.4791 11 19.4791ZM16.0692 8.68079C16.3378 8.94937 16.3378 9.38482 16.0692 9.6534L13.509 12.2136C12.8847 12.8388 11.8663 12.8397 11.2411 12.2145L9.78454 10.7616C9.6947 10.6718 9.54988 10.6718 9.46005 10.7616L6.90162 13.3201C6.76779 13.4539 6.59179 13.5217 6.41579 13.5217C6.23979 13.5217 6.06379 13.4548 5.92996 13.3201C5.66138 13.0515 5.66138 12.616 5.92996 12.3475L8.48837 9.78902C9.11354 9.16386 10.131 9.16388 10.7562 9.78813L12.2128 11.241C12.3026 11.3299 12.4475 11.3299 12.5373 11.241L15.0975 8.68079C15.3661 8.4122 15.8006 8.4122 16.0692 8.68079Z" fill="currentColor"/>
        </svg>`,
      path: "dashboard",
    },
    {
      id: 2,
      name: "Referrals",
      svg: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.9375 9.16667C19.9375 9.54617 19.6295 9.85417 19.25 9.85417H17.6458V11.4583C17.6458 11.8378 17.3378 12.1458 16.9583 12.1458C16.5788 12.1458 16.2708 11.8378 16.2708 11.4583V9.85417H14.6667C14.2872 9.85417 13.9792 9.54617 13.9792 9.16667C13.9792 8.78717 14.2872 8.47917 14.6667 8.47917H16.2708V6.875C16.2708 6.4955 16.5788 6.1875 16.9583 6.1875C17.3378 6.1875 17.6458 6.4955 17.6458 6.875V8.47917H19.25C19.6295 8.47917 19.9375 8.78717 19.9375 9.16667ZM5.27911 5.95833C5.27911 3.81058 7.02628 2.0625 9.17495 2.0625C11.3236 2.0625 13.0708 3.81058 13.0708 5.95833C13.0708 8.10608 11.3236 9.85417 9.17495 9.85417C7.02628 9.85417 5.27911 8.10608 5.27911 5.95833ZM6.65411 5.95833C6.65411 7.34892 7.78436 8.47917 9.17495 8.47917C10.5655 8.47917 11.6958 7.34892 11.6958 5.95833C11.6958 4.56775 10.5655 3.4375 9.17495 3.4375C7.78436 3.4375 6.65411 4.56775 6.65411 5.95833ZM11 11.2292H7.33333C3.443 11.2292 2.0625 14.0773 2.0625 16.5175V19.25C2.0625 19.6295 2.3705 19.9375 2.75 19.9375C3.1295 19.9375 3.4375 19.6295 3.4375 19.25V16.5175C3.4375 15.5999 3.71892 12.6042 7.33333 12.6042H11C14.6144 12.6042 14.8958 15.599 14.8958 16.5175V19.25C14.8958 19.6295 15.2038 19.9375 15.5833 19.9375C15.9628 19.9375 16.2708 19.6295 16.2708 19.25V16.5175C16.2708 14.0773 14.8903 11.2292 11 11.2292Z" fill="currentColor"/>
        </svg>`,
      path: "referrals",
    },
    {
      id: 3,
      name: "About Us",
      svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.99998 19.8541C4.56598 19.8541 0.145813 15.434 0.145813 9.99998C0.145813 4.56598 4.56598 0.145813 9.99998 0.145813C15.434 0.145813 19.8541 4.56598 19.8541 9.99998C19.8541 15.434 15.434 19.8541 9.99998 19.8541ZM9.99998 1.52081C5.32406 1.52081 1.52081 5.32406 1.52081 9.99998C1.52081 14.6759 5.32406 18.4791 9.99998 18.4791C14.6759 18.4791 18.4791 14.6759 18.4791 9.99998C18.4791 5.32406 14.6759 1.52081 9.99998 1.52081ZM10.6875 14.125V9.93486C10.6875 9.55536 10.3795 9.24736 9.99998 9.24736C9.62048 9.24736 9.31248 9.55536 9.31248 9.93486V14.125C9.31248 14.5045 9.62048 14.8125 9.99998 14.8125C10.3795 14.8125 10.6875 14.5045 10.6875 14.125ZM10.935 6.79165C10.935 6.28565 10.5252 5.87498 10.0183 5.87498H10.0092C9.50316 5.87498 9.09696 6.28565 9.09696 6.79165C9.09696 7.29765 9.51233 7.70831 10.0183 7.70831C10.5243 7.70831 10.935 7.29765 10.935 6.79165Z" fill="currentColor"/>
        </svg>`,
      path: "about",
    },
    {
      id: 4,
      name: "Exit",
      svg: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.4375 15.5833V16.5C14.4375 18.7165 13.2165 19.9375 11 19.9375H5.5C3.2835 19.9375 2.0625 18.7165 2.0625 16.5V5.5C2.0625 3.2835 3.2835 2.0625 5.5 2.0625H11C13.2165 2.0625 14.4375 3.2835 14.4375 5.5V6.41667C14.4375 6.79617 14.1295 7.10417 13.75 7.10417C13.3705 7.10417 13.0625 6.79617 13.0625 6.41667V5.5C13.0625 4.05442 12.4456 3.4375 11 3.4375H5.5C4.05442 3.4375 3.4375 4.05442 3.4375 5.5V16.5C3.4375 17.9456 4.05442 18.5625 5.5 18.5625H11C12.4456 18.5625 13.0625 17.9456 13.0625 16.5V15.5833C13.0625 15.2038 13.3705 14.8958 13.75 14.8958C14.1295 14.8958 14.4375 15.2038 14.4375 15.5833ZM19.8843 11.2631C19.954 11.0953 19.954 10.9056 19.8843 10.7378C19.8495 10.6535 19.7991 10.5774 19.7359 10.5142L16.9859 7.76417C16.7173 7.49558 16.2818 7.49558 16.0132 7.76417C15.7447 8.03275 15.7447 8.46817 16.0132 8.73676L17.5899 10.3134H7.33333C6.95383 10.3134 6.64583 10.6214 6.64583 11.0009C6.64583 11.3804 6.95383 11.6884 7.33333 11.6884H17.5899L16.0132 13.2651C15.7447 13.5337 15.7447 13.9691 16.0132 14.2377C16.1471 14.3715 16.3231 14.4393 16.4991 14.4393C16.6751 14.4393 16.8511 14.3724 16.9849 14.2377L19.7349 11.4877C19.7991 11.4226 19.8495 11.3465 19.8843 11.2631Z" fill="currentColor"/>
        </svg>`,
      path: "#",
    },
  ];

  const pathname = usePathname();

  const handleTabClick = (id) => {
    setActiveTab(id);
  };

  return (
    <div className="bg-[#10141B]">
      <OtherNavbar />
      <div className="max-w-7xl px-4 mx-auto">
        <div className="lg:w-[60%] mt-7 flex overflow-x-auto items-center gap-4">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.path}
              className={`rounded-[12px] min-w-[200px] cursor-pointer px-4 py-3 flex items-center gap-2.5 transition-all duration-300 ease-in-out
        ${
          pathname.includes(tab.path)
            ? "bg-[#1D2431] text-white w-[30%]"
            : "text-[#71798A] hover:bg-[#1D2431] hover:text-white"
        }`}
            >
              <span
                className="text-2xl"
                dangerouslySetInnerHTML={{ __html: tab.svg }}
              ></span>
              <h1 className="font-semibold">{tab.name}</h1>
            </Link>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}
