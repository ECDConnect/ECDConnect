import { ReactElement, useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { Colours } from '../../models';
import * as styles from './radio-group.styles';
import { RadioGroupOption } from './models/RadioGroupOptions';
import { Typography } from '..';

interface CoreRadioGroupProps {
  onChange: (val: any) => void;
  options: RadioGroupOption[];
  currentValue: any;
  colour: Colours;
  selectedOptionBackgroundColor?: Colours;
}

export const CoreRadioGroup: React.FC<CoreRadioGroupProps> = ({
  colour,
  onChange,
  currentValue,
  options,
  selectedOptionBackgroundColor = 'white',
}) => {
  const [stateValue, setStateValue] = useState(currentValue);

  const onChangeHandler = (val: any) => {
    setStateValue(val);
    onChange(val);
  };

  return (
    <RadioGroup
      value={stateValue}
      onChange={onChangeHandler}
      className={styles.wrapper}
    >
      {options.map((option, index) => (
        <RadioGroup.Option
          value={option.value}
          key={'radio.group.option.' + option.id}
        >
          {({ checked }) => (
            <div
              className={styles.optionsWrapper(
                index,
                checked,
                colour,
                selectedOptionBackgroundColor
              )}
            >
              <div className={styles.groupCircleStyle(checked, colour)}>
                <div className={styles.inner}></div>
              </div>
              {!!option.icon && (
                <div
                  className={
                    'ml-2 mr-4 flex h-9 w-9 items-center justify-center rounded-full'
                  }
                >
                  {option.icon}
                </div>
              )}
              <Typography
                text={option.label}
                type={'body'}
                color={checked ? 'textDark' : 'textMid'}
                weight={checked ? 'normal' : 'skinny'}
              />
            </div>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
};
