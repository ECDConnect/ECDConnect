import { ContentConsentTypeEnum } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface ArticleProps extends ComponentBaseProps {
  title?: string;
  visible: boolean;
  isOpen?: boolean;
  showClose?: boolean;
  onClose: () => void;
  consentEnumType: ContentConsentTypeEnum;
}
