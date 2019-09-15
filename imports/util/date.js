// returns true or false
export const areStartAndEndDatesValid = (startDate, endDate) => {
  return (endDate.getTime() > startDate.getTime());
};

// returns string (i.e. '8 months' or '3 years')
export const getDateRange = (startDate, endDate) => {
  const milliseconds = endDate.getTime() - startDate.getTime();
  const days = milliseconds * (1 / 86400000);
  const weeks = milliseconds * (1 / 604800000);
  const years = weeks * 0.019165349;
  const months = years * 12;

  let dateRange = '';

  if (Math.round(years) >= 1) {
    dateRange = `${Math.round(years)} years`;
  } else if (Math.round(months) >= 1) {
    dateRange = `${Math.round(months)} months`;
  } else if (Math.round(weeks) >= 1) {
    dateRange = `${Math.round(weeks)} weeks`;
  } else {
    dateRange = `${Math.round(days)} days`;
  }

  return dateRange;
};