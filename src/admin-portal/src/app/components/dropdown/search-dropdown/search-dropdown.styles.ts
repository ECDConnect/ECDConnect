import { Colours, classNames } from '@ecdlink/ui';

export const menu = 'w-full';
export const icon = 'h-6 w-6 pr-2';
export const iconClear = 'h-6 w-6 mr-2';
export const menuItems = 'rounded-md bg-white shadow-card';
export const menuItem = 'flex flex-row py-2 px-2 cursor-pointer h-12';
export const menuItemWrapper = 'py-1';
export const enter = 'transition ease-out duration-100';
export const enterFrom = 'transform opacity-0 scale-95';
export const enterTo = 'transform opacity-100 scale-100';
export const leave = 'transition ease-in duration-75';
export const leaveFrom = 'transform opacity-100 scale-100';
export const leaveTo = 'transform opacity-0 scale-95';
export const label = 'font-medium block text-base font-body text-textDark';
export const overlay = (overlayTopOffset?: string) =>
  `absolute top-${
    overlayTopOffset || '177'
  } z-20 inset-0 bg-gray-500 bg-opacity-75`;
export const infoWrapper = 'px-4 py-3 border-b border-uiBg';
export const getButtonStyles = (
  colour: Colours,
  open: boolean,
  hasSelectedItems: boolean,
  touched: boolean
) => {
  const baseStyles =
    'mt-1 flex flex-row items-center truncate justify-between origin-top-right right-0 rounded-md border-2 pl-4 pr-1 leading-5 py-2 active:bg-secondary';

  if (!touched && !hasSelectedItems) {
    return classNames(baseStyles, 'border-uiBg', 'bg-white');
  }

  if (open) {
    return classNames(baseStyles, 'bg-white', `border-${colour}`, 'text-white');
  }

  if (hasSelectedItems) {
    return classNames(
      baseStyles,
      `border-uiBg`,
      `border-${colour}`,
      `bg-${colour}`
    );
  }

  return classNames(baseStyles, 'border-secondary', 'bg-white');
};

export const getDropDownIcon = (colour: Colours, isSelected: boolean) => {
  const baseStyle = `h-6 w-6 ml-1 mr-2`;
  const styles = classNames(
    baseStyle,
    `text-${isSelected ? colour : 'uiLight'}`
  );
  return styles;
};

export const getButtonIcon = (
  colour: Colours,
  open: boolean,
  hasSelectedItems: boolean
) => {
  const baseStyle = `h-6 w-6 ml-1 mr-2`;

  if (hasSelectedItems && !open) {
    return classNames(baseStyle, `text-white`);
  }

  return classNames(baseStyle, `text-${colour}`);
};
