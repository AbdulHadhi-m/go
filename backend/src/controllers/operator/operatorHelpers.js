export const calcOccupancy = (trip) => {
  if (!trip?.totalSeats || trip.totalSeats <= 0) return 0;

  const booked = trip.totalSeats - trip.availableSeats;
  return Number(((booked / trip.totalSeats) * 100).toFixed(2));
};

export const calculateDynamicFare = (trip) => {
  const baseFare = Number(trip.fare || trip.seatPrice || 0);

  if (!trip.dynamicPricingEnabled) return baseFare;

  const day = new Date(trip.journeyDate).getDay();
  const isWeekend = day === 0 || day === 6;

  if (!isWeekend) return baseFare;

  return Number((baseFare * (trip.weekendMultiplier || 1.1)).toFixed(2));
};