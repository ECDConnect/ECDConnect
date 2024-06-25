import { LanguageSelectorProps } from '@/components/language-selector/language-selector';

export interface WalkthroughModalProps {
  onStart: () => void;
  availableLanguages?: LanguageSelectorProps['availableLanguages'];
}
