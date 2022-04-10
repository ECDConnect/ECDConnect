import {
  DeepMap,
  FieldError,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

export interface FormComponentProps<T> {
  errors?: DeepMap<T, FieldError>;
  register: UseFormRegister<T>;
  getValues: UseFormGetValues<T>;
  setValue: UseFormSetValue<T>;
}
