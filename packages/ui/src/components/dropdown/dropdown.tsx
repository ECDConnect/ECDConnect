import { useState, Fragment, useEffect } from 'react';
import * as styles from './dropdown.styles';
import { Menu, Transition } from '@headlessui/react';
import { Typography } from '../typography/typography';
import { DropDownFillType, DropDownOption } from './models/DropDownOption';
import { renderIcon } from '../../utils';
import { Colours, ComponentBaseProps } from '../../models';
import { classNames } from '../../utils/style-class.utils';
import { CheckCircleIcon } from '@heroicons/react/solid';

export interface DropdownProps<T> extends ComponentBaseProps {
  placeholder?: string;
  label?: string;
  direction?: string;
  disabled?: boolean;
  list: DropDownOption<T>[];
  selectedValue?: T;
  fillType?: DropDownFillType;
  fillColor?: Colours;
  textColor?: Colours;
  fullWidth?: boolean;
  onChange: (item: T) => void;
  inputRef?: any;
}

export function Dropdown<T>({
  list,
  selectedValue,
  label,
  onChange,
  placeholder = '',
  disabled = false,
  fillType = 'filled',
  fullWidth = false,
  fillColor = 'uiBg',
  textColor = 'primary',
  className,
  inputRef,
}: DropdownProps<T>) {
  const [selectedLabel, setSelectedLabel] = useState('');
  const [touched, setTouched] = useState(false);

  const handler = (item: DropDownOption<T>) => {
    if (item.value === selectedValue) {
      return;
    }

    setSelectedLabel(item.label);
    onChange(item.value);
    setTouched(true);
  };

  useEffect(() => {
    if (selectedValue) {
      const filter = list.find((x) => x.value === selectedValue);
      setSelectedLabel(filter?.label ?? '');
    } else {
      setSelectedLabel('');
      setTouched(false);
    }
  }, [selectedValue, list]);

  return (
    <div className={className}>
      {label && <label className={styles.label}>{label}</label>}
      <Menu
        as="div"
        className={classNames(styles.menu, fullWidth ? 'w-full' : '')}
      >
        {({ open }) => (
          <>
            <Menu.Button
              className={classNames(
                styles.getDropDownFill(fillType, fillColor)
              )}
              disabled={disabled}
            >
              <Typography
                type={'body'}
                color={touched ? 'textDark' : 'textLight'}
                text={selectedLabel ? selectedLabel : placeholder}
                className={styles.title}
              />

              {renderIcon(
                !open ? 'ChevronDownIcon' : 'ChevronUpIcon',
                styles.getDropDownIcon(
                  fillType,
                  touched ? 'textDark' : 'textLight'
                )
              )}
            </Menu.Button>

            <Transition
              show={open}
              as={Fragment}
              enter={styles.enter}
              enterFrom={styles.enterFrom}
              enterTo={styles.enterTo}
              leave={styles.leave}
              leaveFrom={styles.leaveFrom}
              leaveTo={styles.leaveTo}
            >
              <Menu.Items static className={styles.menuItems}>
                {list &&
                  list.map((item: any, index: number) => {
                    return (
                      <div className={styles.menuItemWrapper} key={index}>
                        <Menu.Item>
                          <div
                            className={
                              item.label === selectedLabel
                                ? styles.menuItemSelected
                                : styles.menuItem
                            }
                            onClick={() => handler(item)}
                          >
                            <div
                              className={`flex flex-row gap-2.5 text-${
                                item.label === selectedLabel
                                  ? 'dark font-medium'
                                  : 'textMid font-normal'
                              }`}
                            >
                              <CheckCircleIcon
                                className={`cursor-pointer h-22 w-22 text-${
                                  item.label === selectedLabel
                                    ? 'blue-accent3'
                                    : 'primaryAccent2'
                                }`}
                              />
                              {item.label}
                            </div>
                          </div>
                        </Menu.Item>
                      </div>
                    );
                  })}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
export default Dropdown;
