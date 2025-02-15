'use client'
import React, { useState } from "react";

const FAQs = () => {
  const faqData = [
    {
      id: 1,
      question: "What is staking?",
      answer: `Staking is the process of participating in a proof-of-stake (PoS) blockchain network by locking up a certain amount of cryptocurrency to support the operations of the network, such as validating transactions and securing the network. In return, participants earn rewards, typically in the form of additional cryptocurrency.`,
    },
    {
      id: 2,
      question: "What is PoS and how does it work?",
      answer: `To start staking, you need to choose a staking provider, create an account, and then deposit the cryptocurrency you want to stake. The provider will typically give you instructions on how to delegate or lock up your coins to participate in staking.`,
    },
    {
      id: 3,
      question: "What is Validator",
      answer: `The risks of staking include potential loss of funds due to network vulnerabilities, staking provider issues, or volatility in cryptocurrency prices. Additionally, staked coins may be locked for a specific period, limiting your ability to access them.`,
    },
    {
      id: 4,
      question: "How staking can be profitable",
      answer: `While some networks allow you to unstake your coins at any time, others have lock-up periods during which your coins cannot be accessed. It is important to check the specific terms and conditions of the staking network before getting involved.`,
    },
    {
      id: 5,
      question: "What are the decentralized staking benefits?",
      answer: `While some networks allow you to unstake your coins at any time, others have lock-up periods during which your coins cannot be accessed. It is important to check the specific terms and conditions of the staking network before getting involved.`,
    },
  ];

  const [activeFAQ, setActiveFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setActiveFAQ((prevActiveFAQ) => (prevActiveFAQ === id ? null : id));
  };

  return (
    <div id="#faq" className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="sm:text-[42px] text-3xl font-[700]">FAQ</h1>
      <div className="max-w-[914px] mt-10">
        {faqData.map((faq ,idx) => (
          <div key={faq.id} className={`border-b ${idx === 4 ? 'border-none' : 'border-b'} border-[#22252A] py-4`}>
            <div className="flex items-center justify-between  gap-2">
              <div className="w-[85%]">
                <h1
                  className="text-[18px] hover:text-white sm:text-[20px] font-[700] cursor-pointer"
                  onClick={() => toggleFAQ(faq.id)}
                  style={{
                    color: activeFAQ === faq.id ? "#fff" : "#71798A",
                  }}
                >
                  {faq.question}
                </h1>
                {activeFAQ === faq.id && (
                  <p className="font-medium mt-5 sm:text-[16px] text-sm">
                    {faq.answer}
                  </p>
                )}
              </div>

              <div
                className="cursor-pointer"
                style={{
                  color: activeFAQ === faq.id ? "#48FF2C" : "#71798A",
                  transform:
                    activeFAQ === faq.id ? "rotate(0deg)" : "rotate(180deg)",
                }}
                onClick={() => toggleFAQ(faq.id)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 15.75C18.808 15.75 18.616 15.6771 18.47 15.5301L12 9.06008L5.53005 15.5301C5.23705 15.8231 4.76202 15.8231 4.46902 15.5301C4.17602 15.2371 4.17602 14.762 4.46902 14.469L11.469 7.46902C11.762 7.17602 12.2371 7.17602 12.5301 7.46902L19.5301 14.469C19.8231 14.762 19.8231 15.2371 19.5301 15.5301C19.3841 15.6771 19.192 15.75 19 15.75Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="font-medium mt-10 text-[#71798A]">
        Can’t find what are you looking for?{" "}
        <a href="#" className="underline text-[#48FF2C] font-medium">
          Contact support
        </a>
      </div>
    </div>
  );
};

export default FAQs;
