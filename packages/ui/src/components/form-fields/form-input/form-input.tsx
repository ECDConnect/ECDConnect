import { Colours, ComponentBaseProps } from '../../../models';
import { renderIcon } from '../../../utils';
import {
  FieldError,
  Path,
  UseFormRegister,
  FieldValues,
} from 'react-hook-form';
import * as styles from './form-input.style';
export type FormFieldType = 'text' | 'number' | 'password';
export type TextInputType = 'input' | 'textarea' | 'date';

interface FormFieldProps<T extends FieldValues> extends ComponentBaseProps {
  label?: string;
  nameProp?: Path<T>;
  type?: FormFieldType;
  textInputType?: TextInputType;
  error?: FieldError;
  disabled?: boolean;
  suffixIcon?: string;
  sufficIconColor?: Colours;
  visible?: boolean;
  placeholder?: string;
  value?: string | number;
  hint?: string;
  register?: UseFormRegister<T>;
  maxLength?: number;
  suffixIconAction?: () => void;
}

export const FormInput = <T extends FieldValues>({
  label,
  nameProp,
  type = 'text',
  textInputType = 'input',
  error,
  disabled = false,
  suffixIcon,
  visible = true,
  className,
  placeholder,
  sufficIconColor = 'black',
  suffixIconAction,
  register,
  value,
  hint,
  maxLength,
}: FormFieldProps<T>) => {
  const getInputToRender = () => {
    switch (textInputType) {
      case 'textarea':
        if (nameProp && register) {
          return (
            <textarea
              autoComplete="new-off"
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              rows={4}
              {...register(nameProp)}
              className={error ? styles.errorStyle : styles.defaultInputStyle}
              defaultValue={''}
            />
          );
        } else {
          return (
            <textarea
              autoComplete="new-off"
              placeholder={placeholder}
              disabled={disabled}
              rows={4}
              maxLength={maxLength}
              className={error ? styles.errorStyle : styles.defaultInputStyle}
              defaultValue={value ?? ''}
            />
          );
        }
      case 'input':
      default:
        if (nameProp && register) {
          return (
            <input
              autoComplete="new-off"
              placeholder={placeholder}
              disabled={disabled}
              type={type}
              maxLength={maxLength}
              {...register(nameProp)}
              className={error ? styles.errorStyle : styles.defaultInputStyle}
            />
          );
        } else {
          return (
            <input
              autoComplete="new-off"
              placeholder={placeholder}
              disabled={disabled}
              type={type}
              value={value ?? ''}
              maxLength={maxLength}
              className={error ? styles.errorStyle : styles.defaultInputStyle}
            />
          );
        }
    }
  };

  return (
    <>
      {visible && (
        <div className={className}>
          <label htmlFor={nameProp} className={styles.label}>
            {label}
          </label>
          {hint && <label className={styles.hintStyle}>{hint}</label>}
          <div className={styles.inputWrapper}>
            {getInputToRender()}

            <div className={styles.iconWrapper} onClick={suffixIconAction}>
              {!!suffixIcon &&
                renderIcon(suffixIcon, `h-5 w-5 text-${sufficIconColor}`)}
            </div>
          </div>

          <span className="text-errorMain text-xs"> {error?.message} </span>
        </div>
      )}
    </>
  );
};
