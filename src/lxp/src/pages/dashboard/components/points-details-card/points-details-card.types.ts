import { Colours, ComponentBaseProps } from '@ecdlink/ui';

export interface PointsDetailsCardProps extends ComponentBaseProps {
  pointsEarned: number;
  activityCount: number;
  title: string;
  description?: string;
  size?: 'large' | 'medium';
  colour?: Colours;
  badgeColour?: Colours;
}
