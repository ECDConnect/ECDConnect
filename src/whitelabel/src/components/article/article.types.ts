import { ContentConsentTypeEnum } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface ArticleProps extends ComponentBaseProps {
  visible: boolean;
  consentEnumType: ContentConsentTypeEnum;
  title?: string;
  showClose?: boolean;
  isOpen?: boolean;
  onClose: () => void;
}
