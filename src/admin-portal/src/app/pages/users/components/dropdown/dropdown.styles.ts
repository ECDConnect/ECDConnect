import { Colours, classNames } from '@ecdlink/ui';
import { DropDownFillType } from './models/DropDownOption';

export const dropdownWrapper =
  'font-body mt-1 inline-flex items-center justify-between origin-top-right right-0 w-full rounded-md border border-transparent font-medium hover:bg-gray-50 focus:border-secondary focus:ring-1 focus:ring-secondary';
export const dropdownClearWrapper =
  'font-body mt-1 inline-flex items-center justify-between origin-top-right right-0 w-full rounded-md border border-transparent font-medium hover:bg-gray-50 focus:border-secondary focus:ring-1 focus:ring-secondary';
export const menu = 'relative inline-block text-left w-full';
export const icon = 'h-6 w-6 pr-2 text-white';
export const iconClear = 'h-6 w-6 mr-2 text-uiMid';
// BEFORE export const title = 'px-4 pt-3 pb-3';
export const title = 'px-4 pt-2 pb-2 relative flex text-sm';
export const menuItems =
  'absolute z-50 mt-1 w-full bg-white max-h-48 rounded-md py-1 text-base overflow-auto border border-tertiaryAccent2 focus:border-uiMidDark focus:ring-uiMidDark focus:ring-1';
export const menuItem = 'block p-2 text-textMid font-h2 cursor-pointer';
export const menuItemSm =
  'block px-4 py-2 text-textMid font-h1 text-sm cursor-pointer';
export const menuItemSelected =
  'font-h1 block px-4 py-2 cursor-pointer text-textDark';
export const menuItemWrapper = '';
export const enter = 'transition ease-out duration-100';
export const enterFrom = 'transform opacity-0 scale-95';
export const enterTo = 'transform opacity-100 scale-100';
export const leave = 'transition ease-in duration-75';
export const leaveFrom = 'transform opacity-100 scale-100';
export const leaveTo = 'transform opacity-0 scale-95';
export const label =
  'font-semibold block text-base font-body leading-snug text-textDark';
export const subLabel =
  'block text-base font-body leading-snug text-textMid self-stretch';

export const getDropDownFill = (
  fillType: DropDownFillType,
  fillColor: Colours
) => {
  switch (fillType) {
    case 'clear':
      return classNames(dropdownClearWrapper, `bg-${fillColor}`);
    case 'filled':
    default:
      return classNames(dropdownWrapper, `bg-${fillColor}`);
  }
};

export const getDropDownSelectedTextColour = (fillType: DropDownFillType) => {
  switch (fillType) {
    case 'clear':
      return 'text-primary';
    case 'filled':
    default:
      return 'text-white';
  }
};

export const getDropDownIcon = (
  fillType: DropDownFillType,
  colour: Colours
) => {
  switch (fillType) {
    case 'clear':
      return classNames(iconClear, `text-${colour}`);
    case 'filled':
    default:
      return classNames(icon, `text-${colour}`);
  }
};
