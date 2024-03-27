import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { CheckboxChange, Colours, ComponentBaseProps } from '../../../models';
import { classNames } from '../../../utils';
import Typography from '../../typography/typography';
import * as styles from './checkbox-input.styles';
import { ReactElement } from 'react';

export interface CheckboxProps<T extends FieldValues = {}>
  extends ComponentBaseProps {
  description?: string | ReactElement;
  descriptionColor?: Colours;
  checkboxColor?: Colours;
  checked?: boolean;
  indeterminate?: boolean;
  onCheckboxChange?: (e: CheckboxChange) => void;
  nameProp?: Path<T>;
  disabled?: boolean;
  visible?: boolean;
  register?: UseFormRegister<T>;
  value?: number | string;
  name?: string;
}

export const Checkbox = <T extends FieldValues>({
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
  id,
  name,
  indeterminate,
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
    <>
      {visible && (
        <label className={classNames(className, 'item-center flex gap-2')}>
          <div className={styles.inputContainer}>
            {nameProp && register && (
              <input
                id={id}
                disabled={disabled}
                data-testid={testId}
                type="checkbox"
                className={classNames(
                  styles.checkboxInput,
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
                  styles.checkboxInput,
                  `border-${checkboxColor}`
                )}
                checked={checked}
                ref={(ref) => {
                  if (ref) ref.indeterminate = !!indeterminate;
                }}
                onChange={(e) => checkboxChange(e)}
              />
            )}
          </div>
          {typeof description === 'string' ? (
            <Typography
              type="body"
              color={descriptionColor}
              text={description || ''}
            ></Typography>
          ) : (
            description
          )}
        </label>
      )}
    </>
  );
};

export default Checkbox;
