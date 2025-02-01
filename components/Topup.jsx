'use client'
import React, { useState, useEffect } from "react";
import QRCodeModal from "./QRmodal";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";


const TopUp = ({drawer , setdrawer}) => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [drawerOther2, setdrawerOther2] = useState(false)
  const [drawerOther3, setdrawerOther3] = useState(false)
  const [coins, setCoins] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(9 * 60); // 9 minutes in seconds

  // const coins = [
  //   { id: 1, name: "Bitcoin", color: "#F7931A", icon: <BitcoinIcon /> },
  //   { id: 2, name: "Tether (USDT)", color: "#50AF95", icon: <TetherIcon /> },
  //   { id: 3, name: "Doge", color: "#C2A633", icon: <DogeIcon /> },
  //   { id: 4, name: "Ethereum", color: "#343434", icon: <EthereumIcon /> },
  // ];
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('/api/coin');
        const data = await response.json();
        if (data.coins) {
          const formattedCoins = data.coins.map(coin => ({
            _id: coin._id, // Include the coin ID
            name: coin.name,
            icon: coin.logoUrl,
            amount: '0.00',
            symbol: coin.name,
            qrcode: coin.qrcode,
            walletAddress: coin.walletAddress
          }));
         console.log(formattedCoins,'formattedCoins');
         setCoins(formattedCoins)
        }
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    fetchCoins();
  }, []);

   const [selectedDuration, setSelectedDuration] = useState(60);
    const [lockedAmount, setLockedAmount] = useState("0.00");
    const [autoStaking, setAutoStaking] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [amount, setAmount] = useState(0.00);
 
  
    const durationOptions = [
      { days: 14, apr: "8.15%" },
      { days: 30, apr: "11.23%" },
      { days: 60, apr: "16.01%" },
      { days: 90, apr: "19.25%" },
      { days: 120, apr: "21.56%" },
      { days: 180, apr: "24.87%" },
    ];

    const end =() => {
      setdrawer(false)
      setdrawerOther3(false)
    }
 
  
    // Calculate dates
    const startDate = new Date().toLocaleDateString("en-GB");
    const endDate = new Date(
      Date.now() + selectedDuration * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-GB");
  
    // Get APR for selected duration
    const selectedAPR =
      durationOptions.find((opt) => opt.days === selectedDuration)?.apr ||
      "16.01%";

 

  const [drawerOther, setdrawerOther] = useState(false)
  
  const openOther = () => {
    
    handleSubmit();
  };
 

  
  const openOther2 = () => {
    setdrawerOther2(!drawerOther2)
    setdrawerOther(!drawerOther)
  }


  const openOther3 = () => {
    setdrawerOther3(!drawerOther3)
    setdrawerOther2(!drawerOther2)
  }

  const handleSubmit = async () => {
    // if (!selectedCoin || !amount) {
    //   toast.error("Please select a coin and enter amount");
    //   return;
    // }

    try {
      setIsSubmitting(true);
      
      const selectedCoinData = coins[selectedCoin];
      
      const response = await fetch('/api/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          coinId: selectedCoinData._id,
          user: JSON.parse(localStorage.getItem('user')).id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success('Topup submitted successfully');
      setdrawer(false);
      // Reset form
      setSelectedCoin(null);
      setAmount(0);
      
    } catch (error) {
      console.error('Error submitting topup:', error);
      toast.error(error.message || 'Failed to submit topup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    // if (!selectedCoin || !amount) {
    //   toast.error("Please select a coin and enter amount");
    //   return;
    // }
    setShowQRModal(true);
  };

  const handleConfirmDeposit = async () => {
    try {
      setIsSubmitting(true);
      
      const selectedCoinData = coins[selectedCoin];
      
      const response = await fetch('/api/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          coinId: selectedCoinData._id,
          user: JSON.parse(localStorage.getItem('user')).id,
          status: 'Awaiting approval'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success('Topup submitted successfully');
      setShowQRModal(false);
      setdrawer(false);
      // Reset form
      setSelectedCoin(null);
      setAmount(0);
      
    } catch (error) {
      console.error('Error submitting topup:', error);
      toast.error(error.message || 'Failed to submit topup');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (showQRModal && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowQRModal(false); // Close modal when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showQRModal, timeLeft]);

  // Function to format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <>
    {/* 1st modal for choose coin */}
    <div className="fixed z-[999999] inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-[24rem] md:w-[30rem] rounded-lg   overflow-auto bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">
            Choose coin to top up
          </h2>

          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={()=>setdrawer(false)}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="17" cy="17" r="16.5" stroke="#C5C5C5" />
              <path
                d="M22.4417 21.5583C22.6859 21.8025 22.6859 22.1984 22.4417 22.4425C22.32 22.5642 22.16 22.6258 22 22.6258C21.84 22.6258 21.68 22.565 21.5584 22.4425L17 17.8842L12.4417 22.4425C12.32 22.5642 12.16 22.6258 12 22.6258C11.84 22.6258 11.68 22.565 11.5584 22.4425C11.3142 22.1984 11.3142 21.8025 11.5584 21.5583L16.1167 17L11.5584 12.4417C11.3142 12.1975 11.3142 11.8017 11.5584 11.5575C11.8025 11.3133 12.1984 11.3133 12.4425 11.5575L17.0009 16.1159L21.5592 11.5575C21.8034 11.3133 22.1992 11.3133 22.4434 11.5575C22.6875 11.8017 22.6875 12.1975 22.4434 12.4417L17.885 17L22.4417 21.5583Z"
                fill="#C5C5C5"
              />
            </svg>
          </button>
        </div>
        <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {coins.map(({amount, icon, name, symbol}, index) => (
            <div
              key={index}
              onClick={() => setSelectedCoin(index)}
              className={`relative flex flex-col items-center text-center rounded-2xl border p-4 cursor-pointer ${
                selectedCoin === index ? "border-green-500 bg-green-100" : ""
              }`}
            >
             <img
              src={`${process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || ''}/${icon}`}
              fill
              className="rounded-full h-8 w-8"
            />
              <span className="text-sm font-medium mt-[20px] text-black">
                {name}
              </span>
              {selectedCoin === index && (
                <svg
                  width="25"
                  height="25"
                  className="absolute -top-2 -right-[6px]"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12.5"
                    cy="12.5"
                    r="11.75"
                    fill="white"
                    stroke="#34CA1D"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M11.25 15.5C11.2494 15.5 11.2489 15.5 11.2477 15.5C11.092 15.4994 10.9438 15.437 10.8347 15.3262L8.50137 12.9567C8.27503 12.7268 8.27795 12.3576 8.50779 12.1318C8.73762 11.9061 9.10628 11.9084 9.33262 12.1382L11.2535 14.0889L16.6715 8.67149C16.8996 8.44341 17.2683 8.44341 17.4964 8.67149C17.7244 8.89899 17.7244 9.26882 17.4964 9.49632L11.663 15.3297C11.5534 15.4387 11.4046 15.5 11.25 15.5Z"
                    fill="#34CA1D"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
        {/* Add remaining modal content here... */}

        <div className="mb-6">
          <label
            htmlFor="topup-amount"
            className="mb-2 block text-sm font-medium text-black"
          >
            Top up amount
          </label>
          <div className="flex items-center rounded-lg border px-4 py-2">
            <input
              id="topup-amount"
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              placeholder="0.00"
              className="flex-1 text-black border-r placeholder:text-[black] border-[#E1E1E1] outline-none"
            />
            <div className="ml-2 flex items-center space-x-2">
              {selectedCoin !== null && (
                <img 
                  src={coins[selectedCoin]?.icon} 
                  alt={coins[selectedCoin]?.name}
                  className="h-[30px] w-[30px] object-contain" 
                />
              )}
            </div>
          </div>
        </div>
        <button 
            onClick={handleContinue}  
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#48FF2C] py-2 font-medium text-black hover:bg-green-600 disabled:opacity-50"
          >
            Continue
          </button>
      </div>
    </div>

    {/* QR Code Modal */}
    {showQRModal && (
      <div className="fixed z-[999999] inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white rounded-2xl w-[30rem] p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium text-black">Deposit</span>
              <div className="flex items-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1.25C6.072 1.25 1.25 6.072 1.25 12C1.25 17.928 6.072 22.75 12 22.75C17.928 22.75 22.75 17.928 22.75 12C22.75 6.072 17.928 1.25 12 1.25ZM12 21.25C6.899 21.25 2.75 17.101 2.75 12C2.75 6.899 6.899 2.75 12 2.75C17.101 2.75 21.25 6.899 21.25 12C21.25 17.101 17.101 21.25 12 21.25ZM15.53 14.47C15.823 14.763 15.823 15.238 15.53 15.531C15.384 15.677 15.192 15.751 15 15.751C14.808 15.751 14.616 15.678 14.47 15.531L11.47 12.531C11.329 12.39 11.25 12.199 11.25 12.001V7.00098C11.25 6.58698 11.586 6.25098 12 6.25098C12.414 6.25098 12.75 6.58698 12.75 7.00098V11.6899L15.53 14.47Z" fill="#34CA1D"/>
                </svg>
                <span className="text-gray-500 text-sm ml-2">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <button onClick={() => setShowQRModal(false)} className="text-gray-500 hover:text-gray-700">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <circle cx="17" cy="17" r="16.5" stroke="#C5C5C5"/>
                <path d="M22.4415 21.5583C22.6856 21.8025 22.6856 22.1984 22.4415 22.4425C22.3198 22.5642 22.1598 22.6258 21.9998 22.6258C21.8398 22.6258 21.6798 22.565 21.5581 22.4425L16.9998 17.8842L12.4415 22.4425C12.3198 22.5642 12.1598 22.6258 11.9998 22.6258C11.8398 22.6258 11.6798 22.565 11.5581 22.4425C11.314 22.1984 11.314 21.8025 11.5581 21.5583L16.1165 17L11.5581 12.4417C11.314 12.1975 11.314 11.8017 11.5581 11.5575C11.8023 11.3133 12.1981 11.3133 12.4423 11.5575L17.0006 16.1159L21.559 11.5575C21.8031 11.3133 22.199 11.3133 22.4431 11.5575C22.6873 11.8017 22.6873 12.1975 22.4431 12.4417L17.8848 17L22.4415 21.5583Z" fill="#C5C5C5"/>
              </svg>
            </button>
          </div>

          {/* Coin Label */}
          <div className="flex items-center  justify-center gap-2 mb-6">
            {selectedCoin !== null && (
              <>
                <img 
                  src={`${process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || ''}/${coins[selectedCoin]?.icon}`} 
                  alt={coins[selectedCoin]?.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium text-black">{coins[selectedCoin]?.name}</span>
              </>
            )}
          </div>
         
          {/* QR Code */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              {/* Replace with actual QR code */}
              <div className=" bg-white">
                {/* Add your QR code here */}
                <img src={`${process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || ''}/${coins[selectedCoin]?.qrcode}`} alt="" />
              </div>
            </div>
            
            <div className="text-center space-y-4 w-full">
              <div>
                <p className="text-gray-500 mb-2">Amount needs to be transferred:</p>
                <p className="text-2xl font-bold text-black">{amount} {coins[selectedCoin]?.symbol}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 mb-2">To address:</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-black truncate">{coins[selectedCoin]?.walletAddress}</span>
                  <button onClick={()=>{
                    navigator.clipboard.writeText(coins[selectedCoin]?.walletAddress)
                  }} className="flex items-center text-black  px-4 py-2 rounded-lg">
                    <span  className="mr-2 text-sm">Copy address</span>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6zm0-2h8a4 4 0 014 4v11a4 4 0 01-4 4H6a4 4 0 01-4-4V5a4 4 0 014-4z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 mb-6">
            This address only be used to deposit compatible coin. Please be sure before depositing.
          </p>

          <button
            onClick={handleConfirmDeposit}
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#48FF2C] py-3 font-medium text-black hover:bg-green-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Confirm deposit'}
          </button>
        </div>
      </div>
    )}
  </>
  );
};

export default TopUp;
