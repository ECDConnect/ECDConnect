import { ActivityDto } from '@ecdlink/core';

export type ActivityCardProps = {
  activity: ActivityDto;
  recommended?: boolean;
  recommendedText?: string;
  warningText?: string;
  selected: boolean;
  onSelected: () => void;
  onDeselection: () => void;
  onClose: () => void;
};
