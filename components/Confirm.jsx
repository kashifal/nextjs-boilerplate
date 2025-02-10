import React, { useState } from "react";


const Stake = () => {
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [lockedAmount, setLockedAmount] = useState('0.00');
  const [autoStaking, setAutoStaking] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);



  const durationOptions = [
    { days: 14, apr: '8.15%' },
    { days: 30, apr: '11.23%' },
    { days: 60, apr: '16.01%' },
    { days: 90, apr: '19.25%' },
    { days: 120, apr: '21.56%' },
    { days: 180, apr: '24.87%' },
  ];

  if (!isModalOpen) {
    return null;
  }

  // Calculate dates
  const startDate = new Date().toLocaleDateString('en-GB');
  const endDate = new Date(Date.now() + selectedDuration * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB');

  // Get APR for selected duration
  const selectedAPR = durationOptions.find(opt => opt.days === selectedDuration)?.apr || '16.01%';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-[30rem] p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 ">
          <span className="font-medium text-[black]">Stake Tether (USDT)</span>
          <button
            onClick={() => setIsModalOpen(false)}

          >
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="17" cy="17" r="16.5" stroke="#C5C5C5" />
              <path d="M22.4415 21.5583C22.6856 21.8025 22.6856 22.1984 22.4415 22.4425C22.3198 22.5642 22.1598 22.6258 21.9998 22.6258C21.8398 22.6258 21.6798 22.565 21.5581 22.4425L16.9998 17.8842L12.4415 22.4425C12.3198 22.5642 12.1598 22.6258 11.9998 22.6258C11.8398 22.6258 11.6798 22.565 11.5581 22.4425C11.314 22.1984 11.314 21.8025 11.5581 21.5583L16.1165 17L11.5581 12.4417C11.314 12.1975 11.314 11.8017 11.5581 11.5575C11.8023 11.3133 12.1981 11.3133 12.4423 11.5575L17.0006 16.1159L21.559 11.5575C21.8031 11.3133 22.199 11.3133 22.4431 11.5575C22.6873 11.8017 22.6873 12.1975 22.4431 12.4417L17.8848 17L22.4415 21.5583Z" fill="#C5C5C5" />
            </svg>

          </button>
        </div>

        {/* Duration Options */}
        <div className="mb-4">
          <span className="text-[14px] font-medium text-[black] mb-2 block">Duration</span>
          <div className="grid grid-cols-4 gap-2 ">
            {durationOptions.map((option) => (
              <button
                key={option.days}
                onClick={() => setSelectedDuration(option.days)}
                className={`p-2 rounded-lg border text-black text-[12px] font-semibold ${selectedDuration === option.days
                  ? 'border-[#00DC8A] bg-[#00DC8A]/10'
                  : 'border-gray-200'
                  }`}
              >
                <div>{option.days} Days</div>
                <div className="text-[12px] text-[#B0B0B0]">{option.apr} APY</div>
              </button>
            ))}
          </div>
        </div>

        {/* Locked Amount */}
        <div className="mb-4">
          <span className="text-[14px] font-semibold mb-2 block text-black">Locked amount</span>
          <div className='border py-2 flex rounded-xl'>
            <input
              id="topup-amount"
              type="number"
              placeholder="0.00"
              className=" w-[65%] border-r  px-2 placeholder:text-[black] border-[#E1E1E1] outline-none"
            />
            <div className='flex items-center space-x-2'>
              <svg width="31" height="31" className='ml-[10px]' viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="30" height="30" rx="15" fill="white" />
                <rect x="0.5" y="0.5" width="30" height="30" rx="15" stroke="#F1F1F1" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8.27487 7.32979L4.15026 15.9762C4.13456 16.0083 4.12959 16.0446 4.13606 16.0798C4.14254 16.115 4.16012 16.1472 4.18625 16.1717L15.3258 26.8247C15.3575 26.855 15.3996 26.8719 15.4435 26.8719C15.4873 26.8719 15.5294 26.855 15.5611 26.8247L26.7007 16.1724C26.7268 16.1479 26.7444 16.1157 26.7508 16.0805C26.7573 16.0453 26.7524 16.009 26.7367 15.9768L22.612 7.33046C22.5987 7.30142 22.5773 7.27682 22.5504 7.2596C22.5234 7.24238 22.4921 7.23327 22.4601 7.23335H8.42815C8.396 7.23295 8.36442 7.24184 8.33722 7.25896C8.31003 7.27607 8.28837 7.30067 8.27487 7.32979Z" fill="#50AF95" />
                <path fillRule="evenodd" clipRule="evenodd" d="M16.8749 16.8641C16.7949 16.87 16.3817 16.8947 15.4601 16.8947C14.727 16.8947 14.2065 16.8727 14.0239 16.8641C11.1908 16.7397 9.0762 16.2475 9.0762 15.6582C9.0762 15.0689 11.1908 14.5774 14.0239 14.4511V16.3739C14.2091 16.3872 14.7396 16.4184 15.4727 16.4184C16.3524 16.4184 16.7929 16.3819 16.8722 16.3745V14.4524C19.6993 14.5781 21.8093 15.0703 21.8093 15.6582C21.8093 16.2462 19.7 16.7384 16.8722 16.8634L16.8749 16.8641ZM16.8749 14.2535V12.5329H20.8202V9.90906H10.0785V12.5329H14.0232V14.2529C10.8169 14.3998 8.40576 15.0337 8.40576 15.7932C8.40576 16.5528 10.8169 17.186 14.0232 17.3336V22.8473H16.8742V17.3316C20.0732 17.1846 22.4804 16.5515 22.4804 15.7926C22.4804 15.0337 20.0752 14.4005 16.8742 14.2529L16.8749 14.2535Z" fill="white" />
              </svg>

              <p className='text-black text-[14px]'>Tether (USDT)</p>
            </div>
          </div>
          <div className="text-[14px] text-gray-500 mt-[16px] border-b pb-2">
            Available balance: <span className='text-[#0AA4F1]'>50 USDT</span>
          </div>
        </div>

        {/* Locked Amount Limits */}
        <div className="mb-4">
          <span className="text-[14px] font-semibold mb-2 block text-[black]">Locked amount limits</span>
          <div className="text-sm text-gray-500  border-b border-dashed  pb-2">
            Minimum: <span className='text-[black] font-medium'>50 USDT</span>
          </div>
        </div>

        {/* Auto Staking */}
        <div className=" items-center  mb-2 border-b border-dashed pb-4">
          <div>
            <div className="font-medium mb-1 text-[14px] flex justify-between w-[full] text-[black]">Auto Staking
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoStaking}
                  onChange={() => setAutoStaking(!autoStaking)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00DC8A]"></div>
              </label>
            </div>
            <div className="text-xs text-gray-500 max-w-[300px]">
              Enable Auto-Staking to automatically restake a product that has expired to its previous staking immediately.
            </div>
          </div>

        </div>

        {/* Summary */}
        <div className="mb-6">
          <span className="font-medium text-[14px] mb-2 block text-[black]">Summary</span>
          <div className="space-y-2 text-sm">
            <div className="flex ">
              <span className="text-gray-500">Stake start date:</span>
              <span className='text-[black] font-medium ml-[10px]'>21.01.2025</span>
            </div>
            <div className="flex ">
              <span className="text-gray-500">Stake end date:</span>
              <span className='text-[black] font-medium ml-[10px]'>21.01.2025</span>
            </div>
            <div className="flex ">
              <span className="text-gray-500">Estimated APY:</span>
              <span className='text-[#F7931A] font-semibold ml-[10px]'>16.01%</span>
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2 mb-6">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={() => setAgreeToTerms(!agreeToTerms)}
            className="mt-1 h-[14px] w-[14px]"
          />
          <span className="text-[15px] text-gray-500">
            I agree with <a href="#" className="text-[#0F98CE]">Terms</a> and <a href="#" className="text-[#0F98CE]">Privacy</a>
          </span>
        </div>

        {/* Confirm Button */}
        <button className="w-full rounded-lg bg-[#48FF2C] py-2 font-medium text-black hover:bg-green-600">Continue</button>
      </div>
    </div>
  );
};

export default Stake;