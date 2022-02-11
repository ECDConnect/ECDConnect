import { ComponentBaseProps } from '@ecdlink/ui/';

export interface ProgrammePlanningHeaderProps extends ComponentBaseProps {
  themeName?: string;
  headerText?: string;
  subHeaderText?: string;
  plannedWeeks?: number;
  totalWeeks?: number;
  showCount?: boolean;
  showChips?: boolean;
}
