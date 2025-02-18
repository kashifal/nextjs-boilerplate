import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const StakingAssets = ({stats}) => {

  const [topups, setTopups] = useState([]);
  const [coins, setCoins] = useState([]);
  const [groupedCoins, setGroupedCoins] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [selectedTopup, setSelectedTopup] = useState({});
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalApprovedAmount, setTotalApprovedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotalApprovedAmount = () => {
    const total = topups
      .filter(topup => topup.status === 'APPROVED')
      .reduce((sum, topup) => sum + topup.amount, 0);
    setTotalApprovedAmount(total);
  };

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user');
      const data = await response.json();
      setUsers(data.users);
      console.log(data.users, 'users');
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }
  const fetchallCoins = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/coin');
      const data = await response.json();
      setCoins(data.coins);
      console.log(data.coins, 'coins');
    } catch (error) {
      console.error('Error fetching coins:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTopups = async () => {
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`/api/topup`);
      if (!response.ok) throw new Error('Failed to fetch topups');

      const data = await response.json();
      setTopups(data.topups);
      console.log(data.topups);
    } catch (error) {
      console.error('Error fetching topups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (topups.length && coins.length) {
      // Group topups by coin name
      const grouped = coins.reduce((acc, coin) => {
        const coinTopups = topups
          .filter(topup => topup.coin === coin._id)
          .map(topup => ({
            coin_id: topup._id,
            amount: topup.amount
          }));

        if (coinTopups.length > 0) {
          const totalAmount = coinTopups.reduce((sum, topup) => sum + topup.amount, 0);

          acc.push({
            coin_name: coin.name.toLowerCase(),
            coins_data: coinTopups,
            total_amount: totalAmount
          });
        }

        return acc;
      }, []);

      // Calculate total balance across all coins
      const overallTotal = grouped.reduce((sum, coin) => sum + coin.total_amount, 0);

      setGroupedCoins(grouped);
      setTotalBalance(overallTotal);

      console.log('Grouped coins:', grouped);
      console.log('Total balance across all coins:', overallTotal);
    }
  }, [topups, coins]);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTopups = topups.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(topups.length / itemsPerPage);

  // Generate page numbers array
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle page navigation
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const getCoinById = (id) => {
    return coins.find(coin => coin._id === id);
  }

   

  
  const getCoinWalletAddress = (id) => {
    const coin = coins.find(coin => coin._id === id);
    return coin ? coin.walletAddress : null;
  }
  useEffect(() => {
    fetchTopups();
    fetchallCoins();
    fetchAllUsers();
  }, []);

  

  useEffect(() => {
    if (topups.length) {
      calculateTotalApprovedAmount();
    }
  }, [topups]);

  const [drawer, setdrawer] = useState(false)

  const open = ({ coin, status, amount, user, _id, createdAt }) => {
    setdrawer(prev => !prev)
    console.log(_id, 'id');

    setSelectedTopup({ coin, status, amount, user, _id, createdAt })
  }

  const getDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }


 
  const getUserById = (id) => {
    const user = users.find(user => user._id === id);
    return user ? user.username : null;
  }


  const handleConfirmTopup = async () => {
    try {
      const response = await fetch(`/api/topup/${selectedTopup._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'CONFIRMED' })
      });

      if (!response.ok) {
        throw new Error('Failed to confirm topup');
      }

      // Refresh topups list
      await fetchTopups();
      // Close drawer
      setdrawer(false);
    } catch (error) {
      console.error('Error confirming topup:', error);
      // Handle error (show toast/alert)
    }
  };

  const handleRefuseTopup = async () => {
    try {
      const response = await fetch(`/api/topup/${selectedTopup._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REFUSED' })
      });

      if (!response.ok) {
        throw new Error('Failed to refuse topup');
      }

      // Refresh topups list
      await fetchTopups();
      // Close drawer
      setdrawer(false);
    } catch (error) {
      console.error('Error refusing topup:', error);
      // Handle error (show toast/alert)
    }
  };


  const [hideInfo, setHideInfo] = useState([])
  const toggleRowInfo = (id) => {
    setHideInfo(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    )
  }

  



  const refreshAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchTopups(),
        fetchallCoins(),
        fetchAllUsers()
      ]);
      calculateTotalApprovedAmount();
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F0F1F1] p-6 text-black">

      {/* <pre>{JSON.stringify(stats.coinStakings, null, 2)}</pre> */}
      
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Staking assets</h2>
        <button 
          onClick={refreshAllData}
          disabled={isLoading}
          className="p-2 rounded-full hover:bg-white transition-colors"
          title="Refresh data"
        >
          <svg 
            className={`w-6 h-6 text-gray-600 ${isLoading ? 'animate-spin' : ''}`}
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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-3">
            <svg 
              className="animate-spin h-6 w-6 text-gray-600"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      )}

      {/* Assets Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Ethereum Card */}

        {
          stats?.coinStakings?.map(({coinName,totalStaked,logoUrl,totalStakedUSDT,totalProfit,totalProfitUSDT,numberOfStakes }) => (
<div key={coinName} className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="">
              <img className="size-12" src={logoUrl} alt="" />
             
                 
            </div>
            <span className="font-semibold">{coinName} ({coinName})</span>
          </div>
          {/* <pre>{JSON.stringify(stats, null, 2)}</pre> */}
          <div>
            <span className="text-gray-500 text-sm">Staked</span>
            <p className="text-xl font-semibold">{totalStaked} {coinName}</p>
          </div>
        </div>
          ))
        }
        

         
      </div>

      {/* <pre>
        {JSON.stringify(coins, null, 2)}
      </pre>
      <pre>
        {JSON.stringify(topups, null, 2)}
      </pre> */}

      <h2 className="text-xl font-semibold mb-4">Topup requests</h2>


      {/* Table Section */}
      <div className="bg-white rounded-xl">
        {/* Table Header */}
        <div className="grid grid-cols-3 md:grid-cols-6 p-4 border-b bg-[#F9F9FC]">
          <div className="col-span-1">User</div>
          <div className="col-span-1 md:flex hidden">Date</div>
          <div className="col-span-1">Coin</div>
          <div className="col-span-1">Top up amount</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 md:flex hidden">Info</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y">
        {/* <pre>{JSON.stringify(currentTopups, null, 2)}</pre> */}
          {/* Row 1 */}
          {currentTopups.map(({ coin, status, amount, user, _id, createdAt }) => (
            <div key={_id} className={`grid grid-cols-6 p-4 items-center ${hideInfo.includes(_id) ? 'opacity-30' : 'opacity-100'} transition-opacity duration-200`}>
           
              <div className="col-span-1 flex items-center gap-2">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="44"
                    height="44"
                    rx="8"
                    fill="url(#pattern0_214_30397)"
                  />
                  <defs>
                    <pattern
                      id="pattern0_214_30397"
                      patternContentUnits="objectBoundingBox"
                      width="1"
                      height="1"
                    >
                      <use
                        href="#image0_214_30397"
                        transform="scale(0.0025)"
                      />
                    </pattern>
                  </defs>
                </svg>

                    <div>
                  
                      <p className="font-medium">{getUserById(user)}</p>
                      <p className="text-sm text-gray-500 md:flex hidden">{getDate(createdAt)}</p>
                    </div>
                  </div>
                  <div className="col-span-1 md:flex hidden">{getDate(createdAt)}</div>
                  <div className="col-span-1 text-gray-800">{getCoinById(coin)?.name}</div>
                  <div className="col-span-1 font-semibold text-orange-500">{amount} {getCoinById(coin)?.name}</div>
                  <div onClick={() => open({ coin, status, amount, user, _id, createdAt })} className="col-span-1 flex border px-2 items-center w-[160px] py-1 rounded-lg">

                    {
                      status === 'REFUSED' ? (
                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.75 12C3.4362 12 0.75 9.3138 0.75 6C0.75 2.6862 3.4362 0 6.75 0C10.0638 0 12.75 2.6862 12.75 6C12.75 9.3138 10.0638 12 6.75 12ZM6.75 5.1516L5.0532 3.4542L4.2042 4.3032L5.9016 6L4.2042 7.6968L5.0532 8.5458L6.75 6.8484L8.4468 8.5458L9.2958 7.6968L7.5984 6L9.2958 4.3032L8.4468 3.4542L6.75 5.1516Z" fill="#DF1C41" />
                        </svg>
                      ) : status === 'APPROVED' ? (
                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.75 12C3.4362 12 0.75 9.3138 0.75 6C0.75 2.6862 3.4362 0 6.75 0C10.0638 0 12.75 2.6862 12.75 6C12.75 9.3138 10.0638 12 6.75 12ZM6.1518 8.4L10.3938 4.1574L9.5454 3.309L6.1518 6.7032L4.4544 5.0058L3.606 5.8542L6.1518 8.4Z" fill="#38C793" />
                        </svg>

                  ) : (
                    <svg
                      width="13"
                      height="12"
                      viewBox="0 0 13 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.75 12C3.4362 12 0.75 9.3138 0.75 6C0.75 2.6862 3.4362 0 6.75 0C10.0638 0 12.75 2.6862 12.75 6C12.75 9.3138 10.0638 12 6.75 12ZM7.35 6V3H6.15V7.2H9.75V6H7.35Z"
                        fill="#F27B2C"
                      />
                    </svg>
                  )}

                <span className="  rounded-full text-sm ml-[7px]">
                  {status}
                </span>
              </div>
              <div className="col-span-1 md:flex hidden">
                <button onClick={() => toggleRowInfo(_id)} className="text-gray-400 hover:text-gray-600">
                  {hideInfo.includes(_id) ? (
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.4855 6.13794C18.1725 3.93894 15.2254 0.25 10.2504 0.25C5.27536 0.25 2.32825 3.93894 1.01525 6.13794C0.32825 7.28594 0.32825 8.71306 1.01525 9.86206C2.32825 12.0611 5.27536 15.75 10.2504 15.75C15.2254 15.75 18.1725 12.0611 19.4855 9.86206C20.1725 8.71306 20.1725 7.28694 19.4855 6.13794ZM18.1984 9.09204C17.0484 11.018 14.4854 14.25 10.2504 14.25C6.01536 14.25 3.45236 11.019 2.30236 9.09204C1.90036 8.41804 1.90036 7.58098 2.30236 6.90698C3.45236 4.98098 6.01536 1.74902 10.2504 1.74902C14.4854 1.74902 17.0484 4.97998 18.1984 6.90698C18.6014 7.58198 18.6014 8.41804 18.1984 9.09204Z" fill="#A0AEC0"/>
                    </svg>
                  ) : (
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.4855 6.13794C18.1725 3.93894 15.2254 0.25 10.2504 0.25C5.27536 0.25 2.32825 3.93894 1.01525 6.13794C0.32825 7.28594 0.32825 8.71306 1.01525 9.86206C2.32825 12.0611 5.27536 15.75 10.2504 15.75C15.2254 15.75 18.1725 12.0611 19.4855 9.86206C20.1725 8.71306 20.1725 7.28694 19.4855 6.13794ZM18.1984 9.09204C17.0484 11.018 14.4854 14.25 10.2504 14.25C6.01536 14.25 3.45236 11.019 2.30236 9.09204C1.90036 8.41804 1.90036 7.58098 2.30236 6.90698C3.45236 4.98098 6.01536 1.74902 10.2504 1.74902C14.4854 1.74902 17.0484 4.97998 18.1984 6.90698C18.6014 7.58198 18.6014 8.41804 18.1984 9.09204ZM10.2504 3.75C7.90636 3.75 6.00036 5.657 6.00036 8C6.00036 10.343 7.90636 12.25 10.2504 12.25C12.5944 12.25 14.5004 10.343 14.5004 8C14.5004 5.657 12.5944 3.75 10.2504 3.75ZM10.2504 10.75C8.73336 10.75 7.50036 9.517 7.50036 8C7.50036 6.483 8.73336 5.25 10.2504 5.25C11.7674 5.25 13.0004 6.483 13.0004 8C13.0004 9.517 11.7674 10.75 10.2504 10.75Z" fill="#A0AEC0"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}




        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t">
          <span className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, topups.length)} from {topups.length}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-2 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              <svg
                width="5"
                height="9"
                viewBox="0 0 5 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.75275 7.84436L0.497754 4.58353C0.389108 4.47423 0.328125 4.32639 0.328125 4.17228C0.328125 4.01817 0.389108 3.87032 0.497754 3.76103L3.75275 0.500196C3.83435 0.417929 3.93859 0.361824 4.05219 0.339033C4.16579 0.316242 4.28361 0.327799 4.39062 0.37223C4.49763 0.41666 4.58898 0.491952 4.65303 0.588505C4.71708 0.685058 4.75093 0.798498 4.75025 0.914363V7.43019C4.75093 7.54606 4.71708 7.6595 4.65303 7.75605C4.58898 7.85261 4.49763 7.9279 4.39062 7.97233C4.28361 8.01676 4.16579 8.02832 4.05219 8.00553C3.93859 7.98273 3.83435 7.92663 3.75275 7.84436Z"
                  fill="#1D1F2C"
                />
              </svg>
            </button>
            
            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`px-2 py-1 rounded ${
                  currentPage === number 
                    ? 'bg-gray-900 text-white' 
                    : 'border hover:bg-gray-100'
                }`}
              >
                {number}
              </button>
            ))}

            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              <svg
                width="5"
                height="9"
                viewBox="0 0 5 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.25 7.42931V0.91231C0.250025 0.796956 0.28425 0.684199 0.348349 0.588293C0.412448 0.492388 0.503543 0.417639 0.610118 0.373498C0.716692 0.329358 0.833961 0.317806 0.9471 0.340304C1.06024 0.362801 1.16417 0.418338 1.24575 0.499894L4.50424 3.75839C4.6136 3.86779 4.67503 4.01613 4.67503 4.17081C4.67503 4.32549 4.6136 4.47384 4.50424 4.58323L1.24575 7.84173C1.16417 7.92328 1.06024 7.97882 0.9471 8.00132C0.833961 8.02381 0.716692 8.01226 0.610118 7.96812C0.503543 7.92398 0.412448 7.84923 0.348349 7.75333C0.28425 7.65742 0.250025 7.54466 0.25 7.42931Z"
                  fill="#1D1F2C"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
          <div className="relative w-full max-w-[446px] rounded-3xl bg-white px-3 py-6 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-semibold text-[#000000]">Top up request</h3>
                <p className="text-[14px] font-semibold text-[#77849B]">{getDate(selectedTopup.createdAt)}</p>
              </div>
              <button onClick={open} className="rounded-full p-2 border-2 border-[#C5C5C5] hover:bg-gray-100">
                <svg className="h-6 w-6 text-[#C5C5C5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* <pre>{JSON.stringify(selectedTopup, null, 2)}</pre> */}

            <div className="mb-6 text-center">
              <p className="mb-1 text-[14px] text-[#77849B]">Top up amount</p>
              <p className="text-[18px] font-[700] text-balck">{selectedTopup.amount} {getCoinById(selectedTopup.coin)?.name}</p>
            </div>

            <div className="mb-6 rounded-xl mx-auto max-w-[376px] bg-gray-50 p-4">
              <div className="mb-2 flex flex-wrap items-center gap-0.5 justify-center">
                <p className="text-[12px] font-[600] text-[#77849B]">Our Wallet:</p>
                <p className="text-[12px] font-[600] text-black" id="wallet-address">{getCoinWalletAddress(selectedTopup.coin)}</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="rounded-[8px] text-black bg-[#EEF4F6] px-3 py-2 font-[500] text-[12px]">ERC-20</span>

              </div>
            </div>

            <div className="space-y-3">
              <button onClick={handleConfirmTopup} className="w-full rounded-[10px] bg-[#48FF2C] text-black py-3 text-center font-semibold  hover:bg-green-400  ">
                Confirm top up
              </button>
              <button onClick={handleRefuseTopup} className="w-full rounded-[10px] bg-[#FF5A2C] py-3 text-center font-semibold text-white hover:bg-red-500 transition-colors">
                Refuse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StakingAssets;
