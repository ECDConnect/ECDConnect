import { ComponentBaseProps } from '@ecdlink/ui';

export interface PointsSummaryCardProps extends ComponentBaseProps {
  currentPoints: number;
  maxPoints: number;
  showIcon: boolean;
  useColourBackground: boolean;
  onClick?: () => void;
}
