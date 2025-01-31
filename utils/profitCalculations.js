export const calculateDailyProfitRange = (amount, apy, duration) => {
  // Convert APY to decimal
  const apyDecimal = parseFloat(apy) / 100;
  
  // Calculate maximum total profit based on APY
  const maxTotalProfit = amount * apyDecimal;
  
  // Calculate average daily profit (if it was distributed evenly)
  const avgDailyProfit = maxTotalProfit / duration;
  
  // Set minimum daily profit to ensure some profit each day
  const minDailyProfit = avgDailyProfit * 0.3; // 30% of average as minimum
  
  // Set maximum daily profit to ensure we don't exceed APY
  const maxDailyProfit = avgDailyProfit * 1.7; // 170% of average as maximum
  
  return { minDailyProfit, maxDailyProfit, maxTotalProfit };
};

export const generateDailyProfits = (amount, apy, duration) => {
  const { minDailyProfit, maxDailyProfit, maxTotalProfit } = calculateDailyProfitRange(amount, apy, duration);
  const dailyProfits = [];
  let remainingProfit = maxTotalProfit * 0.95; // Use 95% of max profit to ensure we stay under APY
  
  for (let day = 0; day < duration; day++) {
    if (day === duration - 1) {
      // Last day gets remaining profit
      dailyProfits.push(remainingProfit);
    } else {
      // Calculate remaining average needed to hit target
      const remainingDays = duration - day;
      const avgNeeded = remainingProfit / remainingDays;
      
      // Generate random profit within constraints
      const minForDay = Math.min(minDailyProfit, remainingProfit * 0.5);
      const maxForDay = Math.min(maxDailyProfit, remainingProfit * 0.9);
      
      const dayProfit = Math.random() * (maxForDay - minForDay) + minForDay;
      dailyProfits.push(dayProfit);
      remainingProfit -= dayProfit;
    }
  }
  
  return dailyProfits;
};

export const calculateTotalProfit = (dailyProfits, daysElapsed) => {
  return dailyProfits
    .slice(0, daysElapsed)
    .reduce((sum, profit) => sum + profit, 0);
}; 