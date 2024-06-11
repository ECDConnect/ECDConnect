import { Colours } from '../../../models/Colours';

export type CelebrationCardProps = {
  className?: string;
  image: JSX.Element;
  primaryMessage: string;
  secondaryMessage: string;
  scoreMessage?: string;
  scoreIcon?: string;
  primaryTextColour: Colours;
  secondaryTextColour?: Colours;
  backgroundColour: Colours;
  onDismiss?: () => void;
};
