import { Colours } from './../../models';

export const iconWrapper = (borderColor: Colours) => {
  return `h-full w-full rounded-full bg-${borderColor}`;
};

export const wrapperContainer = `relative w-12 h-12 mb-3`;

export const iconContainer = `absolute inset-0 flex justify-center items-center `;
