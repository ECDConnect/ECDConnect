// EC-1400: show this screen only for clubs who are in a non-purple league, starting 1 April and stop showing this screen after 31 December.
export const shouldShowPointsScreen = (isPurpleLeague: boolean): boolean => {
  const currentDate = new Date();

  if (!isPurpleLeague) {
    // if the current date is between April 1st and December 31st
    const april1st = new Date(currentDate.getFullYear(), 3, 1); // April is month 3 (0-indexed)
    const december31st = new Date(currentDate.getFullYear(), 11, 31);

    return currentDate >= april1st && currentDate <= december31st;
  }

  return false;
};

export const getTermNumberForCurrentMonth = () => {
  const currentDate = new Date();

  // Get the current month (ranges from 0 to 11, where 0 is January and 11 is December)
  const currentMonth = currentDate.getMonth();

  let term = undefined;

  // Term 1: January to April
  if (currentMonth >= 0 && currentMonth <= 3) {
    term = 1;
  }
  // Term 2: May to July
  else if (currentMonth >= 4 && currentMonth <= 6) {
    term = 2;
  }
  // Term 3: August to October
  else if (currentMonth >= 7 && currentMonth <= 9) {
    term = 3;
  }

  return term;
};
