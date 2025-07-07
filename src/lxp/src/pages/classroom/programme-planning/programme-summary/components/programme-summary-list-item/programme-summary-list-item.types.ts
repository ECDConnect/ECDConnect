import { ComponentBaseProps } from '@ecdlink/ui';

export interface ProgrammeSummaryListItemProps extends ComponentBaseProps {
  title: string;
  subTitle: string;
  isCompleted: boolean;
  programmeWeek: number;
  onClick: () => void;
}
