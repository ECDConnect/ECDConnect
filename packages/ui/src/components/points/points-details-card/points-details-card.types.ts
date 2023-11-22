import { Colours, ComponentBaseProps } from '../../../models';

export interface PointsDetailsCardProps extends ComponentBaseProps {
  pointsEarned: number;
  activityCount: number;
  title: string;
  description?: string;
  size?: 'large' | 'medium';
  colour?: Colours;
  isShare?: boolean;
  badgeImage: JSX.Element;
  badgeTextColour?: Colours;
  textColour?: Colours;
}
