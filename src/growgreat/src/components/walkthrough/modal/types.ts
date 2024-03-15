import { LanguageSelectorProps } from '@/components/language-selector/language-selector';

export interface WalkthroughModalProps {
  onStart: () => void;
  onClose: () => void;
  availableLanguages?: LanguageSelectorProps['availableLanguages'];
}
