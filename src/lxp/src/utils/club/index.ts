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
