import { classNames } from '../../utils/style-class.utils';
import { DialogBorderRadiusType } from './models/DialogBorderRadiusType';
import { DialogPosition } from './models/DialogPosition';

export const bottomDiv = 'opacity-50 fixed inset-0 z-40 bg-black';
export const bottomDivSolid = 'fixed inset-0 z-40';

export const getWrapperStyle = (position: DialogPosition) => {
  let baseStyle =
    'justify-center flex overflow-hidden fixed inset-0 z-50 outline-none focus:outline-none';

  switch (position) {
    case DialogPosition.Top:
      baseStyle = classNames(baseStyle, 'items-start');
      break;
    case DialogPosition.Middle:
      baseStyle = classNames(baseStyle, 'items-center');
      break;
    case DialogPosition.Bottom:
      baseStyle = classNames(baseStyle, 'items-end');
  }

  return baseStyle;
};

export const getContentWrapperStyles = (
  stretch: boolean,
  dialogBorderRadiusType: DialogBorderRadiusType,
  fullScreen: boolean
) => {
  if (fullScreen) {
    return `bg-white relative w-full h-full`;
  }

  const baseStyle = classNames(
    dialogBorderRadiusType === 'rounded' ? 'rounded-lg' : '',
    'bg-white relative'
  );

  return `${baseStyle} ${stretch ? 'w-screen' : 'w-96'} sm:w-full`;
};
