import { classNames } from '../../utils/style-class.utils';
import { TypographyType } from './models/TypographyTypes';

export const h1 = 'font-semibold text-2xl ';
export const h2 = 'font-semibold text-xl ';
export const h3 = 'font-semibold text-lg ';
export const h4 = 'font-semibold text-base leading-snug ';

export const body = 'text-base font-h1';
export const help = 'text-sm font-h1';
export const button = 'font-semibold text-sm ';
export const buttonSmall = 'font-semibold text-xs ';
export const link = 'font-body ';

export const small = 'font-body ';
export const dropText = 'text-textDark font-body';

const skinnyWeight = 'font-normal';
const normalWeight = 'font-semibold';
const boldWeight = 'font-bold';

const getWeightStyles = (weight?: string) => {
  switch (weight) {
    case 'skinny':
      return skinnyWeight;
    case 'bold':
      return boldWeight;
    case 'normal':
      return normalWeight;
    default:
      return skinnyWeight;
  }
};

const getUnderlineStyle = (underline?: boolean) =>
  `${underline ? 'underline' : ''}`;

const getHoverStyle = (hover?: boolean) => `${hover ? 'cursor-pointer' : ''}`;

export const getFontStyleByType = (
  type: TypographyType,
  weight?: string,
  underline?: boolean,
  hover?: boolean
) => {
  switch (type) {
    case 'h1':
      return h1;
    case 'h2':
      return h2;
    case 'h3':
      return h3;
    case 'h4':
      return h4;
    case 'button':
      return button;
    case 'buttonSmall':
      return buttonSmall;
    case 'body':
      return classNames(
        body,
        getWeightStyles(weight),
        getUnderlineStyle(underline),
        getHoverStyle(hover)
      );
    case 'help':
      return classNames(
        help,
        getWeightStyles(weight),
        getUnderlineStyle(underline),
        getHoverStyle(hover)
      );
    case 'small':
      return classNames(
        small,
        getWeightStyles(weight),
        getUnderlineStyle(underline),
        getHoverStyle(hover)
      );
    case 'unspecified':
      return classNames(
        getWeightStyles(weight),
        getUnderlineStyle(underline),
        getHoverStyle(hover)
      );
    default:
      return body;
  }
};
