import { DialogPosition } from '@ecdlink/ui';

export const transitionRoot = 'z-10 ';
export const overlay = 'fixed inset-0 opacity-50 bg-primary';

function getItemPosition(position: DialogPosition) {
  switch (position) {
    case DialogPosition.Top:
      return 'items-start';
    case DialogPosition.Bottom:
      return 'items-end';
    case DialogPosition.Middle:
      return 'items-center';
  }
}

export function transitionChildWrapper(position: DialogPosition) {
  return `flex ${getItemPosition(position)} justify-center min-h-screen  ${
    position !== DialogPosition.Full ? 'pt-4 px-4' : 'h-screen'
  } text-center`;
}
export function contentWrapper(position: DialogPosition) {
  return `align-bottom bg-uiBg max-h-screen overflow-y-auto ${
    position !== DialogPosition.Full ? 'rounded-lg max-w-sm' : 'max-w-4xl'
  } text-left shadow-xl transform transition-all align-middle w-full`;
}
