import { Colours, ComponentBaseProps } from '../../../models';
import { classNames, renderIcon } from '../../../utils';
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
import Typography from '../../typography/typography';

export interface FormFieldProps<T extends FieldValues>
  extends ComponentBaseProps {
  label?: string;
  subLabel?: string;
  nameProp?: Path<T>;
  type?: FormFieldType;
  maxCharacters?: number;
  textInputType?: TextInputType;
  error?: FieldError;
  disabled?: boolean;
  prefixIcon?: boolean;
  suffixIcon?: string;
  startIcon?: string;
  startIconColor?: Colours;
  sufficIconColor?: Colours;
  color?: Colours;
  visible?: boolean;
  placeholder?: string;
  name?: string;
  value?: string | number;
  hint?: string;
  isAdminPortalField?: boolean;
  register?: UseFormRegister<T>;
  maxLength?: number;
  min?: number;
  readonly?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  suffixIconAction?: () => void;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isAdminPortalInput?: boolean;
}

export const FormInput = <T extends FieldValues>({
  label,
  subLabel,
  nameProp,
  maxCharacters,
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
  startIcon,
  startIconColor,
  color,
  isAdminPortalField,
  readonly,
  isAdminPortalInput,
  ...restProps
}: FormFieldProps<T>) => {
  const getInputStyle = () => {
    if (readonly) {
      return styles.readonlyInputStyle;
    }
    if (error) {
      return styles.errorStyle;
    }

    if (disabled) {
      if (isAdminPortalField) {
        return styles.portalDisabledInputStyle;
      }
      return styles.disabledInputStyle;
    }

    if (isAdminPortalField) {
      return styles.portalDdefaultInputStyle;
    }

    if (isAdminPortalInput) {
      return styles.adminPortalInputStyle;
    }

    return styles.defaultInputStyle;
  };

  const getInputToRender = () => {
    switch (textInputType) {
      case 'textarea':
        if (nameProp && register) {
          return (
            <textarea
              autoComplete="new-off"
              placeholder={placeholder}
              disabled={disabled || readonly}
              maxLength={maxLength}
              rows={4}
              {...register(nameProp)}
              className={getInputStyle()}
              defaultValue={''}
              onKeyDown={(e: any) => {}}
              style={{
                backgroundColor: isAdminPortalField ? 'adminPortalBg' : '',
              }}
              {...restProps}
            />
          );
        } else {
          return (
            <textarea
              autoComplete="new-off"
              placeholder={placeholder}
              disabled={disabled || readonly}
              rows={4}
              maxLength={maxLength}
              className={getInputStyle()}
              defaultValue={value ?? ''}
              style={{
                backgroundColor: isAdminPortalField ? 'adminPortalBg' : '',
              }}
              value={value}
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
              disabled={disabled || readonly}
              type={type}
              maxLength={maxLength}
              disableAbbreviations={true}
              {...register(nameProp)}
              className={
                disabled
                  ? styles.disabledMoneyInputStyle
                  : error
                  ? styles.errorStyle
                  : styles.defaultMoneyInputStyle
              }
              style={
                prefixIcon || startIcon
                  ? { paddingRight: 38 }
                  : { paddingRight: 16 }
              }
              value={value}
              decimalSeparator="."
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
              disabled={disabled || readonly}
              type={type}
              maxLength={maxLength}
              value={value ?? ''}
              disableAbbreviations={true}
              className={
                disabled
                  ? styles.disabledMoneyInputStyle
                  : error
                  ? styles.errorStyle
                  : styles.defaultMoneyInputStyle
              }
              style={{
                paddingRight: suffixIcon ? 38 : 16,
                paddingLeft: prefixIcon || startIcon ? 20 : 16,
              }}
              decimalSeparator="."
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
              disabled={disabled || readonly}
              type={type}
              maxLength={maxLength}
              {...register(nameProp)}
              className={getInputStyle()}
              style={{
                paddingRight: suffixIcon ? 38 : 16,
                paddingLeft: prefixIcon ? 20 : startIcon ? 50 : 16,
                backgroundColor: isAdminPortalField
                  ? 'adminPortalBg'
                  : color
                  ? `var(--${color})`
                  : 'bg-uiBg',
              }}
              {...restProps}
            />
          );
        } else {
          return (
            <input
              autoComplete="new-off"
              placeholder={placeholder}
              disabled={disabled || readonly}
              type={type}
              maxLength={maxLength}
              className={classNames(
                styles.getBorderClass(value, maxCharacters),
                getInputStyle()
              )}
              value={value}
              style={{
                paddingRight: suffixIcon ? 38 : 16,
                paddingLeft: prefixIcon ? 20 : startIcon ? 50 : 16,
                backgroundColor: color ? `var(--${color})` : 'bg-uiBg',
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
            <label
              htmlFor={nameProp}
              className={
                disabled
                  ? styles.disabledLabel
                  : isAdminPortalInput
                  ? styles.adminPortalLabel
                  : styles.label
              }
            >
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
            <div className={styles.iconWrapperLeft}>
              {!!startIcon &&
                renderIcon(startIcon, `ml-4 h-5 w-5 text-${startIconColor}`)}
              {!!prefixIcon && (
                <span
                  className={`text-${
                    disabled ? 'textLight' : 'textDark'
                  } align-center items-center pl-1 font-semibold`}
                >
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
          {!!maxCharacters && (
            <p
              className={classNames(
                'text-xs',
                value && value?.toString().length > maxCharacters
                  ? 'text-errorMain'
                  : 'text-infoDark'
              )}
            >
              {value?.toString().length || 0}/{maxCharacters} characters used
            </p>
          )}
        </div>
      )}
    </>
  );
};
