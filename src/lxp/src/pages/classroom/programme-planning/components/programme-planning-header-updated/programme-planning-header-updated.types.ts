import { ProgrammeDto, ProgrammeThemeDto } from '@/../../../packages/core/lib';
import { ComponentBaseProps } from '@ecdlink/ui/';

export interface ProgrammePlanningHeaderProps extends ComponentBaseProps {
  themeName?: string;
  headerText?: string;
  subHeaderText?: any;
  plannedWeeks?: number;
  totalWeeks?: number;
  showCount?: boolean;
  showChips?: boolean;
  theme?: ProgrammeDto;
  chosedTheme?: ProgrammeThemeDto;
  weekSummary?: boolean;
  onChangeAddDay?: () => void;
  onChangeSubDay?: () => void;
  setSelectedDate?: any;
  selectedDate?: Date;
  isWeekendDay?: boolean;
  dateToJump?: Date;
}
