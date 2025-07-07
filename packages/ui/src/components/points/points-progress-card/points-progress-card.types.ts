import { ComponentBaseProps } from '../../../models';
import { ProgressBarProps } from '../../progress-bar';
import { RoundIconProps } from '../../round-icon/round-icon.types';

export interface PointsProgressCardProps extends ComponentBaseProps {
  icon?: RoundIconProps['icon'];
  imageUrl?: RoundIconProps['imageUrl'];
  currentPoints: number;
  maxPoints?: number;
  description: string;
  badgeImage: JSX.Element;
  barColour?: ProgressBarProps['primaryColour'];
  isYearView?: boolean;
  hideProgressBar?: boolean;
}
