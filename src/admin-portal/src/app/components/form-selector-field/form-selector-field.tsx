import { UseFormRegister } from 'react-hook-form';

export interface FormSelectorFieldProps {
  label: string;
  subLabel?: string;
  options: any[]; // KEY / VALUE
  nameProp: string;
  error?: string;
  disabled?: boolean;
  isColor?: boolean;
  multiple?: boolean;
  register: UseFormRegister<any>;
}

const errorStyle =
  'block w-full pr-10 border-errorMain text-errorMain placeholder-errorMain focus:outline-none focus:ring-errorMain focus:border-errorMain sm:text-sm rounded-md';
const defaultInputStyle =
  'shadow-sm focus:ring-secondary focus:border-secondary block w-full sm:text-sm border-gray-300 rounded-md';

const FormSelectorField: React.FC<FormSelectorFieldProps> = ({
  label,
  subLabel,
  nameProp,
  error,
  options,
  disabled = false,
  isColor = false,
  multiple = false,
  register,
}) => {
  return (
    <>
      <label
        htmlFor={nameProp}
        className="block text-lg font-medium text-gray-700"
      >
        {label}
      </label>
      {subLabel && (
        <label
          htmlFor={nameProp}
          className="text-textLight block text-sm font-medium"
        >
          {subLabel}
        </label>
      )}
      <div className="mt-1">
        <select
          disabled={disabled}
          {...register(nameProp)}
          className={error ? errorStyle : defaultInputStyle}
          multiple={multiple}
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
