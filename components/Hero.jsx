import React from "react";

const Hero = () => {
  return (
    <div id="/" className="max-w-[850px] mx-auto px-4 py-24 flex flex-col items-center text-center">
      <h1 className="lg:text-[74px] text-[34px] sm:text-5xl font-[700] leading-tight lg:leading-[76px]">
        The simplest way <br className="sm:block hidden" />to{" "}
        <span className="text-[#48FF2C] inline-block">earn interest</span> on
        your crypto holdings
      </h1>

      <p className="text-[#71798A] sm:text-[20px] py-10 font-semibold">
      We make staking as simple as online shopping
      </p>


      <button className="bg-[#48FF2C] hover:bg-[#46ce30] sm:min-h-[52px] flex items-center justify-center sm:text-[16px] text-sm rounded-lg sm:rounded-[12px] px-4 sm:px-7 py-1.5 sm:py-2 font-semibold text-black">
      Stake now
            </button>
    </div>
  );
};

export default Hero;
