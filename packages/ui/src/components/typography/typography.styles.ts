import { classNames } from '../../utils/style-class.utils';
import { TypographyType } from './models/TypographyTypes';


export const h1 = 'font-bold text-24 font-h1';
export const h2 = 'font-semibold text-lg font-body';
export const h3 = 'font-semibold font-body';
export const body = 'font-body';
export const dropText = 'text-textDark font-body';
export const help = 'text-sm font-body';
export const link = 'font-body ';
export const small = 'text-xs font-body ';

const skinnyWeight = 'font-light';
const normalWeight = 'font-normal';
const boldWeight = 'font-medium';
const bolderWeight = 'font-bold';
const getWeightStyles = (weight?: string) => {
  switch (weight) {
    case 'skinny':
      return skinnyWeight;
    case 'bold':
      return boldWeight;
    case 'bolder':
      return bolderWeight;
    case 'normal':
    default:
      return normalWeight;
  }
};

const getUnderlineStyle = (underline?: boolean) => `${underline ? 'underline' : ''}`;

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
    case 'dropText':
      return classNames(
        body,
        getWeightStyles(weight),
        getUnderlineStyle(underline),
        getHoverStyle(hover)
      );
    default:
      return body;
  }
};
