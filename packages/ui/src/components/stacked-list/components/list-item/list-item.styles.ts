import { Colours } from '../../../../models/Colours';
import { DividerType } from '../../../divider/models/Divider';
import { SubTitleShape } from './models/list-item';

export const subTitle = 'flex flex-row justify-start items-center';
export const chevronIcon = 'h-5 w-5 text-textLight';

export const container = (
  backgroundColor: Colours,
  withPaddingY: boolean,
  withPaddingX: boolean,
  showDivider: boolean,
  dividerType: DividerType,
  dividerColor: Colours
) =>
  `w-full flex flex-row justify-between items-center bg-${backgroundColor} cursor-pointer ${withPaddingY ? 'py-3' : ''
  } ${withPaddingX ? 'px-4' : ''}
   ${showDivider
    ? `border-t border-${dividerColor} border-${dividerType}`
    : ''
  }
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
