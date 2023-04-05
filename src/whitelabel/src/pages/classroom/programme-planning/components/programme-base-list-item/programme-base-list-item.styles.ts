import { Colours, DividerType } from '@ecdlink/ui';

export const subTitle =
  'flex flex-row justify-start items-center  w-full truncate';
export const icon = (iconColor: Colours) => `h-5 w-5 text-${iconColor}`;

export const container = (
  backgroundColor: Colours,
  dividerType: DividerType,
  dividerColor: Colours,
  borderRadius: string
) =>
  `w-full justify-between items-center bg-${backgroundColor} cursor-pointer py-3 px-4 border-t border-${dividerColor} border-${dividerType} rounded-${borderRadius}`;
