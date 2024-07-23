import { Colours } from '../../models/Colours';
import { classNames } from '../../utils/style-class.utils';
import {
  ButtonType,
  ButtonShapeType,
  ButtonSize,
  ButtonBackgroundType,
} from './button.types';

export const solid =
  'inline-flex items-center border-2 border-transparent text-sm font-normal shadow-sm justify-center outline-none';

export const outline =
  'inline-flex items-center border-2 border-solid shadow-sm text-sm font-semibold justify-center outline-none';

export const ghost =
  'inline-flex items-center text-sm font-semibold justify-center outline-none';

export const disabledSolid = 'bg-uiLight';

export const disabledOutline =
  'border-uiLight shadow-sm text-sm font-semibold text-uiLight bg-white';

export const disabledghost = 'font-semibold text-uiLight';

export const rounded = 'rounded-full';

export const getButtonClassName = (
  type: ButtonType,
  disabled: boolean,
  color: Colours,
  shape: ButtonShapeType,
  size: ButtonSize,
  background?: ButtonBackgroundType
) => {
  let className = '';

  switch (type) {
    case 'filled':
      className = classNames(
        solid,
        disabled
          ? `bg-${color} text-white opacity-50`
          : `bg-${color} text-white`
      );
      break;
    case 'outlined':
      className = classNames(
        outline,
        disabled
          ? `shadow-sm text-sm font-semibold text-uiLight bg-white border-${color} opacity-50`
          : `border-${color} text-${color} bg-${
              background === 'filled' ? 'white' : 'transparent'
            }`
      );
      break;
    case 'ghost':
      className = classNames(
        ghost,
        `text-${color}`,
        disabled ? disabledghost : ''
      );
      break;
    default:
      className = classNames(solid, `text-white bg-tertiaryAccent1`);
      break;
  }

  let sizeStyle = '';

  switch (size) {
    case 'small':
      sizeStyle = 'py-2 px-2';
      break;
    case 'large':
      sizeStyle = 'py-2 px-5';
      break;
    case 'large-round':
      sizeStyle = 'py-2.5 px-2.5';
      break;
    case 'normal':
    default:
      sizeStyle = 'py-2.5 px-17';
      break;
  }

  let roundedStyle = shape === 'round' ? rounded : '';

  switch (size) {
    case 'small':
      if (roundedStyle) break;
      roundedStyle = 'rounded-10';
      break;
    default:
      if (roundedStyle) break;
      roundedStyle = 'rounded-15';
      break;
  }

  className = classNames(className, sizeStyle, roundedStyle);

  return className;
};
