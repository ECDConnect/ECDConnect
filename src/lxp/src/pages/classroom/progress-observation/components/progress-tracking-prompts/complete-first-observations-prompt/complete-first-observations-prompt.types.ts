import { ComponentBaseProps } from '@ecdlink/ui';

export interface CompleteFirstObservationsPromptProps
  extends ComponentBaseProps {
  onSaveAndComplete: () => void;
  onCancel: () => void;
  firstName: string;
}
