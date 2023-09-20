import { ComponentBaseProps } from '@ecdlink/ui';

export interface PointsProgressCardProps extends ComponentBaseProps {
  currentPoints: number;
  maxPoints: number;
  description: string;
}
