import { ComponentBaseProps } from '@ecdlink/ui';

export interface PointsLibraryStatusCardProps extends ComponentBaseProps {
  currentPoints: number;
  maxPoints: number;
  description: string;
}
