import { ReactElement } from 'react';

export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactElement;
  description: string;
  isActivity?: boolean;
  extraButtonIcon?: ReactElement;
  extraButtonOnClick?: () => void;
}

export const Radio = ({
  id,
  checked,
  icon,
  description,
  isActivity,
  extraButtonIcon,
  extraButtonOnClick,
  ...rest
}: RadioProps) => (
  <div
    className={
      isActivity
        ? `text-textMid flex items-center rounded-lg p-4 ${
            checked
              ? 'bg-secondaryAccent2 border-secondary border-2'
              : 'bg-uiBg'
          }`
        : `text-textDark flex items-center rounded-lg p-4 ${
            checked
              ? 'bg-secondaryAccent2 border-secondary border-2'
              : 'bg-uiBg'
          }`
    }
  >
    <input
      {...rest}
      type="radio"
      id={id}
      checked={checked}
      className={`mr-2 h-5 w-5 ${
        checked
          ? 'text-secondary border-secondary'
          : 'text-tertiary border-tertiary'
      } focus:outline-none ring-transparent`}
    />
    <label
      htmlFor={id}
      className={
        isActivity
          ? 'flex w-full items-center gap-2'
          : 'flex w-full items-center gap-2 font-bold'
      }
    >
      {icon && (
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            checked ? 'bg-secondary' : 'bg-tertiary'
          }`}
        >
          {icon}
        </span>
      )}
      {description}
      {extraButtonIcon && (
        <button className="ml-auto" onClick={extraButtonOnClick}>
          {extraButtonIcon}
        </button>
      )}
    </label>
  </div>
);
