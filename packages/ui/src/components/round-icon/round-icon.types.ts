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
  iconClassName?: string;
};

type SizeType =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '12'
  | '16';

export type IconSize = {
  h: SizeType;
  w: SizeType;
};
