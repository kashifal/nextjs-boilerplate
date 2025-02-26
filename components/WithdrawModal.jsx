'use client'
import React, { useState, useEffect } from "react";
import QRCodeModal from "./QRmodal";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";


const WithdrawModal = ({drawer , setdrawer}) => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [drawerOther2, setdrawerOther2] = useState(false)
  const [drawerOther3, setdrawerOther3] = useState(false)
  const [coins, setCoins] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(9 * 60); // 9 minutes in seconds
  const [walletAddress, setWalletAddress] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [userBalances, setUserBalances] = useState({});
  const [availableBalance, setAvailableBalance] = useState(0);
  const [amount, setAmount] = useState(50);

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

  useEffect(() => {
    const fetchUserBalances = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user')).id;
        const response = await fetch(`/api/topup?userId=${userId}`);
        const data = await response.json();
        
        // Calculate total balance for each coin
        const balances = {};
        data.topups.forEach(topup => {
          if (topup.status === 'APPROVED') {
            if (!balances[topup.coin]) {
              balances[topup.coin] = 0;
            }
            balances[topup.coin] += topup.amount;
          }
        });

        // Subtract pending withdrawals
        const withdrawalResponse = await fetch(`/api/withdrawal?userId=${userId}`);
        const withdrawalData = await withdrawalResponse.json();
        
        withdrawalData.withdrawals.forEach(withdrawal => {
          if (withdrawal.status === 'PENDING') {
            if (balances[withdrawal.coin]) {
              balances[withdrawal.coin] -= withdrawal.amount;
            }
          }
        });
        
        setUserBalances(balances);
      } catch (error) {
        console.error('Error fetching user balances:', error);
        toast.error('Failed to fetch available balances');
      }
    };

    fetchUserBalances();
  }, []);

   const [selectedDuration, setSelectedDuration] = useState(60);
    const [lockedAmount, setLockedAmount] = useState("0.00");
    const [autoStaking, setAutoStaking] = useState(false);
 
  
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
          amount: 50,
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

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value > availableBalance) {
      toast.error('Amount exceeds available balance');
      return;
    }
    setAmount(value);
  };

  const handleWithdrawel = async () => {
    try {
      // Validations
      if (!selectedCoin && selectedCoin !== 0) {
        toast.error('Please select a coin');
        return;
      }

      if (!amount || isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      if (!walletAddress || walletAddress.trim() === '') {
        toast.error('Please enter a valid wallet address');
        return;
      }

      if (amount > availableBalance) {
        toast.error('Amount exceeds available balance');
        return;
      }

      setIsSubmitting(true);
      const selectedCoinData = coins[selectedCoin];

      const response = await fetch('/api/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          coinId: selectedCoinData._id,
          user: JSON.parse(localStorage.getItem('user')).id,
          walletAddress: walletAddress.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success('Withdrawal request submitted successfully');
      setShowQRModal(false);
      setdrawer(false);
      // Reset form
      setSelectedCoin(null);
      setAmount('');
      setWalletAddress('');
      
    } catch (error) {
      console.error('Error in withdrawal process:', error);
      toast.error(error.message || 'Failed to submit withdrawal');
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

  const handleCoinSelect = (index) => {
    setSelectedCoin(index);
    const coinId = coins[index]._id;
    const balance = userBalances[coinId] || 0;
    setAvailableBalance(balance);
  };

  return (
    <>
    {/* 1st modal for choose coin */}
    <div className="fixed z-[999999] inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-[24rem] md:w-[30rem] rounded-lg   overflow-auto bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">
          Choose coin to withdraw
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
              onClick={() => handleCoinSelect(index)}
              className={`relative flex flex-col items-center text-center rounded-2xl border p-4 cursor-pointer ${
                selectedCoin === index ? "border-green-500 bg-green-100" : ""
              }`}
            >
              <img
                src={`${icon}`}
                fill
                className="rounded-full h-8 w-8"
              />
              <span className="text-sm font-medium mt-2 text-black">
                {name}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                Available: {userBalances[coins[index]._id]?.toFixed(2) || '0.00'} {symbol}
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
      <div className="fixed z-[100000000] inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white rounded-2xl w-[24rem] p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg text-gray-700 font-semibold">Withdrawal</h2>
            <button onClick={() => setShowQRModal(false)} className="text-gray-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Wallet Address Input */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm text-gray-700 mb-2">Wallet address</label>
            <input 
              type="text" 
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address"
              className="w-full p-3 border text-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">Withdrawal amount</label>
            <div className="relative">
              <input 
                type="number" 
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full p-3 border text-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <img 
                  src={coins[selectedCoin]?.icon} 
                  alt="" 
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-gray-700">{coins[selectedCoin]?.name}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Available balance: <span className="text-blue-500">
                {availableBalance.toFixed(2)} {coins[selectedCoin]?.symbol}
              </span>
            </p>
          </div>

          {/* Withdrawal Limits */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm mb-2">Withdrawal limits</label>
            <p className="text-sm text-gray-500">
              Minimum: <span>52 USDT</span>
            </p>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm mb-4   text-gray-700">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Withdrawal amount:</span>
                <span className="text-gray-700">{amount} {coins[selectedCoin]?.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Commission:</span>
                <span className="text-gray-700">2%</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-500">Total withdrawal:</span>
                <span className="text-yellow-500">{amount - (amount * 0.02)} {coins[selectedCoin]?.symbol}</span>
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="mb-6">
            <label className="flex text-gray-700 items-center gap-2">
              <input 
                type="checkbox" 
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">
                I agree with <a href="#" className="text-blue-500">Terms</a> and <a href="#" className="text-blue-500">Privacy</a>
              </span>
            </label>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleWithdrawel}
            disabled={!agreeToTerms || isSubmitting}
            className="w-full rounded-lg bg-[#48FF2C] py-3 font-medium text-black hover:bg-green-600 disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    )}
  </>
  );
};

export default WithdrawModal;
