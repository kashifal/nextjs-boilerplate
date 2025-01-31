import React from 'react';

const table = () => {
  const referralData = [
    {
      account: "ku***@***.com",
      signUpDate: "08.01.2025",
      didStake: "Yes",
      referralEarnings: "123 USDT",
      myReward: "25 USDT"
    },
    {
      account: "ku***@***.com",
      signUpDate: "08.01.2025",
      didStake: "No",
      referralEarnings: "0 USDT",
      myReward: "0 USDT"
    },
    {
      account: "ku***@***.com",
      signUpDate: "08.01.2025",
      didStake: "Yes",
      referralEarnings: "123 USDT",
      myReward: "25 USDT"
    },
    {
      account: "ku***@***.com",
      signUpDate: "08.01.2025",
      didStake: "Yes",
      referralEarnings: "123 USDT",
      myReward: "25 USDT"
    },
    {
      account: "ku***@***.com",
      signUpDate: "08.01.2025",
      didStake: "Yes",
      referralEarnings: "123 USDT",
      myReward: "25 USDT"
    },
    {
      account: "ku***@***.com",
      signUpDate: "08.01.2025",
      didStake: "Yes",
      referralEarnings: "123 USDT",
      myReward: "25 USDT"
    },
    {
      account: "ku***@***.com",
      signUpDate: "08.01.2025",
      didStake: "Yes",
      referralEarnings: "123 USDT",
      myReward: "25 USDT"
    },
    {
      account: "ku***@***.com",
      signUpDate: "08.01.2025",
      didStake: "Yes",
      referralEarnings: "123 USDT",
      myReward: "25 USDT"
    },
    {
      account: "ku***@***.com",
      signUpDate: "08.01.2025",
      didStake: "Yes",
      referralEarnings: "123 USDT",
      myReward: "25 USDT"
    }
  ];

  return (
    <div className=" py-20">
        <h1 className="font-[700] text-3xl sm:text-[42px] mb-10">Refferal history</h1>
    <div className='p-3 bg-[#191E25] rounded-lg'>
    <div className="w-full bg-[#242B35] rounded-lg p-6">
      <table className="w-full">
        <thead className=''>
          <tr className="text-left">
            <th className="text-[#8A94A6] font-normal pb-4">Friend's account</th>
            <th className="text-[#8A94A6] font-normal pb-4">Sign up date</th>
            <th className="text-[#8A94A6] font-normal pb-4">Did stake?</th>
            <th className="text-[#8A94A6] font-normal pb-4">Referral earnings</th>
            <th className="text-[#8A94A6] font-normal pb-4">My reward</th>
          </tr>
        </thead>
        <tbody>
          {referralData.map((row, index) => (
            <tr key={index} className="text-white">
              <td className="py-4">{row.account}</td>
              <td className="py-4">{row.signUpDate}</td>
              <td className="py-4">{row.didStake}</td>
              <td className="py-4">{row.referralEarnings}</td>
              <td className="py-4">{row.myReward}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    </div>
  );
};

export default table; 