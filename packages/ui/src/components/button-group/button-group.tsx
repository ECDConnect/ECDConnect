import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import * as styles from './button-group.styles';
import { getOptionStyle } from './button-group.styles';
import { ButtonGroupOption } from './models/ButtonGroupOption';
import { ButtonGroupTypes } from './models/ButtonGroupTypes';
import { Colours } from '../../models/Colours';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { classNames } from '../../utils';

export interface ButtonGroupProps<T> extends ComponentBaseProps {
  options: ButtonGroupOption<T>[];
  selectedOptions?: T | T[];
  type: ButtonGroupTypes;
  multiple?: boolean;
  color?: Colours;
  notSelectedColor?: Colours;
  textColor?: Colours;
  onOptionSelected: (option: T | T[]) => void;
  inputRef?: any;
}

export const ButtonGroup = <T,>({
  testId,
  type,
  options,
  selectedOptions,
  color = 'primary',
  multiple,
  onOptionSelected,
  inputRef,
  className,
  notSelectedColor,
  textColor,
}: React.PropsWithChildren<ButtonGroupProps<T>>) => {
  const [selectedValues, setSelectedValues] = useState<T | T[] | undefined>(
    selectedOptions
  );

  const isOptionSelected = (option: ButtonGroupOption<T>) => {
    if (Array.isArray(selectedValues)) {
      return selectedValues.some(
        (selectedOption) => selectedOption === option.value
      );
    } else {
      return option.value === selectedValues;
    }
  };

  const optionClicked = (option: ButtonGroupOption<T>) => {
    if (multiple) {
      const newSelectedOptions = [...(selectedValues as T[])];
      if (isOptionSelected(option)) {
        const indexOf = newSelectedOptions.indexOf(option.value);
        newSelectedOptions.splice(indexOf, 1);
      } else {
        newSelectedOptions.push(option.value);
      }

      setSelectedValues(newSelectedOptions);
      onOptionSelected(newSelectedOptions);
    } else {
      setSelectedValues(option.value);
      onOptionSelected(option.value);
    }
  };

  useEffect(() => {
    setSelectedValues(selectedOptions);
  }, [selectedOptions]);

  return (
    <div
      data-testid={testId}
      className={classNames(
        className,
        type === ButtonGroupTypes.Button
          ? styles.buttonTypeWrapper
          : styles.chipTypeWrapper
      )}
    >
      {options &&
        options.map((option, index) => {
          return (
            <div
              ref={inputRef}
              key={`button-group-option-${index}`}
              onClick={() => {
                if (option.disabled) return;

                optionClicked(option);
              }}
              className={`${getOptionStyle(type, option.disabled)} ${
                isOptionSelected(option)
                  ? styles.selected(color)
                  : notSelectedColor
                  ? styles.notSelectedColorStyle(notSelectedColor, textColor)
                  : styles.notSelectedButtonOrChip
              }`}
            >
              {option.text}
            </div>
          );
        })}
    </div>
  );
};

export default ButtonGroup;
