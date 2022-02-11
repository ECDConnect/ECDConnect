import { DialogPosition } from '@ecdlink/ui';

const getItemPosition = (position: DialogPosition) => {
  switch (position) {
    case DialogPosition.Top:
      return 'items-start';
    case DialogPosition.Bottom:
      return 'items-end';
    case DialogPosition.Middle:
      return 'items-center';
    default:
      return '';
  }
};

export const transitionRoot = 'z-10 ';
export const transitionChildWrapper = (position: DialogPosition) =>
  `flex ${getItemPosition(position)} justify-center min-h-screen  ${
    position !== DialogPosition.Full ? 'pt-4 px-4' : 'h-screen'
  } text-center`;
export const overlay = 'fixed bg-gray-500 bg-opacity-75 transition-opacity';

export const contentWrapper = (position: DialogPosition) =>
  `align-bottom bg-uiBg max-h-screen overflow-y-auto ${
    position !== DialogPosition.Full ? 'rounded-lg max-w-sm' : 'max-w-4xl'
  } text-left shadow-xl transform transition-all align-middle w-full`;
