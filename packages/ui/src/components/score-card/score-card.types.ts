import { ReactElement } from 'react';
import { Colours, ComponentBaseProps } from '../../models';
import { ProgressBarProps } from '../progress-bar';

export interface ScoreCardProps extends ComponentBaseProps {
  image?: ReactElement;
  mainText: string;
  secondaryText?: string;
  hint?: string;
  hintClassName?: ProgressBarProps['hintClassName'];
  currentPoints: number;
  maxPoints: number;
  bgColour: Colours;
  barColour: Colours;
  barBgColour: Colours;
  textColour: Colours;
  textPosition?: ProgressBarProps['textPosition'];
  onClick?: () => void;
}
