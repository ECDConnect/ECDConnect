import { ComponentBaseProps } from '@ecdlink/ui';

export interface ProgrammeWeekPagingProps extends ComponentBaseProps {
  maxIndex: number;
  activeIndex: number;
  onBack: () => void;
  onNext: () => void;
}
