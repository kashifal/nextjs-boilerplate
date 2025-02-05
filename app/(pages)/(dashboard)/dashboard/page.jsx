"use client";

import React from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import StackingBanner from "@/components/StackingBanner";
import Footer from "@/components/Footer";
import StakingHistory from "@/components/StakingHistory";

const Stacking = () => {
  useAdminAuth(false);

  return (
    <>
      <div className="bg-[#10141B] text-white min-h-screen w-full">
        <StackingBanner />
        <StakingHistory />
        <Footer />
      </div>
    </>
  );
};

export default Stacking;
