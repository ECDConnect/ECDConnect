import { UseFormRegister } from 'react-hook-form';

export interface FormSelectorFieldProps {
  label: string;
  options: any[]; // KEY / VALUE
  nameProp: string;
  error?: string;
  disabled?: boolean;
  isColor?: boolean;
  register: UseFormRegister<any>;
}

const errorStyle =
  'block w-full pr-10 border-errorMain text-errorMain placeholder-errorMain focus:outline-none focus:ring-errorMain focus:border-errorMain sm:text-sm rounded-md';
const defaultInputStyle =
  'shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md';

const FormSelectorField: React.FC<FormSelectorFieldProps> = ({
  label,
  nameProp,
  error,
  options,
  disabled = false,
  isColor = false,
  register,
}) => {
  return (
    <>
      <label htmlFor={nameProp} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <select
          disabled={disabled}
          {...register(nameProp)}
          className={error ? errorStyle : defaultInputStyle}
        >
          {options &&
            options.map((option) => {
              return (
                <option
                  style={isColor ? { backgroundColor: option.value } : {}}
                  key={option.key}
                  value={option.key}
                >
                  {option.value}
                </option>
              );
            })}
        </select>

        <span className="text-errorMain text-xs"> {error && error} </span>
      </div>
    </>
  );
};

export default FormSelectorField;
