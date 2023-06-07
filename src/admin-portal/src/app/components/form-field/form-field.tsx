import { UseFormRegister } from 'react-hook-form';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

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
  togglePasswordVisibility?: () => void;
  showPassword?: boolean;
  customStyle?: string;
  defaultValue?: any;
}

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
  togglePasswordVisibility,
  showPassword,
  customStyle,
  defaultValue,
}) => {
  const checkboxStyle =
    'focus:ring-secondary h-6 w-6 text-secondary border-gray-600 rounded';
  const errorStyle =
    'block w-full pr-10 border-errorMain text-errorMain placeholder-errorMain focus:outline-none focus:ring-errorMain focus:border-errorMain sm:text-sm rounded-md';
  const defaultInputStyle = !customStyle
    ? 'focus:border-secondary block w-full sm:text-md bg-Ui-Light rounded-md p-10'
    : customStyle;

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
        {instructions?.length && instructions.length === 1 ? (
          type === 'email' && <p className="text-base">{instructions[0]}</p>
        ) : (
          <ul className="list-disc pl-6">
            {instructions?.map((i: string) => {
              return (
                <li key={i} className="text-base">
                  {i}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div
        className={
          type === 'password'
            ? 'relative mt-1'
            : type === 'checkbox'
            ? 'mt-2 flex'
            : 'mt-1'
        }
      >
        <input
          defaultValue={defaultValue}
          disabled={disabled}
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          {...register(nameProp, {
            required: required,
            validate: validation,
          })}
          className={error ? errorStyle : getInputTypeStyles()}
          placeholder={placeholder}
        />
        {type === 'checkbox' && nameProp === 'terms' && (
          <a className="text-md text-secondary mb-3 pl-2" href="/terms">
            {instructions[0] ?? ''}
          </a>
        )}

        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center justify-center px-4"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeIcon className="h-5 w-5 text-gray-900" />
            ) : (
              <EyeOffIcon className="h-5 w-5 text-gray-900" />
            )}
          </button>
        )}

        <span className="text-errorMain text-sm"> {error && error} </span>
      </div>
    </>
  );
};

export default FormField;
