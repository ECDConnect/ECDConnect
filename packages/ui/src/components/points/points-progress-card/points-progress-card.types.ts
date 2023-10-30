import { ComponentBaseProps } from '../../../models';

export interface PointsProgressCardProps extends ComponentBaseProps {
  currentPoints: number;
  maxPoints: number;
  description: string;
  badgeImage: JSX.Element;
}
