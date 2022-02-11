import { Typography } from '../../../components';
import { ComponentBaseProps, Colours, CheckboxChange } from '../../../models';

import { Path, UseFormRegister } from 'react-hook-form';
import { classNames } from '../../../utils/style-class.utils';
import * as styles from './checkbox-input.styles';
export interface CheckboxProps<T> extends ComponentBaseProps {
  description?: string;
  descriptionColor?: Colours;
  checkboxColor?: Colours;
  checked?: boolean;
  onCheckboxChange?: (e: CheckboxChange) => void;
  nameProp?: Path<T>;
  disabled?: boolean;
  visible?: boolean;
  register?: UseFormRegister<T>;
  value?: number;
}

export const Checkbox = <T,>({
  description,
  descriptionColor = 'textMid',
  testId,
  className,
  onCheckboxChange,
  nameProp,
  disabled,
  visible = true,
  register,
  checked,
  checkboxColor = 'primary',
  value,
}: CheckboxProps<T>) => {
  const checkboxChange = (e: any) => {
    if (onCheckboxChange) {
      onCheckboxChange({
        checked: e.target.checked,
        name: e.target.name,
        value: value,
      } as CheckboxChange);
    }
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {visible && (
        <div className={classNames(styles.container, className)}>
          <div className={styles.inputContainer}>
            {nameProp && register && (
              <input
                disabled={disabled}
                data-testid={testId}
                type="checkbox"
                className={classNames(styles.checkboxInput, `text-${checkboxColor}`)}
                {...register(nameProp)}
              />
            )}
            {!nameProp && (
              <input
                disabled={disabled}
                data-testid={testId}
                type="checkbox"
                className={classNames(styles.checkboxInput, `text-${checkboxColor}`)}
                checked={checked}
                onChange={(e) => checkboxChange(e)}
              />
            )}
          </div>
          <div className={styles.textContainer}>
            <Typography type="body" color={descriptionColor} text={description || ''}></Typography>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkbox;
