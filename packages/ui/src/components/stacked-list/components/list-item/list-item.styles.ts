import { Colours } from '../../../../models/Colours';
import { DividerType } from '../../../divider/models/Divider';
import { SubTitleShape } from './models/list-item';

export const subTitle = 'flex flex-row justify-start items-center';
export const chevronIcon = 'h-22 w-22 text-textLight';

export const container = (
  backgroundColor: Colours,
  withPaddingY: boolean,
  withPaddingX: boolean,
  withBorderRadius: boolean,
  showDivider: boolean,
  dividerType: DividerType,
  dividerColor: Colours
) =>
  `flex flex-row justify-between items-center bg-${backgroundColor} cursor-pointer ${
    withBorderRadius ? 'rounded-10' : ''
  } ${withPaddingY ? 'py-4' : ''} ${withPaddingX ? 'px-4' : ''}
   ${showDivider ? `border-t border-${dividerColor} border-${dividerType}` : ''}
  `;

export const getShapeClass = (type: SubTitleShape, subTitleColor: Colours) => {
  switch (type) {
    case 'square':
      return `h-2.5 w-2.5 bg-${subTitleColor}`;
    case 'triangle':
      return `h-0 w-0 border-opacity-0 border-t-0 border-l-5 border-l-tranparent border-r-5 border-r-tranparent border-b-10 border-b-${subTitleColor} shadow-none`;
    case 'circle':
      return `h-2.5 w-2.5 rounded-full bg-${subTitleColor}`;
    default:
      return `h-2.5 w-2.5 rounded-full bg-${subTitleColor}`;
  }
};
