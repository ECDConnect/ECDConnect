import * as styles from './button.styles';
import LoadingSpinner from '../loading-spinner/loading-spinner';
import { classNames } from '../../utils/style-class.utils';
import { renderIcon } from '../../utils/icon-utils';
import { Typography } from '..';
import { ButtonProps } from './button.types';

export const Button: React.FC<ButtonProps> = ({
  id,
  type,
  shape,
  disabled,
  background = 'filled',
  color,
  size = 'normal',
  isLoading,
  onClick,
  children,
  className,
  testId,
  icon,
  iconPosition = 'start',
  text,
  textColor,
  style,
  buttonType = 'button',
}) => {
  return (
    <button
      style={style}
      id={id}
      data-testid={testId}
      type={buttonType}
      className={classNames(
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        styles.getButtonClassName(
          type,
          disabled ?? false,
          color,
          shape ?? 'normal',
          size,
          background
        ),
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {isLoading && (
        <LoadingSpinner
          size="small"
          spinnerColor="white"
          backgroundColor="uiMid"
        />
      )}
      {icon &&
        iconPosition === 'start' &&
        renderIcon(icon, `h-5 w-4 mr-2 text-${textColor}`)}
      {text && (
        <Typography
          type={'button'}
          color={textColor}
          text={text}
          className={disabled ? 'opacity-50' : ''}
        />
      )}
      {icon &&
        iconPosition === 'end' &&
        renderIcon(
          icon,
          `h-5 w-4 ml-2 text-${textColor} ${disabled ? 'opacity-50' : ''}`
        )}
      {children}
    </button>
  );
};
export default Button;
