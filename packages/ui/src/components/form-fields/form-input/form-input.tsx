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
export type TextInputType = 'input' | 'textarea' | 'date' | 'moneyInput';
import CurrencyInput from 'react-currency-input-field';

interface FormFieldProps<T extends FieldValues> extends ComponentBaseProps {
  label?: string;
  subLabel?: string;
  nameProp?: Path<T>;
  type?: FormFieldType;
  textInputType?: TextInputType;
  error?: FieldError;
  disabled?: boolean;
  prefixIcon?: boolean;
  suffixIcon?: string;
  sufficIconColor?: Colours;
  visible?: boolean;
  placeholder?: string;
  value?: string | number;
  hint?: string;
  register?: UseFormRegister<T>;
  maxLength?: number;
  min?: number;
  suffixIconAction?: () => void;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const FormInput = <T extends FieldValues>({
  label,
  subLabel,
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
  prefixIcon,
  ...restProps
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
              {...restProps}
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
              {...restProps}
            />
          );
        }
      case 'moneyInput':
        if (nameProp && register) {
          return (
            <CurrencyInput
              id="validation-example-2-field"
              allowDecimals={true}
              step={10}
              autoComplete="new-off"
              placeholder={placeholder}
              disabled={disabled}
              type={type}
              maxLength={maxLength}
              {...register(nameProp)}
              className={
                error ? styles.errorStyle : styles.defaultMoneyInputStyle
              }
              style={prefixIcon ? { paddingRight: 38 } : { paddingRight: 16 }}
              {...restProps}
            />
          );
        } else {
          return (
            <CurrencyInput
              id="validation-example-2-field"
              allowDecimals={true}
              step={10}
              autoComplete="new-off"
              placeholder={placeholder}
              disabled={disabled}
              type={type}
              maxLength={maxLength}
              value={value ?? ''}
              className={
                error ? styles.errorStyle : styles.defaultMoneyInputStyle
              }
              style={{
                paddingRight: suffixIcon ? 38 : 16,
                paddingLeft: prefixIcon ? 20 : 16,
              }}
              {...restProps}
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
              style={{
                paddingRight: suffixIcon ? 38 : 16,
                paddingLeft: prefixIcon ? 20 : 16,
              }}
              {...restProps}
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
              style={{
                paddingRight: suffixIcon ? 38 : 16,
                paddingLeft: prefixIcon ? 20 : 16,
              }}
              {...restProps}
            />
          );
        }
    }
  };

  return (
    <>
      {visible && (
        <div className={className}>
          {label && (
            <label htmlFor={nameProp} className={styles.label}>
              {label}
            </label>
          )}
          {subLabel && (
            <label htmlFor={nameProp} className={styles.subLabel}>
              {subLabel}
            </label>
          )}
          {hint && <label className={styles.hintStyle}>{hint}</label>}
          <div className={styles.inputWrapper}>
            {getInputToRender()}
            <div className={styles.iconWrapperLeft} onClick={suffixIconAction}>
              {!!prefixIcon && (
                <span className="text-textDark align-center items-center pl-1 font-semibold">
                  R
                </span>
              )}
            </div>
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
