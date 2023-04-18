import { Colours, SubTitleShape } from '@ecdlink/ui';

export const subTitle = 'flex flex-row justify-start items-center';

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
