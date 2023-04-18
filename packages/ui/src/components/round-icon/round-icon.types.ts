import { Colours } from '../..';

export type RoundIconProps = {
  icon?: string;
  imageUrl?: string;
  hexBackgroundColor?: string;
  backgroundColor?: Colours;
  iconColor?: Colours;
  className?: string;
  size?: IconSize;
  iconSize?: IconSize;
};

type SizeType = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type IconSize = {
  h: SizeType;
  w: SizeType;
};
