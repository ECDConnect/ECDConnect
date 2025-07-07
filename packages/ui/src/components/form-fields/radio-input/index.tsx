import { ReactElement } from 'react';
import { classNames } from '../../../utils';
import StatusChip, { StatusChipProps } from '../../status-chip/status-chip';

export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactElement;
  customIcon?: ReactElement;
  description: string;
  hint?: string;
  isActivity?: boolean;
  extraButtonIcon?: ReactElement;
  variant?: 'default' | 'slim';
  statusChip?: StatusChipProps;
  extraButtonOnClick?: () => void;
}

export const Radio = ({
  id,
  checked,
  icon,
  customIcon,
  description,
  hint,
  isActivity,
  variant,
  extraButtonIcon,
  disabled,
  extraButtonOnClick,
  statusChip,
  ...rest
}: RadioProps) => {
  const getContainerStyle = () => {
    if (isActivity) {
      return `text-textMid flex items-center rounded-lg p-4 ${
        checked ? 'bg-quatenaryBg' : 'bg-uiBg'
      }`;
    }

    if (variant === 'slim') {
      return `text-textDark flex rounded-lg p-4 ${
        checked ? 'bg-quatenaryBg border-quatenary border-2' : 'bg-uiBg'
      }`;
    }

    return `text-textDark flex items-center rounded-lg p-4 ${
      checked ? 'bg-quatenaryBg border-quatenary border-2' : 'bg-uiBg'
    }`;
  };

  const getInputStyle = () => {
    if (variant === 'slim') {
      return `mr-2 mt-1 h-4 w-4 ${
        checked
          ? 'text-quatenary border-quatenary'
          : 'text-tertiary border-primaryAccent2'
      } focus:outline-none ring-transparent`;
    }

    return `mr-2 h-5 w-5 ${
      checked
        ? 'text-quatenary border-quatenary'
        : 'text-tertiary border-primaryAccent2'
    } focus:outline-none ring-transparent`;
  };

  const getLabelStyle = () => {
    const base = 'flex w-full items-center gap-2';

    if (isActivity) {
      return base;
    }

    if (variant === 'slim') {
      return `${base} text-base`;
    }

    return `${base} font-bold`;
  };

  return (
    <label
      htmlFor={id}
      className={classNames('relative items-center', getContainerStyle())}
    >
      <input
        {...rest}
        type="radio"
        id={id}
        checked={checked}
        disabled={disabled}
        className={getInputStyle()}
      />
      <div className={getLabelStyle()}>
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center">
            {customIcon}
            {icon && !customIcon && (
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  checked ? 'bg-secondary' : 'bg-tertiary'
                }`}
              >
                {icon}
              </span>
            )}
            {description}
          </div>
          {hint && (
            <p className="text-textMid mt-1 text-sm font-normal">{hint}</p>
          )}
          {statusChip && <StatusChip {...statusChip} />}
        </div>
        {extraButtonIcon && (
          <button className="ml-auto" onClick={extraButtonOnClick}>
            {extraButtonIcon}
          </button>
        )}
      </div>
      {disabled && (
        <span className="rounded-10 absolute left-0 top-0 h-full w-full bg-gray-100 opacity-50" />
      )}
    </label>
  );
};
