import { ReactElement } from 'react';
import Checkbox, { CheckboxProps } from '../checkbox-input/checkbox-input';
import { CheckboxChange } from '../checkbox-input/models/Checkbox';

export interface CheckboxGroupProps extends CheckboxProps {
  icon?: ReactElement;
  title: string;
  description?: string;
  extraChildren?: JSX.Element;
  onChange?: (e: CheckboxChange) => void;
}

export const CheckboxGroup = ({
  id,
  disabled,
  checked,
  icon,
  title,
  description,
  onChange,
  value,
  extraChildren,
  ...rest
}: CheckboxGroupProps) => (
  <div
    className={`text-textDark relative flex items-center overflow-hidden rounded-lg p-4 ${
      checked ? 'bg-secondaryAccent2 border-secondary border-2' : 'bg-uiBg'
    }`}
  >
    <Checkbox
      disabled={disabled}
      checked={checked}
      value={value}
      onCheckboxChange={onChange}
      {...rest}
    />
    <label htmlFor={id} className="flex w-full items-center gap-2 font-bold">
      <div className="flex items-center gap-2">
        {icon && (
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              checked ? 'bg-secondary' : 'bg-tertiary'
            }`}
          >
            {icon}
          </span>
        )}
        <p className="text-textDark text-base font-bold">{title}</p>
      </div>
      <p className="text-textMid text-sm font-normal">{description}</p>
    </label>
    {extraChildren}
    {disabled && (
      <span className="absolute left-0 h-full w-full bg-gray-100 opacity-70" />
    )}
  </div>
);
