import { classNames } from '../../utils/style-class.utils';
import { Colours } from '../../models/Colours';
import { ButtonGroupTypes } from './models/ButtonGroupTypes';

export const buttonTypeWrapper =
  'relative z-0 inline-flex rounded-md cursor-pointer w-full';
export const chipTypeWrapper = 'relative z-0 inline-flex flex-wrap';

export const chip = (disabled?: boolean) => {
  return `inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mr-2 mb-4 border cursor-pointer ${disabled ? 'bg-uiLight opacity-80' : ''}`;
};

const sharedButtonStyles = (disabled?: boolean) => `px-4 py-2 border bg-white text-sm font-medium items-center relative text-center ${disabled ? 'bg-uiLight opacity-80' : ''}`;

export const firstButton = `rounded-l-md w-full `;
export const middleButton = `-ml-px w-full`;
export const lastButton = `-ml-px rounded-r-md bg-black w-full`;

export const notSelectedChip = 'text-textLight border-textLight';
export const notSelectedButton = 'text-textLight';

export const selected = (colour: Colours) => {
  return `z-10 outline-none border-${colour} text-white bg-${colour}`;
};

export const getOptionStyle = (
  type: ButtonGroupTypes,
  index: number,
  maxIndex: number,
  disabled?: boolean
) => {
  switch (type) {
    case ButtonGroupTypes.Chip:
      return chip(disabled);
    case ButtonGroupTypes.Button:
    default:
      return getButtonStyleByIndex(index, maxIndex, disabled);
  }
};

export const getNotSelectedStyle = (
  type: ButtonGroupTypes
) => {
  switch (type) {
    case ButtonGroupTypes.Chip:
      return notSelectedChip;
    case ButtonGroupTypes.Button:
    default:
      return notSelectedButton;
  }
};

const getButtonStyleByIndex = (index: number, maxIndex: number, disabled?: boolean) => {
  const sharedStyles = sharedButtonStyles(disabled);
  if (index === 0) {
    return classNames(sharedStyles, firstButton);
  } else if (index < maxIndex) {
    return classNames(sharedStyles, middleButton);
  } else {
    return classNames(sharedStyles, lastButton);
  }
};
