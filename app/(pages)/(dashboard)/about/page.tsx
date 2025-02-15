import Footer from "@/components/Footer";
import React from "react";

function AboutPage() {
  return (
    <div className="bg-[#10141B] text-white justify-start items-center flex-col flex min-h-screen w-full">
      <div className="w-full max-w-7xl px-4 py-20 space-y-12">
        <section className="space-y-6">
          <h1 className="text-5xl font-bold">About StakeProFix</h1>
          <p className="text-lg leading-relaxed">
            Welcome to StakeProFix.com, your trusted platform for crypto staking and passive income. 
            Our mission is to provide a seamless, secure, and profitable staking experience for crypto 
            enthusiasts worldwide.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-semibold">Who We Are</h2>
          <p className="text-lg leading-relaxed">
            At StakeProFix, we are a team of blockchain experts and financial professionals dedicated 
            to helping users maximize their crypto earnings. Since our launch, we have been continuously 
            improving our platform, integrating new features, and expanding our staking options to meet 
            the needs of our growing community.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-semibold">How It Works</h2>
          <p className="text-lg leading-relaxed">
            Staking with StakeProFix is simple. Users can deposit their preferred cryptocurrency and 
            start earning daily dividends based on their staked amount and duration. The longer you 
            stake, the more you earn—it's that easy!
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-semibold">Why Choose StakeProFix?</h2>
          <ul className="space-y-3 text-lg">
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✅</span>
              <span><strong>Multiple Coins Supported</strong> – Stake a variety of cryptocurrencies with flexible options.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✅</span>
              <span><strong>Daily Earnings</strong> – Receive dividends based on the number of days you stake.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✅</span>
              <span><strong>Secure & Reliable</strong> – Built with top-tier security to ensure the safety of your funds.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✅</span>
              <span><strong>Transparent & Fair</strong> – No hidden fees, just straightforward staking rewards.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✅</span>
              <span><strong>Constant Improvement</strong> – We are committed to enhancing the platform, adding new features, and optimizing user experience day by day.</span>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-semibold">Our Vision</h2>
          <p className="text-lg leading-relaxed">
            Our goal is to make StakeProFix the go-to platform for staking, offering users a secure, 
            profitable, and easy-to-use staking experience. We believe in the power of blockchain and 
            decentralized finance, and we are here to help our users grow their assets effortlessly.
          </p>
        </section>

        <section className="text-center space-y-4">
          <p className="text-xl font-semibold">Join us today and start earning passive income with crypto staking!</p>
          <p className="text-2xl font-bold text-green-400">
            🚀 Stake smarter. Earn more. StakeProFix.com 🚀
          </p>
        </section>
      </div>
      
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}

export default AboutPage;
