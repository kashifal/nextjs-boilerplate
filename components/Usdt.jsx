'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Usdt = ({ stats }) => {
        const [topups, setTopups] = useState([]);
        const [totalApprovedAmount, setTotalApprovedAmount] = useState(0);
        const [coinRate, setCoinRate] = useState(null);
        const [coins, setCoins] = useState([]);
        const [users, setUsers] = useState([]);

        const fetchTopups = async () => {
                try {
                        const user = JSON.parse(localStorage.getItem('user'));
                        // if (!user?.id) return;

                        const response = await fetch(`/api/topup`);
                        if (!response.ok) throw new Error('Failed to fetch topups');

                        const data = await response.json();
                        setTopups(data.topups);
                        console.log(data.topups);
                } catch (error) {
                        console.error('Error fetching topups:', error);
                }
        };


        const calculateTotalApprovedAmount = async () => {
                try {
                        if (!topups.length || !coins.length) {
                                console.log('No topups or coins available');
                                return;
                        }
                        
                        let total = 0;
                        const approvedTopups = topups.filter(t => t.status === 'APPROVED');
                        
                        if (approvedTopups.length === 0) {
                                setTotalApprovedAmount('0.000');
                                return;
                        }

                        // Process each approved topup
                        for (const topup of approvedTopups) {
                                const coin = getCoinById(topup.coin);
                                if (!coin) {
                                        console.log('Coin not found for topup:', topup);
                                        continue;
                                }

                                try {
                                        const response = await axios({
                                                method: 'get',
                                                url: `https://rest.coinapi.io/v1/exchangerate/${coin.name}/USDT`,
                                                headers: {
                                                        'Accept': 'text/plain',
                                                        'X-CoinAPI-Key': process.env.NEXT_PUBLIC_COINAPI_KEY
                                                }
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
                        console.error('Error calculating total in USDT:', error);
                        setTotalApprovedAmount('0.000');
                }
        };
         

        const fetchAllUsers = async () => {
                const response = await fetch('/api/user');
                const data = await response.json();
                setUsers(data.users);
                console.log(data.users, 'users');
              }

        const getAllCoinRatesAgainstUsdt = async (coinSymbol) => {
                try {
                        const response = await axios({
                                method: 'get',
                                url: `https://rest.coinapi.io/v1/exchangerate/${coinSymbol}/USDT`,
                                headers: {
                                        'Accept': 'text/plain',
                                        'X-CoinAPI-Key': process.env.NEXT_PUBLIC_COINAPI_KEY
                                }
                        });
                        
                        setCoinRate(response.data);
                        console.log(response.data,'data');
                } catch (error) {
                        console.error('Error fetching coin rates:', error);
                }
        };
        const fetchallCoins = async () => {
                const response = await fetch('/api/coin');
                const data = await response.json();
                setCoins(data.coins);
                console.log(data.coins);
              };

        const getCoinById = (id) => {
                return coins.find(coin => coin._id === id);
              }

        useEffect(() => {
                fetchTopups();
                fetchallCoins();
                fetchAllUsers();
        }, []);

        useEffect(() => {
                // Initial calculation
                calculateTotalApprovedAmount();

                // Set up interval
                const interval = setInterval(calculateTotalApprovedAmount, 20000);

                // Cleanup
                return () => clearInterval(interval);
        }, [topups, coins]); // These dependencies will trigger recalculation when they change

        useEffect(() => {
                getAllCoinRatesAgainstUsdt('BEL');
        }, []);

        return (
                <div className="max-w-full mx-6 my-12 bg-white gap-10 bg-white py-12 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-6">
                       {/* <pre>{JSON.stringify(stats, null, 2)}</pre> */}
                        <div className="  flex flex-col md:border-r-2   border-gray-200  lg:mr-5 ">
                                <div className="w-12 h-12 bg-[#a8e7c4] rounded-full flex items-center justify-center">
                                        <span className=" text-[48px]"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M7.4889 3.05392C7.37598 2.52695 6.62402 2.52694 6.5111 3.05393L5.31658 8.62837C5.02017 10.0116 3.79778 10.9998 2.38317 10.9998H1C0.447715 10.9998 0 10.5521 0 9.99978C0 9.44749 0.447715 8.99978 1 8.99978H2.38317C2.85471 8.99978 3.26217 8.67038 3.36097 8.20931L4.55549 2.63487C5.12011 -2.21729e-05 8.87988 -4.64916e-05 9.44451 2.63487L12.5111 16.9456C12.624 17.4726 13.376 17.4726 13.4889 16.9456L14.6834 11.3712C14.9798 9.98798 16.2022 8.99978 17.6168 8.99978H19C19.5523 8.99978 20 9.44749 20 9.99978C20 10.5521 19.5523 10.9998 19 10.9998H17.6168C17.1453 10.9998 16.7378 11.3292 16.639 11.7902L15.4445 17.3647C14.8799 19.9996 11.1201 19.9996 10.5555 17.3647L7.4889 3.05392Z" fill="#1A1D1F" />
                                        </svg>
                                        </span>
                                </div>
                                <h3 className="text-gray-600 mt-4 text-[13px]  flex gap-1 font-semibold">Total income <span><svg className="w-3 mt-[5px]" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M13.6668 7.00016C13.6668 10.6821 10.6821 13.6668 7.00016 13.6668C3.31826 13.6668 0.333496 10.6821 0.333496 7.00016C0.333496 3.31826 3.31826 0.333496 7.00016 0.333496C10.6821 0.333496 13.6668 3.31826 13.6668 7.00016ZM7.00016 6.3335C7.36835 6.3335 7.66683 6.63197 7.66683 7.00016V10.3341C7.66683 10.7023 7.36835 11.0008 7.00016 11.0008C6.63197 11.0008 6.3335 10.7023 6.3335 10.3341V7.00016C6.3335 6.63197 6.63197 6.3335 7.00016 6.3335ZM7.00016 5.00016C7.36835 5.00016 7.66683 4.70169 7.66683 4.3335C7.66683 3.96531 7.36835 3.66683 7.00016 3.66683C6.63197 3.66683 6.3335 3.96531 6.3335 4.3335C6.3335 4.70169 6.63197 5.00016 7.00016 5.00016Z" fill="#6F767E" />
                                </svg>
                                </span></h3>
                                <p className="text-[32px] font-[600] mt-1">{stats.totalProfitUSDT.toFixed(2)} USDT</p>
                                <p className="text-[#83BF6E] bg-[#FCFCFC] rounded-[4px] p-1 max-w-[142px]  font-medium text-[12px] flex gap-1 items-center mt-2"> <span><svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 6L6 1L11 6" stroke="#83BF6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6 13V1" stroke="#83BF6E" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                {/* </span> 37.8% <span className="text-[#666E78]">from last week</span>*/}
                                 </p> 
                        </div>

                        <div className="  flex flex-col md:border-r-2 border-gray-200 lg:mr-5 lg:ml-6 ">
                                <div className="w-12 h-12 bg-[#CABDFF] rounded-full flex items-center justify-center">
                                        <span className=" text-[48px]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9 8.08392C8.16919 8.22435 7.37341 8.53889 6.66658 9.01118C5.67989 9.67047 4.91085 10.6075 4.45673 11.7039C4.0026 12.8003 3.88378 14.0067 4.11529 15.1705C4.3468 16.3344 4.91825 17.4035 5.75736 18.2426C6.59648 19.0818 7.66558 19.6532 8.82946 19.8847C9.99335 20.1162 11.1997 19.9974 12.2961 19.5433C13.3925 19.0892 14.3295 18.3201 14.9888 17.3334C15.4611 16.6266 15.7757 15.8308 15.9161 15H10C9.73479 15 9.48043 14.8946 9.2929 14.7071C9.10536 14.5196 9 14.2652 9 14V8.08392ZM5.55544 7.34824C6.87104 6.46919 8.41775 6 10 6C10.5523 6 11 6.44772 11 7V13H17C17.5523 13 18 13.4477 18 14C18 15.5823 17.5308 17.129 16.6518 18.4446C15.7727 19.7602 14.5233 20.7855 13.0615 21.391C11.5997 21.9965 9.99113 22.155 8.43928 21.8463C6.88743 21.5376 5.46197 20.7757 4.34315 19.6569C3.22433 18.538 2.4624 17.1126 2.15372 15.5607C1.84504 14.0089 2.00347 12.4003 2.60897 10.9385C3.21447 9.47672 4.23985 8.22729 5.55544 7.34824Z" fill="#1A1D1F" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.2929 2.29289C13.4804 2.10536 13.7348 2 14 2C16.1217 2 18.1566 2.84285 19.6569 4.34314C21.1571 5.84344 22 7.87827 22 10C22 10.5523 21.5523 11 21 11L14 11C13.7348 11 13.4804 10.8946 13.2929 10.7071C13.1054 10.5196 13 10.2652 13 10V3C13 2.73478 13.1054 2.48043 13.2929 2.29289ZM15 4.08389V9L19.9161 9C19.7098 7.77969 19.1293 6.64405 18.2426 5.75736C17.3559 4.87067 16.2203 4.29016 15 4.08389Z" fill="#1A1D1F" />
                                        </svg>

                                        </span>
                                </div>
                                <h3 className="text-gray-600 mt-4 text-[13px]  flex gap-1 font-semibold">Staked amount <span><svg className="w-3 mt-[5px]" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M13.6668 7.00016C13.6668 10.6821 10.6821 13.6668 7.00016 13.6668C3.31826 13.6668 0.333496 10.6821 0.333496 7.00016C0.333496 3.31826 3.31826 0.333496 7.00016 0.333496C10.6821 0.333496 13.6668 3.31826 13.6668 7.00016ZM7.00016 6.3335C7.36835 6.3335 7.66683 6.63197 7.66683 7.00016V10.3341C7.66683 10.7023 7.36835 11.0008 7.00016 11.0008C6.63197 11.0008 6.3335 10.7023 6.3335 10.3341V7.00016C6.3335 6.63197 6.63197 6.3335 7.00016 6.3335ZM7.00016 5.00016C7.36835 5.00016 7.66683 4.70169 7.66683 4.3335C7.66683 3.96531 7.36835 3.66683 7.00016 3.66683C6.63197 3.66683 6.3335 3.96531 6.3335 4.3335C6.3335 4.70169 6.63197 5.00016 7.00016 5.00016Z" fill="#6F767E" />
                                </svg>
                                </span></h3>
                                <p className="text-[32px] font-[600] mt-1">{stats.totalStakedUSDT.toFixed(2)} USDT</p>
                                <p className="text-[#FF6A55] bg-[#FCFCFC] rounded-[4px] p-1 max-w-[142px] font-medium text-[12px] flex gap-1 items-center mt-2"> <span><svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 8L6 13L1 8" stroke="#FF6A55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6 0.999999L6 13" stroke="#FF6A55" strokeWidth="2" strokeLinecap="round" />
                                </svg>

                                {/* </span> 37.8% <span className="text-[#666E78]">from last week</span>  */}
                                </p>
                        </div>

                        <div className="  flex flex-col  lg:mr-5 lg:ml-6 ">
                                <div className="w-12 h-12 bg-[#B1E5FC] rounded-full flex items-center justify-center">
                                        <span className=" text-[48px]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.50903 6.5C7.50903 8.98103 9.52692 11 12.009 11C14.4911 11 16.509 8.98103 16.509 6.5C16.509 4.01897 14.4911 2 12.009 2C9.52692 2 7.50903 4.01897 7.50903 6.5ZM9.50903 6.5C9.50903 5.12107 10.6301 4 12.009 4C13.387 4 14.509 5.12113 14.509 6.5C14.509 7.87893 13.388 9 12.009 9C10.6301 9 9.50903 7.87893 9.50903 6.5ZM8.00305 22H15.9969C17.2512 22 18.2612 21.656 18.9572 20.9641C19.6535 20.2719 20 19.2671 20 18.019C20 16.6455 19.6121 15.1427 18.6601 13.978C17.7012 12.8051 16.1899 12 14 12H10C7.81011 12 6.29875 12.8054 5.33994 13.9784C4.3879 15.1432 4 16.646 4 18.019C4 19.2671 4.34649 20.2719 5.04278 20.9641C5.73884 21.656 6.74878 22 8.00305 22ZM6 18.019C6 17.5353 6.07556 16.5225 6.6103 15.6381C7.13286 14.774 8.11249 14 10 14H14C15.8875 14 16.8671 14.7742 17.3897 15.6385C17.9244 16.523 18 17.5358 18 18.019C18 18.7719 17.8369 19.2492 17.5397 19.5434C17.242 19.8381 16.7584 20 15.9969 20H8.00305C7.24161 20 6.75802 19.8381 6.46029 19.5434C6.16313 19.2492 6 18.7719 6 18.019Z" fill="black" stroke="black" strokeWidth="0.5" />
                                        </svg>


                                        </span>
                                </div>
                                <h3 className="text-gray-600 mt-4 text-[13px]  flex gap-1 font-semibold">Total users <span><svg className="w-3 mt-[5px]" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M13.6668 7.00016C13.6668 10.6821 10.6821 13.6668 7.00016 13.6668C3.31826 13.6668 0.333496 10.6821 0.333496 7.00016C0.333496 3.31826 3.31826 0.333496 7.00016 0.333496C10.6821 0.333496 13.6668 3.31826 13.6668 7.00016ZM7.00016 6.3335C7.36835 6.3335 7.66683 6.63197 7.66683 7.00016V10.3341C7.66683 10.7023 7.36835 11.0008 7.00016 11.0008C6.63197 11.0008 6.3335 10.7023 6.3335 10.3341V7.00016C6.3335 6.63197 6.63197 6.3335 7.00016 6.3335ZM7.00016 5.00016C7.36835 5.00016 7.66683 4.70169 7.66683 4.3335C7.66683 3.96531 7.36835 3.66683 7.00016 3.66683C6.63197 3.66683 6.3335 3.96531 6.3335 4.3335C6.3335 4.70169 6.63197 5.00016 7.00016 5.00016Z" fill="#6F767E" />
                                </svg>
                                </span></h3>
                                <p className="text-[32px] font-[600] mt-1">
                                        {stats.totalUsers}
                                </p>

                        </div>

                </div>
        )
}

export default Usdt