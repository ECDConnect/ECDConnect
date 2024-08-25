import { useDialog } from '@ecdlink/core';
import { DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import ColorPickerComponent from '../color-picker/color-picker';

export interface FormFieldProps {
  label: string;
  nameProp: string;
  currentColor: string;
  error?: string;
  disabled?: boolean;
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  isAdminPortalField?: boolean;
}
const errorStyle =
  'flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary focus:border-primary sm:text-sm border-errorMain';
const defaultInputStyle =
  'flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary focus:border-primary sm:text-sm border-gray-300';
const adminDefaultInputStyle =
  ' bg-adminPortalBg flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary focus:border-primary sm:text-sm border-gray-300';

const FormColorField: React.FC<FormFieldProps> = ({
  label,
  nameProp,
  currentColor = '#222222',
  error,
  disabled = false,
  setValue,
  register,
  isAdminPortalField,
}) => {
  const [color, setColor] = useState('');

  useEffect(() => {
    if (currentColor) {
      setColor(currentColor);
    }
  }, [currentColor]);

  const handleChange = (event: any) => {
    if (event && event.target && event.target.value) {
      setColor(event.target.value);
    } else {
      setColor('');
    }
  };

  const dialog = useDialog();
  const displayColorPicker = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <ColorPickerComponent
          currentColor={color}
          closeDialog={() => {
            onCancel();
          }}
          onSave={(colorPicked: string) => {
            onSubmit();
            setColor(colorPicked);
            setValue(nameProp, colorPicked);
          }}
        />
      ),
    });
  };

  return (
    <>
      {label && label !== '' && (
        <label
          htmlFor={nameProp}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="mt-1">
        <div className="mt-1 flex rounded-md shadow-sm">
          <span
            onClick={() => displayColorPicker()}
            style={{ backgroundColor: color, borderColor: color }}
            className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm"
          ></span>
          <input
            type="text"
            disabled={disabled}
            {...register(nameProp)}
            className={
              error
                ? errorStyle
                : isAdminPortalField
                ? adminDefaultInputStyle
                : defaultInputStyle
            }
            onBlur={(e) => {
              handleChange(e);
            }}
          />
        </div>

        <span className="text-errorMain text-xs"> {error && error} </span>
      </div>
    </>
  );
};

export default FormColorField;
