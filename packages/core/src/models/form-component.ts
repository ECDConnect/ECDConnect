import { ComponentBaseProps } from '@ecdlink/ui';

export interface FormComponentProps<T> extends ComponentBaseProps {
  onSubmit: (formValue: T) => void;
}
