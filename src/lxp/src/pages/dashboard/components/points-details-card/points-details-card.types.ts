import { ComponentBaseProps } from '@ecdlink/ui';

export interface PointsDetailsCardProps extends ComponentBaseProps {
  pointsEarned: number;
  activityCount: number;
  description: string;
  isShare?: boolean;
}
