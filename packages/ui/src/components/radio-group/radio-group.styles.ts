import { Colours } from '../../models/Colours';

export const wrapper = 'overflow-hidden bg-white';

export const optionsWrapper = (
  index: number,
  checked: boolean,
  colour: Colours,
  selectedOptionBackgroundColor: Colours
) =>
  ` flex flex-row justify-start items-start mb-1 p-4 rounded-lg items-center ${
    checked ? `bg-${selectedOptionBackgroundColor}` : 'bg-uiBg'
  } ${checked ? `border border-${colour}` : 'border border-uiBg'}`;

export const groupCircleStyle = (checked: boolean, colour: Colours) =>
  `${
    checked ? `bg-${colour} border-${colour}` : `border border-${colour}`
  } w-4 h-4 flex-shrink-0 rounded-full flex justify-center items-center mr-2 mt-1`;

export const inner = 'h-1 w-1 bg-white rounded-full';
