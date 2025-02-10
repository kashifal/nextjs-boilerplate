import React, { useState } from "react";
import TopUp from "@/components/Topup";
import QRCodeModal from "@/components/QRmodal";
import Stake from "@/components/Stake";
import WithDrawCoin from "@/components/Conwithdraw";
// import WithdrawTo from "@/components/withdraw";
import StakingHistory from "@/components/StakingHistory";
import toast from "react-hot-toast";
import WithdrawModal from "@/components/WithdrawModal";

import Image from "next/image";
import { useEffect } from "react";
import axios from "axios";

// Add this function at the top of the file, after the imports
const getCoinBalance = (coinId, topups) => {
  if (!topups || !coinId) return 0;

  const coinTopups = topups.filter(
    (topup) => topup.coin === coinId && topup.status === "APPROVED"
  );

  const totalAmount = coinTopups.reduce((sum, topup) => sum + topup.amount, 0);

  return totalAmount;
};

const StackingBanner = () => {
  const [drawer, setdrawer] = useState(false);
  const [topups, setTopups] = useState([]);
  const [totalApprovedAmount, setTotalApprovedAmount] = useState(0);

  const [coins, setCoins] = useState([]);
  const [groupedCoins, setGroupedCoins] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [drawerOther2, setdrawerOther2] = useState(false);
  const [drawerOther3, setdrawerOther3] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(9 * 60); // 9 minutes in seconds

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch("/api/coin");
        const data = await response.json();
        if (data.coins) {
          const formattedCoins = data.coins.map((coin) => ({
            _id: coin._id, // Include the coin ID
            name: coin.name,
            icon: coin.logoUrl,
            amount: "0.00",
            symbol: coin.name,
            qrcode: coin.qrcode,
            walletAddress: coin.walletAddress,
          }));
          console.log(formattedCoins, "formattedCoins");
          setCoins(formattedCoins);
        }
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchCoins();
  }, []);

  const [selectedDuration, setSelectedDuration] = useState(60);
  const [lockedAmount, setLockedAmount] = useState("0.00");
  const [autoStaking, setAutoStaking] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [amount, setAmount] = useState(0.0);

  const durationOptions = [
    { days: 14, apr: "8.15%" },
    { days: 30, apr: "11.23%" },
    { days: 60, apr: "16.01%" },
    { days: 90, apr: "19.25%" },
    { days: 120, apr: "21.56%" },
    { days: 180, apr: "24.87%" },
  ];

  const end = () => {
    setdrawer(false);
    setdrawerOther3(false);
  };

  // Calculate dates
  const startDate = new Date().toLocaleDateString("en-GB");
  const endDate = new Date(
    Date.now() + selectedDuration * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-GB");

  // Get APR for selected duration
  const selectedAPR =
    durationOptions.find((opt) => opt.days === selectedDuration)?.apr ||
    "16.01%";

  const [drawerOther, setdrawerOther] = useState(false);

  const openOther = () => {
    handleSubmit();
  };

  const openOther2 = () => {
    setdrawerOther2(!drawerOther2);
    setdrawerOther(!drawerOther);
  };

  const openOther3 = () => {
    setdrawerOther3(!drawerOther3);
    setdrawerOther2(!drawerOther2);
  };

  const handleSubmit = async () => {
    // if (!selectedCoin || !amount) {
    //   toast.error("Please select a coin and enter amount");
    //   return;
    // }

    try {
      setIsSubmitting(true);

      const selectedCoinData = coins[selectedCoin];

      const response = await fetch("/api/topup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          coinId: selectedCoinData._id,
          user: JSON.parse(localStorage.getItem("user")).id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Topup submitted successfully");
      setdrawer(false);
      // Reset form
      setSelectedCoin(null);
      setAmount(0);
    } catch (error) {
      console.error("Error submitting topup:", error);
      toast.error(error.message || "Failed to submit topup");
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

      const response = await fetch("/api/topup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          coinId: selectedCoinData._id,
          user: JSON.parse(localStorage.getItem("user")).id,
          status: "PENDING",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Topup submitted successfully");
      setShowQRModal(false);
      setdrawer(false);
      // Reset form
      setSelectedCoin(null);
      setAmount(0);
    } catch (error) {
      console.error("Error submitting topup:", error);
      toast.error(error.message || "Failed to submit topup");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (showQRModal && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowQRModal(false); // Close modal when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 20000);

      return () => clearInterval(timer);
    }
  }, [showQRModal, timeLeft]);

  // Function to format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const fetchallCoins = async () => {
    const response = await fetch("/api/coin");
    const data = await response.json();
    setCoins(data.coins);
    console.log(data.coins);
  };
  const fetchTopups = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) return;

      const response = await fetch(`/api/topup?userId=${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch topups");

      const data = await response.json();
      setTopups(data.topups);
      console.log(data.topups);
    } catch (error) {
      console.error("Error fetching topups:", error);
    }
  };

  useEffect(() => {
    if (topups.length && coins.length) {
      // Group topups by coin name
      const grouped = coins.map((coin) => {
        const coinTopups = topups
          .filter((topup) => topup.coin === coin._id)
          .filter((topup) => topup.status === "APPROVED")
          .map((topup) => ({
            coin_id: topup._id,
            amount: topup.amount,
          }));

        const totalAmount = coinTopups.reduce(
          (sum, topup) => sum + topup.amount,
          0
        );

        return {
          ...coin,
          balance: totalAmount, // Add balance to coin object
        };
      });

      setCoins(grouped);
    }
  }, [topups]);

  useEffect(() => {
    fetchTopups();
    fetchallCoins();
  }, []);

  const open = () => {
    setdrawer(!drawer);
  };

  const [withdraw, setwithdraw] = useState(false);

  const withdrawHandler = () => {
    setwithdraw((prev) => !prev);
  };

  const getCoinById = (id) => {
    return coins.find((coin) => coin._id === id);
  };

  const calculateTotalApprovedAmount = async () => {
    console.log(topups, "mytopups");
    console.log(coins, "mycoins");

    try {
      if (!topups.length || !coins.length) {
        console.log("No topups or coins available");
        return;
      }

      let total = 0;
      const approvedTopups = topups.filter((t) => t.status === "APPROVED");

      if (approvedTopups.length === 0) {
        setTotalApprovedAmount("0.000");
        return;
      }

      // Process each approved topup
      for (const topup of approvedTopups) {
        const coin = getCoinById(topup.coin);
        console.log(coin, "coin");
        if (!coin) {
          console.log("Coin not found for topup:", topup);
          continue;
        }

        try {
          const response = await axios({
            method: "get",
            url: `https://rest.coinapi.io/v1/exchangerate/${coin.name}/USDT`,
            headers: {
              Accept: "text/plain",
              "X-CoinAPI-Key": process.env.NEXT_PUBLIC_COINAPI_KEY,
            },
          });

          const rate = response.data.rate;
          const usdtValue = topup.amount * rate;
          total += usdtValue;
          console.log(`Calculated value for ${coin.name}: ${usdtValue} USDT`);
        } catch (error) {
          console.error(`Error fetching rate for ${coin.name}:`, error);
          continue;
        }
      }

      setTotalApprovedAmount(total.toFixed(3));
    } catch (error) {
      console.error("Error calculating total in USDT:", error);
      setTotalApprovedAmount("0.000");
    }
  };

  useEffect(() => {
    // Initial calculation
    calculateTotalApprovedAmount();

    // Set up interval
    const interval = setInterval(calculateTotalApprovedAmount, 20000);

    // Cleanup
    return () => clearInterval(interval);
  }, [topups, coins]);

  // const gradientStyle = {
  //   background: "linear-gradient(135deg, #3096FE, #4F96DD, #5136B1, #7064C9)",
  // };

  const refreshAllData = async () => {
    try {
      setIsSubmitting(true); // Use existing loading state
      await Promise.all([
        fetchTopups(),
        fetchallCoins(),
        calculateTotalApprovedAmount(),
      ]);
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Set up interval
    calculateTotalApprovedAmount();
    const interval = setInterval(calculateTotalApprovedAmount, 20000);

    // Cleanup
    return () => clearInterval(interval);
  }, [topups, coins]);

  useEffect(() => {
    const interv = setInterval(refreshAllData, 20000);
    // Cleanup
    return () => clearInterval(interv);
  }, []);
                          
  const gradientStyle = {
    background: "linear-gradient(135deg, #3096FE, #4F96DD, #5136B1, #7064C9)",
  };          

  return (
    <>
      <div className="max-w-7xl px-4 mx-auto mt-10">
        {/* <StakingHistory /> */}
        <div style={gradientStyle} className="rounded-[12px] py-6 px-4">
          <div className="w-[93%] flex items-center justify-between gap-5 flex-wrap mx-auto">
            <div className="flex items-center gap-3">
              <div>
                <h4 className="text-[18px] font-medium">Total Balance</h4>
                <div className="flex items-center gap-5 mt-5">
                  <h1 className="font-[700] text-3xl sm:text-[40px]">
                    ${totalApprovedAmount}
                  </h1>
                  <div className="bg-[#CBF5E5] p-[9px] text-[#176448] font-medium text-sm sm:text-[17px] rounded-full">
                    +24%
                  </div>
                </div>
              </div>
              <button
                onClick={refreshAllData}
                disabled={isSubmitting}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                title="Refresh data"
              >
                <svg
                  className={`w-6 h-6 ${isSubmitting ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center flex-wrap gap-[11px]">
              <button
                onClick={open}
                className="bg-white text-sm font-medium text-black hover:bg-white/80 rounded-[10px] py-[11px] pl-4 pr-[21px] flex items-center gap-2"
              >
                <svg
                  width="8"
                  height="16"
                  viewBox="0 0 8 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.77503 5.10845C7.65337 5.23012 7.49334 5.29176 7.33334 5.29176C7.17334 5.29176 7.01332 5.23095 6.89165 5.10845L4.62501 2.84181V14.6668C4.62501 15.0118 4.34501 15.2918 4.00001 15.2918C3.65501 15.2918 3.37501 15.0118 3.37501 14.6668V2.84263L1.10837 5.10927C0.8642 5.35343 0.468338 5.35343 0.224171 5.10927C-0.0199955 4.8651 -0.0199955 4.46924 0.224171 4.22507L3.5575 0.891738C3.615 0.834238 3.68408 0.788517 3.76075 0.756851C3.91325 0.693517 4.08575 0.693517 4.23825 0.756851C4.31492 0.788517 4.3842 0.834238 4.4417 0.891738L7.77503 4.22507C8.0192 4.46924 8.0192 4.86429 7.77503 5.10845Z"
                    fill="#25314C"
                  />
                </svg>
                Top up
              </button>

              <button
                onClick={withdrawHandler}
                className="bg-white text-sm font-medium text-black hover:bg-white/80 rounded-[10px] py-[11px] pl-4 pr-[21px] flex items-center gap-2"
              >
                <svg
                  className="rotate-180"
                  width="8"
                  height="16"
                  viewBox="0 0 8 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.77503 5.10845C7.65337 5.23012 7.49334 5.29176 7.33334 5.29176C7.17334 5.29176 7.01332 5.23095 6.89165 5.10845L4.62501 2.84181V14.6668C4.62501 15.0118 4.34501 15.2918 4.00001 15.2918C3.65501 15.2918 3.37501 15.0118 3.37501 14.6668V2.84263L1.10837 5.10927C0.8642 5.35343 0.468338 5.35343 0.224171 5.10927C-0.0199955 4.8651 -0.0199955 4.46924 0.224171 4.22507L3.5575 0.891738C3.615 0.834238 3.68408 0.788517 3.76075 0.756851C3.91325 0.693517 4.08575 0.693517 4.23825 0.756851C4.31492 0.788517 4.3842 0.834238 4.4417 0.891738L7.77503 4.22507C8.0192 4.46924 8.0192 4.86429 7.77503 5.10845Z"
                    fill="#25314C"
                  />
                </svg>
                Withdraw money
              </button>

              <button
                onClick={() => {
                  setShowStakingModal(true);
                }}
                className="bg-[#48FF2C] shadow-sm text-sm font-medium text-black hover:bg-[#48FF2C]/80 rounded-[10px] py-[11px] pl-4 pr-[21px] flex items-center gap-2"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.25 9.25V4.75H10.75V9.25H15.25V10.75H10.75V15.25H9.25V10.75H4.75V9.25H9.25Z"
                    fill="black"
                  />
                </svg>
                New staking
              </button>
            </div>
          </div>
        </div>
      </div>

      {drawer && <TopUp drawer={drawer} setdrawer={setdrawer} />}

      {withdraw && <WithdrawModal drawer={withdraw} setdrawer={setwithdraw} />}

      {showStakingModal && (
        <StakingModal
          coins={coins}
          topups={topups}
          selectedCoin={selectedCoin}
          setSelectedCoin={setSelectedCoin}
          onClose={() => setShowStakingModal(false)}
          totalApprovedAmount={totalApprovedAmount}
        />
      )}
    </>
  );
};

// Rename and update the modal component

const StakingDetailsModal = ({
  coin,
  totalApprovedAmount,
  onClose,
  topups,
}) => {
  const [selectedDuration, setSelectedDuration] = useState(
    coin.durations[0]?.duration || 60
  );
  const [lockedAmount, setLockedAmount] = useState("");
  const [autoStaking, setAutoStaking] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate dates
  const startDate = new Date().toLocaleDateString("en-GB");
  const endDate = new Date(
    Date.now() + selectedDuration * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-GB");

  // Get selected APY from coin.durations
  const selectedAPY =
    coin.durations.find((opt) => opt.duration === selectedDuration)
      ?.percentage || 0;

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);

      const startDateObj = new Date();
      const endDateObj = new Date(
        startDateObj.getTime() + selectedDuration * 24 * 60 * 60 * 1000
      );

      const stakingInfo = {
        user: JSON.parse(localStorage.getItem("user")).id,
        coin: {
          name: coin?.name,
          id: coin?._id,
        },
        stakingDetails: {
          duration: parseInt(selectedDuration),
          apy: selectedAPY,
          lockedAmount: parseFloat(lockedAmount),
          autoStakingEnabled: autoStaking,
          startDate: startDateObj.toISOString(),
          endDate: endDateObj.toISOString(),
        },
      };

      const response = await fetch("/api/staking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stakingInfo),
      });

      if (!response.ok) {
        throw new Error("Failed to create stake");
      }

      // Refresh topups and close modal
      if (typeof window !== undefined) {
        window.location.reload();
      }
      // onClose();
      toast.success("Staking created successfully");
    } catch (error) {
      console.error("Error creating stake:", error);
      toast.error(error.message || "Failed to create stake");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the coin's balance
  const coinBalance = getCoinBalance(coin._id, topups);

  return (
    <div className="fixed z-[999999] inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-[32rem] rounded-lg overflow-auto bg-white p-6 max-h-[80vh] shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-black font-semibold">
            Stake {coin?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {/* <pre className="text-sm text-gray-800">{JSON.stringify(coin, null, 2)}</pre> */}
        <div className="mb-6">
          <h3 className="text-base text-black mb-4">Duration</h3>
          <div className="grid grid-cols-3 gap-3">
            {coin.durations.map(({ duration, percentage }, index) => (
              <button
                key={`${duration}-${index}`}
                onClick={() => setSelectedDuration(duration)}
                className={`p-3 rounded-lg border text-center ${
                  selectedDuration === duration
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <div className="font-medium text-black">{duration} Days</div>
                <div className="text-sm text-gray-500">{percentage}% APY</div>
              </button>
            ))}
          </div>
        </div>

        {/* <pre className="text-sm text-gray-800">{JSON.stringify(coin, null, 2)}</pre>
        <pre className="text-sm text-gray-800">{JSON.stringify(topups, null, 2)}</pre> */}

        <div className="mb-6">
          <h3 className="text-base text-black mb-2">Locked amount</h3>
          <div className="relative">
            <input
              type="number"
              value={lockedAmount}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (isNaN(value) || value <= coinBalance) {
                  setLockedAmount(e.target.value);
                }
              }}
              min="0"
              max={coinBalance}
              className="w-full p-3 text-black border border-gray-200 rounded-lg"
              placeholder="0.00"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <img
                src={`${coin?.logoUrl}`}
                alt={coin?.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-black">{coin?.name}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Available balance: {coinBalance.toFixed(2)} {coin?.name}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Minimum: 50 {coin?.name}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base text-black">Auto Staking</h3>
              <p className="text-sm text-gray-500 mt-1">
                Enable Auto-Staking to automatically restake expired products
                immediately.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoStaking}
                onChange={(e) => setAutoStaking(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base mb-4">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Stake start date:</span>
              <span>{startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Stake end date:</span>
              <span>{endDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated APY:</span>
              <span className="text-orange-500">{selectedAPY}%</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="rounded border-gray-300 text-green-500 focus:ring-green-500"
            />
            <span className="text-sm">
              I agree with{" "}
              <a href="#" className="text-blue-500">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-500">
                Privacy
              </a>
            </span>
          </label>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!agreeToTerms || !lockedAmount || isSubmitting}
          className="w-full py-3 bg-[#48FF2C] text-black font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating stake..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};

// Update StakingModal to show StakingDetailsModal after selection
const StakingModal = ({
  coins,
  selectedCoin,
  setSelectedCoin,
  onClose,
  totalApprovedAmount,
  topups,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleContinue = () => {
    setShowDetails(true);
  };

  if (showDetails) {
    return (
      <StakingDetailsModal
        coin={coins[selectedCoin]}
        topups={topups}
        totalApprovedAmount={totalApprovedAmount}
        onClose={() => {
          setShowDetails(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed z-[999999] inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-[24rem] md:w-[30rem] rounded-lg overflow-auto bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">
            Choose coin to stake
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              width={34}
              height={34}
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx={17} cy={17} r="16.5" stroke="#C5C5C5" />
              <path
                d="M22.4417 21.5583C22.6859 21.8025 22.6859 22.1984 22.4417 22.4425C22.32 22.5642 22.16 22.6258 22 22.6258C21.84 22.6258 21.68 22.565 21.5584 22.4425L17 17.8842L12.4417 22.4425C12.32 22.5642 12.16 22.6258 12 22.6258C11.84 22.6258 11.68 22.565 11.5584 22.4425C11.3142 22.1984 11.3142 21.8025 11.5584 21.5583L16.1167 17L11.5584 12.4417C11.3142 12.1975 11.3142 11.8017 11.5584 11.5575C11.8025 11.3133 12.1984 11.3133 12.4425 11.5575L17.0009 16.1159L21.5592 11.5575C21.8034 11.3133 22.1992 11.3133 22.4434 11.5575C22.6875 11.8017 22.6875 12.1975 22.4434 12.4417L17.885 17L22.4417 21.5583Z"
                fill="#C5C5C5"
              />
            </svg>
          </button>
        </div>
        <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {coins.map((coin, index) => {
            const balance = getCoinBalance(coin._id, topups);
            return (
              <div
                key={coin._id}
                onClick={() => setSelectedCoin(index)}
                className={`relative flex flex-col items-center text-center rounded-2xl border p-4 cursor-pointer ${
                  selectedCoin === index ? "border-green-500 bg-green-100" : ""
                }`}
              >
                <img
                  src={`${coin.logoUrl}`}
                  alt={coin.name}
                  className="rounded-full h-8 w-8"
                />
                <span className="text-sm font-medium mt-[20px] text-black">
                  {coin.name}
                </span>
                <span className="text-xs text-gray-500">
                  Balance: {balance.toFixed(2)}
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
            );
          })}
        </div>

        <button
          onClick={handleContinue}
          className="w-full rounded-lg bg-[#48FF2C] py-2 font-medium text-black hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedCoin === null}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// Withdrawal Management modal
const WithdrawalManagementModal = () => {
  return (
    <div>
      <h1>Withdrawal Management</h1>
    </div>
  );
};

export default StackingBanner;
