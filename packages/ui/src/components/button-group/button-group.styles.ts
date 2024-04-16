import { classNames } from '../../utils/style-class.utils';
import { Colours } from '../../models/Colours';
import { ButtonGroupTypes } from './models/ButtonGroupTypes';

export const buttonTypeWrapper = 'relative z-0 inline-flex gap-2 w-full';
export const chipTypeWrapper = 'relative z-0 inline-flex flex-wrap';

export const chip = (disabled?: boolean) => {
  return `inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mr-2 mb-4 cursor-pointer ${
    disabled ? 'bg-uiLight opacity-80' : ''
  }`;
};

const sharedButtonStyles = (disabled?: boolean) =>
  `font-body p-3 text-sm font-medium rounded-10 items-center flex items-center justify-center ${
    disabled ? 'opacity-50' : ''
  }`;

export const notSelectedChip =
  'text-secondary cursor-pointer bg-secondaryAccent2';
export const notSelectedButtonOrChip =
  'text-secondary cursor-pointer bg-secondaryAccent2';
export const notSelectedColorStyle = (colour: Colours, textColor) => {
  return `text-${textColor} cursor-pointer bg-${colour}`;
};
export const selected = (colour: Colours) => {
  return `z-10 outline-none cursor-pointer text-white bg-${colour}`;
};

export const getOptionStyle = (type: ButtonGroupTypes, disabled?: boolean) => {
  switch (type) {
    case ButtonGroupTypes.Chip:
      return chip(disabled);
    case ButtonGroupTypes.Button:
    default:
      return classNames(sharedButtonStyles(disabled), `w-full`);
  }
};
