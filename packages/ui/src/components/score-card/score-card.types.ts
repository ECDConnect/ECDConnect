import { ReactElement } from 'react';
import { Colours, ComponentBaseProps } from '../../models';
import { ProgressBarProps } from '../progress-bar';
import { StatusChipProps } from '../status-chip/status-chip';

export interface ScoreCardProps extends ComponentBaseProps {
  image?: ReactElement;
  mainText: string;
  secondaryText?: string;
  hint?: string;
  hintClassName?: ProgressBarProps['hintClassName'];
  progressBarClassName?: ProgressBarProps['className'];
  currentPoints: number;
  maxPoints: number;
  bgColour: Colours;
  barColour: Colours;
  barBgColour: Colours;
  barSize?: ProgressBarProps['size'];
  barStatusChip?: StatusChipProps;
  hideProgressBar?: boolean;
  barDivides?: ProgressBarProps['divides'];
  textColour: Colours;
  textPosition?: ProgressBarProps['textPosition'];
  statusChip?: StatusChipProps;
  onClick?: () => void;
  onClickClassName?: string;
  isHiddenSubLabel?: boolean;
  isBigTitle?: boolean;
}
