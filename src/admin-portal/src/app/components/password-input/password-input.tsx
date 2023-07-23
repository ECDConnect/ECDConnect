import {
  Colours,
  ComponentBaseProps,
  PasswordStrengthMeter,
  Typography,
  containsLowerCaseRegex,
  containsNumericRegex,
  containsUpperCaseRegex,
} from '@ecdlink/ui';
import {
  FormFieldType,
  FormInput,
} from '@ecdlink/ui/lib/components/form-fields/form-input/form-input';
import { PasswordStrength } from '@ecdlink/ui/lib/components/password-strength-meter/models/PasswordStrength';
import { useEffect } from 'react';
import { useState } from 'react';
import { FieldError, FieldValues } from 'react-hook-form';
import { Path, UseFormRegister } from 'react-hook-form';

interface PasswordInputProps<T extends FieldValues> extends ComponentBaseProps {
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
  className?: string;
}

interface PasswordChangedEvent {
  type: PasswordStrength;
  message: string;
}

interface PasswordConstraints {
  characterCount: boolean;
  uppercase: boolean;
  lowercase: boolean;
  numeric: boolean;
}

export const PasswordInput = <T extends FieldValues>({
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
  const [passwordConstraintMessage, setPasswordConstraintMessage] =
    useState<PasswordConstraints>({
      characterCount: false,
      uppercase: false,
      lowercase: false,
      numeric: false,
    });

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
      setPasswordConstraintMessage((curr) => ({ ...curr, lowercase: true }));
    } else {
      passwordMessage = 'Password must contain at least 1 lowercase character';
      setPasswordMeterMessage(passwordMessage);
      setPasswordConstraintMessage((curr) => ({ ...curr, lowercase: false }));
    }

    if (value.match(containsUpperCaseRegex)) {
      errorCount -= 1;
      setPasswordConstraintMessage((curr) => ({ ...curr, uppercase: true }));
      if (!passwordMessage) {
        setPasswordMeterMessage('');
      }
    } else {
      passwordMessage = 'Password must contain at least 1 uppercase character';
      setPasswordMeterMessage(passwordMessage);
      setPasswordConstraintMessage((curr) => ({ ...curr, uppercase: false }));
    }

    if (value.match(containsNumericRegex)) {
      errorCount -= 1;
      setPasswordConstraintMessage((curr) => ({ ...curr, numeric: true }));
      if (!passwordMessage) {
        setPasswordMeterMessage('');
      }
    } else {
      passwordMessage = 'Password must contain at least 1 numeric character';
      setPasswordMeterMessage(passwordMessage);
      setPasswordConstraintMessage((curr) => ({ ...curr, numeric: false }));
    }

    if (value.length >= 8) {
      errorCount -= 1;
      setPasswordConstraintMessage((curr) => ({
        ...curr,
        characterCount: true,
      }));
      if (!passwordMessage) {
        setPasswordMeterMessage('');
      }
    } else {
      if (value.length > 0) {
        passwordMessage = 'Password must be at least 8 characters';
        setPasswordMeterMessage(passwordMessage);
        setPasswordConstraintMessage((curr) => ({
          ...curr,
          characterCount: false,
        }));
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
    <>
      <label
        htmlFor={nameProp}
        className="block text-lg font-medium text-gray-800"
      >
        {label}
      </label>
      {strengthMeterVisible &&
        Object.values(passwordConstraintMessage).some((a) => !a) && (
          <ul className="mb-4 list-disc pl-5 text-black">
            {!passwordConstraintMessage.characterCount && (
              <li>
                <Typography // TODO: Fix help text font-family
                  text={'At least 8 characters'}
                  type={'help'}
                  color={'black'}
                />
              </li>
            )}
            {!passwordConstraintMessage.numeric && (
              <li>
                <Typography
                  text={'At least 1 number'}
                  type={'help'}
                  color={'black'}
                />
              </li>
            )}
            {!passwordConstraintMessage.uppercase && (
              <li>
                <Typography
                  text={'At least 1 capital letter'}
                  type={'help'}
                  color={'black'}
                />
              </li>
            )}
            {!passwordConstraintMessage.lowercase && (
              <li>
                <Typography
                  text={'At least 1 lowercase letter'}
                  type={'help'}
                  color={'black'}
                />
              </li>
            )}
          </ul>
        )}
      <div className={className} data-testid={testId}>
        <FormInput<T>
          className="mb-1"
          visible={visible}
          nameProp={nameProp}
          register={register}
          disabled={disabled}
          error={error}
          placeholder={placeholder}
          type={inputType}
          suffixIcon={suffixIcon}
          sufficIconColor={sufficIconColor}
          suffixIconAction={() => {
            updateIcon(inputType);
          }}
        ></FormInput>
        {strengthMeterVisible &&
          passwordMeterVisibility &&
          value.length > 0 && (
            <PasswordStrengthMeter
              type={passwordMeterType}
              message={passwordMeterMessage}
            ></PasswordStrengthMeter>
          )}
      </div>
    </>
  );
};
