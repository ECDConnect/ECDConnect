import { ReactElement } from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { CheckboxChange, Colours, ComponentBaseProps } from '../../../models';
import { classNames } from '../../../utils';

export interface CheckboxGroupProps<T extends FieldValues = {}>
  extends ComponentBaseProps {
  icon?: ReactElement;
  infoIcon?: ReactElement;
  isIconFullWidth?: boolean;
  title: string;
  titleColours?: Colours;
  titleWeight?: string;
  titleSize?: string;
  description?: string;
  extraChildren?: JSX.Element;
  onChange?: (e: CheckboxChange) => void;
  nameProp?: Path<T>;
  register?: UseFormRegister<T>;
  disabled?: boolean;
  checked?: boolean;
  value?: number | string | T;
  name?: string;
  checkboxColor?: Colours;
  image?: string;
  imageHexColor?: string;
  isAdminPortalInput?: boolean;
}

export const CheckboxGroup = <T extends FieldValues = {}>({
  id,
  disabled,
  checked,
  icon,
  infoIcon,
  image,
  isIconFullWidth,
  title,
  titleColours = 'textDark',
  titleWeight = 'bold',
  titleSize = 'base',
  description,
  onChange,
  value,
  extraChildren,
  nameProp,
  register,
  name,
  testId,
  checkboxColor,
  className,
  imageHexColor,
  isAdminPortalInput,
  ...rest
}: CheckboxGroupProps<T>) => {
  const checkboxChange = (e: any) => {
    onChange?.({
      checked: e.target.checked,
      name: e.target.name,
      value: value,
    } as CheckboxChange);
  };

  return (
    <label
      htmlFor={id}
      className={`${className} text-textDark relative flex items-center rounded-lg p-4 ${
        checked
          ? `${
              isAdminPortalInput
                ? 'bg-adminPortalBg border-secondary border-2'
                : 'bg-quatenaryBg border-quatenary border-2'
            }`
          : `${isAdminPortalInput ? 'border-secondary border-2' : 'bg-uiBg'}`
      }`}
    >
      {nameProp && register && (
        <input
          id={id}
          disabled={disabled}
          data-testid={testId}
          type="checkbox"
          className={classNames(
            'ring:none h-4 w-4 rounded',
            `border-${checkboxColor}`
          )}
          {...register(nameProp)}
        />
      )}
      {!nameProp && (
        <input
          id={id}
          name={name}
          disabled={disabled}
          data-testid={testId}
          type="checkbox"
          className={classNames(
            'ring:none h-4 w-4 rounded',
            `border-${checkboxColor}`
          )}
          checked={checked}
          onChange={(e) => checkboxChange(e)}
        />
      )}
      {isIconFullWidth && icon}
      <div className="ml-2 flex w-full flex-col items-start font-bold">
        <div className="flex items-center gap-2">
          {icon && !isIconFullWidth && (
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                checked ? 'bg-secondary' : 'bg-tertiary'
              }`}
            >
              {icon}
            </div>
          )}
          {image && (
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                imageHexColor ? '' : checked ? 'bg-secondary' : 'bg-tertiary'
              }`}
              style={{ background: `#${imageHexColor?.split('#')?.[1]}` }}
            >
              <img
                src={image}
                alt="checkbox item"
                className="h-6 w-6 object-contain"
              />
            </div>
          )}
          <article
            className={classNames(
              'prose',
              `text-${titleColours} text-${titleSize} font-${titleWeight}`
            )}
            dangerouslySetInnerHTML={{ __html: title || '' }}
          />
        </div>
        {description && (
          <p className="text-textMid text-sm font-normal">{description}</p>
        )}
      </div>
      {extraChildren}
      {disabled && (
        <span className="absolute left-0 h-full w-full bg-gray-100 opacity-50" />
      )}
      {infoIcon && <div>{infoIcon}</div>}
    </label>
  );
};
