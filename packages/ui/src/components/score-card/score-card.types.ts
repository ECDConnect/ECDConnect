import { ReactElement } from 'react';
import { Colours, ComponentBaseProps } from '../../models';

export interface ScoreCardProps extends ComponentBaseProps {
  image?: ReactElement;
  mainText: string;
  secondaryText?: string;
  hint?: string;
  currentPoints: number;
  maxPoints: number;
  bgColour: Colours;
  barColour: Colours;
  barBgColour: Colours;
  textColour: Colours;
  onClick?: () => void;
}
