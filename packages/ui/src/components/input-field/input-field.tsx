import * as styles from './input-field.styles';
import React from 'react';
import PasswordStrengthMeter from '../password-strength-meter/password-strength-meter';
import { renderIcon } from '../../utils';
import { ComponentBaseProps } from '../../models';
import { PasswordStrength } from '../password-strength-meter/models/PasswordStrength';
export type InputFieldType = 'text' | 'number' | 'password' | 'email';

export interface InputFieldProps extends ComponentBaseProps {
  type: InputFieldType;
  placeHolder?: string;
  label?: string;
  id: string;
  name: string;
  required: boolean;
  description?: string;
  descriptions?: string[];
  errors?: string[];
  preFillValue?: string;
  onChange?: (name: any, value: any) => void;
  onIconClick?: (id: any, name: any) => void;
  trailingIcon?: string;
  passwordStrengthType?: PasswordStrength;
  passwordStrengthMessage?: string;
}

export const InputField: React.FC<InputFieldProps> = (props) => {
  const [inputValue, setInputValue] = React.useState(() =>
    props.preFillValue ? props.preFillValue : ''
  );

  const inputChanged = (event: any) => {
    const value = event.target.value;
    const name = event.target.name;

    setInputValue(value);

    if (props.onChange) {
      props.onChange(name, value);
    }
  };

  const iconClicked = () => {
    if (props.onIconClick) {
      props.onIconClick(props.id, props.name);
    }
  };

  const getInputClass = () => {
    return props.errors ? styles.inputInvalid : styles.inputValid;
  };

  const getIconClass = () => {
    return props.errors ? styles.iconError : styles.icon;
  };

  return (
    <div className={props.className ? props.className : ''}>
      {props.label && (
        <label htmlFor={props.id} className={styles.label}>
          {props.label}
        </label>
      )}
      {props.description && (
        <div
          className={styles.descriptionParagraph}
          id={props.id + '-description'}
        >
          {props.description}
        </div>
      )}
      <div className={styles.inputWrapper}>
        <input
          style={{ width: '100%' }}
          type={props.type}
          name={props.name}
          id={props.id}
          className={getInputClass()}
          placeholder={props.placeHolder}
          required={props.required}
          value={inputValue}
          onChange={(event) => inputChanged(event)}
        />
        <div
          className={styles.iconWrapper}
          onClick={() => {
            iconClicked();
          }}
        >
          {props.trailingIcon && renderIcon(props.trailingIcon, getIconClass())}
        </div>
      </div>
      {props.passwordStrengthType && (
        <PasswordStrengthMeter
          type={props.passwordStrengthType}
          message={props.passwordStrengthMessage}
        ></PasswordStrengthMeter>
      )}
      {props.errors && props.errors.length && (
        <ol className={styles.descriptionList}>
          {props.errors.map((error, index) => {
            return (
              <li
                key={index}
                className={styles.errorListItem}
                id={props.id + '-errors-' + index}
              >
                {error}
              </li>
            );
          })}
        </ol>
      )}

      {props.descriptions && props.descriptions.length && (
        <ol className={styles.descriptionList}>
          {props.descriptions.map((description, index) => {
            return (
              <li
                key={props.id + 'descriptions-list-key-' + index}
                className={styles.descriptionListItem}
                id={props.id + '-descriptions-' + index}
              >
                {description}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default InputField;
