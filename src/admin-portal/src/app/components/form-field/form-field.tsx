import { UseFormRegister } from 'react-hook-form';

export interface FormFieldProps {
  label: string;
  nameProp: string;
  type?: string;
  error?: string;
  disabled?: boolean;
  register: UseFormRegister<any>;
  required?: any;
  validation?: any;
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
}) => {
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
        className="text-md block font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1">
        <input
          disabled={disabled}
          type={type}
          {...register(nameProp, {
            required: required,
            validate: validation,
          })}
          className={error ? errorStyle : getInputTypeStyles()}
        />

        <span className="text-errorMain text-sm"> {error && error} </span>
      </div>
    </>
  );
};

export default FormField;
