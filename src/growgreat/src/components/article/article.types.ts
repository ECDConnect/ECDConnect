import { ContentConsentTypeEnum } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface ArticleProps extends ComponentBaseProps {
  title?: string | null;
  visible?: boolean | null;
  isOpen?: boolean | null;
  showClose?: boolean | null;
  onClose?: () => void | null;
  consentEnumType?: ContentConsentTypeEnum;
}
