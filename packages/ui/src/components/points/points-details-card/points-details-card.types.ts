import { Colours, ComponentBaseProps } from '../../../models';

export interface PointsDetailsCardProps extends ComponentBaseProps {
  id?: string;
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
  hideActivityCount?: boolean;
}
