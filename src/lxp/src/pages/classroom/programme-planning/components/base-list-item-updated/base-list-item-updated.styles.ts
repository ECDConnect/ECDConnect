import { Colours } from '@ecdlink/ui';
import { DividerType } from '@ecdlink/ui';

export const subTitle = 'flex flex-row justify-start items-center  w-1/3';
export const icon = (iconColor: Colours) => `h-5 w-5 text-${iconColor}`;

export const container = (
  backgroundColor: Colours,
  dividerType: DividerType,
  dividerColor: Colours
) =>
  `w-full flex flex-row justify-between items-center bg-${backgroundColor} cursor-pointer border-t border-${dividerColor} border-${dividerType} `;
