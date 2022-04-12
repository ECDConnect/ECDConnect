import { Colours } from '../../models';

export const wrapper = (alignment: string) =>
  `py-6 px-4 flex flex-col justify-evenly items-${alignment}`;
export const textWrapper = (alignment: string) => `mb-2 text-${alignment}`;
export const button = 'mb-4 mt-4';

export const iconWrapper = (color: Colours) => {
  return `z-10 mb-3 rounded-full p-3 bg-${color}`;
};
