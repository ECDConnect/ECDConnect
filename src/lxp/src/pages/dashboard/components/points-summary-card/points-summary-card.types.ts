import { ComponentBaseProps } from '@ecdlink/ui';

export interface PointsSummaryCardProps extends ComponentBaseProps {
  currentPoints: number;
  maxPoints: number;
  onClick: () => void;
}
