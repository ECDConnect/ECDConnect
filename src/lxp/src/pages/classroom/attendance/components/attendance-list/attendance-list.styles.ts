export const wrapper = 'h-full w-full flex flex-col flex-1';
export const contentWrapper =
  'flex flex-row justify-between px-4 py-1 overflow-x-auto';
export const dropdownStyles = 'w-11/12 left-4';
export const smallMarginRight = 'mr-1';
export const attendanceListsWrapper = 'overflow-y-auto pb-6';
export const statusChipsWrapper = (shouldFilter?: boolean) =>
  `flex flex-row py-2 ${shouldFilter ? 'justify-center' : 'justify-start'}`;
