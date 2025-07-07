import { IconSize } from './round-icon.types';

export const roundIconContainer = (size?: IconSize) =>
  size
    ? `flex-shrink-0 h-${size.h}  w-${size.w} rounded-full flex justify-center items-center `
    : 'flex-shrink-0 h-12  w-12 rounded-full flex justify-center items-center ';
export const roundIconContainerDefault = 'bg-primary text-white';
export const roundIcon = (size?: IconSize) =>
  size ? `flex-shrink-0 h-${size.h}  w-${size.w} ` : 'flex-shrink-0 h-6 w-6 ';
