import { Colours } from '../../../models/Colours';

export type CelebrationCardProps = {
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
