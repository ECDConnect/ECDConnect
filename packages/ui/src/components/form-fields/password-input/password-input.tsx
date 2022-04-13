import { PasswordStrengthMeter } from '../../password-strength-meter/password-strength-meter';
import {
  Colours,
  ComponentBaseProps,
  containsLowerCaseRegex,
  containsNumericRegex,
  containsUpperCaseRegex,
} from '../../../models';
import { useEffect } from 'react';
import { useState } from 'react';
import { FieldError } from 'react-hook-form';
import { Path, UseFormRegister } from 'react-hook-form';
import { PasswordStrength } from '../../password-strength-meter/models/PasswordStrength';
import { FormFieldType, FormInput } from '../form-input/form-input';

interface PasswordInputProps<T> extends ComponentBaseProps {
  label?: string;
  nameProp?: Path<T>;
  error?: FieldError;
  disabled?: boolean;
  visible?: boolean;
  placeholder?: string;
  sufficIconColor?: Colours;
  value: string;
  strengthMeterVisible?: boolean;
  register?: UseFormRegister<T>;
}

interface PasswordChangedEvent {
  type: PasswordStrength;
  message: string;
}

export const PasswordInput = <T,>({
  nameProp,
  register,
  className,
  visible,
  label,
  testId,
  disabled,
  value,
  placeholder,
  sufficIconColor,
  error,
  strengthMeterVisible = false,
}: PasswordInputProps<T>) => {
  const [inputType, setInputType] = useState<FormFieldType>('password');
  const [suffixIcon, setSuffixIcon] = useState<string>('EyeIcon');

  const [passwordMeterType, setPasswordMeterType] = useState<PasswordStrength>(
    PasswordStrength.none
  );

  const [passwordMeterMessage, setPasswordMeterMessage] = useState<string>('');
  const [passwordMeterVisibility, setPasswordMeterVisibility] =
    useState<boolean>(false);
  const updateIcon = (fieldType: FormFieldType) => {
    const newFieldType = fieldType === 'password' ? 'text' : 'password';
    const newFieldIcon = newFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon';

    setInputType(newFieldType);
    setSuffixIcon(newFieldIcon);
  };

  useEffect(() => {
    if (value && value.length > 0) {
      setPasswordMeterVisibility(true);
    }
    const passwordChangedEvent = getPasswordLevel(value);

    setPasswordMeterType(passwordChangedEvent.type);
  }, [value]);

  const getPasswordLevel = (value: string): PasswordChangedEvent => {
    const defaultReturnValue: PasswordChangedEvent = {
      type: PasswordStrength.none,
      message: '',
    };

    if (value && value.length === 0) {
      return defaultReturnValue;
    }

    let errorCount = 4;
    let passwordMessage: string | null = null;

    if (value.match(containsLowerCaseRegex)) {
      errorCount -= 1;
    } else {
      passwordMessage = 'Password must contain at least 1 lowercase character';
      setPasswordMeterMessage(passwordMessage);
    }

    if (value.match(containsUpperCaseRegex)) {
      errorCount -= 1;
      if (!passwordMessage) {
        setPasswordMeterMessage('');
      }
    } else {
      passwordMessage = 'Password must contain at least 1 uppercase character';
      setPasswordMeterMessage(passwordMessage);
    }

    if (value.match(containsNumericRegex)) {
      errorCount -= 1;
      if (!passwordMessage) {
        setPasswordMeterMessage('');
      }
    } else {
      passwordMessage = 'Password must contain at least 1 numeric character';
      setPasswordMeterMessage(passwordMessage);
    }

    if (value.length >= 8) {
      errorCount -= 1;
      if (!passwordMessage) {
        setPasswordMeterMessage('');
      }
    } else {
      if (value.length > 0) {
        passwordMessage = 'Password must be at least 8 characters';
        setPasswordMeterMessage(passwordMessage);
      }
    }

    if (errorCount === 0) {
      defaultReturnValue.type = PasswordStrength.veryGood;
      setPasswordMeterMessage('Very Good');
    } else if (errorCount === 1 || errorCount === 2) {
      defaultReturnValue.type = PasswordStrength.weak;
    } else if (errorCount === 3) {
      defaultReturnValue.type = PasswordStrength.error;
    } else if (errorCount === 4 && value.length === 0) {
      defaultReturnValue.type = PasswordStrength.none;
    } else if (errorCount === 4 && value.length > 0) {
      defaultReturnValue.type = PasswordStrength.error;
    }

    return defaultReturnValue;
  };

  return (
    <div className={className} data-testid={testId}>
      <FormInput<T>
        className="mb-1"
        visible={visible}
        nameProp={nameProp}
        register={register}
        disabled={disabled}
        error={error}
        label={label}
        placeholder={placeholder}
        type={inputType}
        suffixIcon={suffixIcon}
        sufficIconColor={sufficIconColor}
        suffixIconAction={() => {
          updateIcon(inputType);
        }}
      ></FormInput>
      {strengthMeterVisible && passwordMeterVisibility && value.length > 0 && (
        <PasswordStrengthMeter
          type={passwordMeterType}
          message={passwordMeterMessage}
        ></PasswordStrengthMeter>
      )}
    </div>
  );
};
