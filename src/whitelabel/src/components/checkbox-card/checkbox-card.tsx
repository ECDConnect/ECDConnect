import {
  Checkbox,
  Typography,
  CheckboxChange,
  Colours,
  ComponentBaseProps,
  classNames,
} from '@ecdlink/ui';
import { Path, UseFormRegister, FieldValues } from 'react-hook-form';
import * as styles from './checkbox-card.styles';

export interface CheckboxCardProps<T extends FieldValues>
  extends ComponentBaseProps {
  description?: string;
  descriptionColor?: Colours;
  checked?: boolean;
  onCheckboxChange?: (e: CheckboxChange) => void;
  nameProp?: Path<T>;
  disabled?: boolean;
  visible?: boolean;
  register?: UseFormRegister<T>;
  checkboxColor?: Colours;
  checkedBackgroundColour?: Colours;
  checkedFocusColour?: Colours;
  value?: number;
}

export const CheckboxCard = <T extends FieldValues>({
  description,
  descriptionColor = 'textMid',
  className,
  onCheckboxChange,
  nameProp,
  register,
  checked,
  checkboxColor = 'secondary',
  checkedBackgroundColour = 'infoBb',
  checkedFocusColour = 'secondary',
  value,
}: CheckboxCardProps<T>) => {
  return (
    <div
      className={classNames(
        styles.wrapper,
        className,
        styles.getCheckboxCardStyle(
          checked,
          checkedBackgroundColour,
          checkedFocusColour
        )
      )}
      onClick={() => {
        onCheckboxChange &&
          onCheckboxChange({
            checked: !checked,
            name: nameProp || '',
            value,
          });
      }}
    >
      <div className={styles.content}>
        {nameProp && register ? (
          <Checkbox<T>
            register={register}
            nameProp={nameProp}
            checked={checked}
            checkboxColor={checkboxColor}
            onCheckboxChange={(change) => {
              onCheckboxChange && onCheckboxChange(change);
            }}
            value={value}
          />
        ) : (
          <Checkbox<T>
            checked={checked}
            checkboxColor={checkboxColor}
            onCheckboxChange={(change) => {
              onCheckboxChange && onCheckboxChange(change);
            }}
            value={value}
          />
        )}
        <div className={styles.textContainer}>
          <Typography
            type="body"
            color={descriptionColor}
            text={description || ''}
          ></Typography>
        </div>
      </div>
    </div>
  );
};

export default CheckboxCard;
