'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StackingWorks from "@/components/StackingWorks";
import CorePrinciples from "@/components/CorePrinciples";
import Networks from "@/components/Networks";
import FAQs from "@/components/FAQs";
import Earning from "@/components/Earning";
import Footer from "@/components/Footer";
 

const Home = () => {
    // useAuth();
  return (
    <>
    <div className="bg-[#10141B] text-white min-h-screen w-full">
      <Navbar />
      <div id="hero">
        <Hero />
      </div>
      <StackingWorks />
      <div id="calculator">
        <Earning />
      </div>
      <div id="core-principles">
        <CorePrinciples />
      </div>
      <Networks />
      <div id="faq">
        <FAQs />
      </div>
      <Footer />
      </div>
    </>
  );
};

export default Home;
