import { LanguageDto } from '@ecdlink/core';

export type ActivityDetailsProps = {
  activityId: number;
  isSelected: boolean;
  disabled?: boolean;
  onActivitySelected: () => void;
  onActivityChanged: () => void;
  onBack: () => void;
  availableLanguages?: LanguageDto[];
};
