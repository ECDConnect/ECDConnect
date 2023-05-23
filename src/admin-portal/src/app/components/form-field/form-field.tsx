import { UseFormRegister } from 'react-hook-form';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { useState } from 'react';

export interface FormFieldProps {
  label: string;
  nameProp: string;
  type?: string;
  error?: string;
  disabled?: boolean;
  register: UseFormRegister<any>;
  required?: any;
  validation?: any;
  instructions?: string[];
  placeholder?: string;
}

const checkboxStyle =
  'focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded';
const errorStyle =
  'block w-full pr-10 border-errorMain text-errorMain placeholder-errorMain focus:outline-none focus:ring-errorMain focus:border-errorMain sm:text-sm rounded-md';
const defaultInputStyle =
  'focus:border-primary block w-full sm:text-md border-gray-300 rounded-md p-10';

const FormField: React.FC<FormFieldProps> = ({
  label,
  nameProp,
  type = 'text',
  error,
  disabled = false,
  register,
  required,
  validation,
  instructions,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getInputTypeStyles = () => {
    switch (type) {
      case 'checkbox':
        return checkboxStyle;
      default:
        return defaultInputStyle;
    }
  };

  return (
    <>
      <label
        htmlFor={nameProp}
        className="block text-lg font-medium text-gray-800"
      >
        {label}
      </label>
      <div>
        {instructions.length === 1 ? (
          <p className="text-base">{instructions[0]}</p>
        ) : (
          <ul className="list-disc pl-6">
            {instructions.map((i: string) => {
              return <li>{i}</li>;
            })}
          </ul>
        )}
      </div>
      <div className={type === 'password' ? 'mt-1 flex' : 'mt-1'}>
        <input
          disabled={disabled}
          type={showPassword ? 'text' : 'password'}
          {...register(nameProp, {
            required: required,
            validate: validation,
          })}
          className={error ? errorStyle : getInputTypeStyles()}
          placeholder={placeholder}
        />

        {type === 'password' && (
          <button
            type="button"
            className="focus:outline-none ml-2"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        )}

        <span className="text-errorMain text-sm"> {error && error} </span>
      </div>
    </>
  );
};

export default FormField;
