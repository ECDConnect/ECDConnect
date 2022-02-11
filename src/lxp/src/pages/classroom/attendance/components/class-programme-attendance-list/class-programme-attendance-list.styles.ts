export const wrapper = 'w-full flex flex-col flex-1';
export const contentWrapper = 'flex flex-col justify-start items-stretch ';
export const dropdownStyles = 'w-11/12 left-4';
export const smallMarginRight = 'mr-1';
export const attendanceListsWrapper = 'overflow-y-auto pb-36';
export const statusChipsWrapper = (shouldFilter?: boolean) =>
  `flex flex-1 flex-row items-center ${shouldFilter ? 'justify-center' : 'justify-start py-3'}`;
