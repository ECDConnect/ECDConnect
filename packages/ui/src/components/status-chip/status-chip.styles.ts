import { Colours } from '../../models';

export const getChipStyles = (
  backgroundColour: Colours,
  borderColours: Colours,
  padding: string
): string => {
  const paddingToAdd = padding !== '' ? padding : 'px-3 py-1';
  return `flex flex-shrink-0 flex-row items-center justify-between ${paddingToAdd} rounded-full border border-${borderColours} bg-${backgroundColour}`;
};
