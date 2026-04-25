/**
 * Calculate reward coins based on booking amount
 * Logic: 3% of amount, max 100 coins
 * @param {number} amount - The booking amount
 * @returns {number} - Calculated reward coins
 */
export const calculateRewardCoins = (amount) => {
  if (!amount || amount <= 0) {
    return 0;
  }

  // Calculate 3% of amount
  const coins = Math.floor(amount * 0.03);

  // Maximum reward = 100 coins per booking
  return Math.min(coins, 100);
};

/**
 * Calculate maximum redeemable coins for a booking
 * Logic: User can redeem up to their balance or 50% of booking amount, whichever is lower.
 * @param {number} userCoins - User's available reward coins
 * @param {number} totalAmount - Booking total amount
 * @returns {number} - Maximum coins that can be redeemed
 */
export const calculateRedeemableCoins = (userCoins, totalAmount) => {
  if (!userCoins || userCoins <= 0 || !totalAmount || totalAmount <= 0) {
    return 0;
  }

  // Maximum allowed discount is 50% of booking amount
  // Since 1 coin = 0.50 INR, to get a discount of (totalAmount * 0.5), 
  // user needs (totalAmount * 0.5) / 0.50 = totalAmount coins
  const maxAllowedCoins = Math.floor(totalAmount);

  // Return the minimum of user's balance and max allowed coins
  return Math.min(userCoins, maxAllowedCoins);
};
