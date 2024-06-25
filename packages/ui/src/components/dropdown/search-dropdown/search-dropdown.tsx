import { useState, useEffect, Fragment } from 'react';
import * as styles from './search-dropdown.styles';
import { Menu, Transition } from '@headlessui/react';

import { SearchDropDownOption } from './models/SearchDropDownOption';
import { ComponentBaseProps } from '../../../models/ComponentBaseProps';
import { Colours } from '../../../models/Colours';
import { classNames } from '../../../utils/style-class.utils';
import { Typography } from '../../typography/typography';
import { renderIcon } from '../../../utils/icon-utils';

interface DropDownInfo {
  name?: string;
  hint?: string;
}

export interface SearchDropDownProps<T> extends ComponentBaseProps {
  id?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  options: SearchDropDownOption<T>[];
  pluralSelectionText?: string;
  info?: DropDownInfo;
  multiple?: boolean;
  selectedOptions?: SearchDropDownOption<T>[];
  color?: Colours;
  bgColor?: Colours;
  menuItemClassName?: string;
  menuItemStyle?: React.CSSProperties;
  displayMenuOverlay?: boolean;
  overlayTopOffset?: string;
  isFullWidth?: boolean;
  onChange?: (item: SearchDropDownOption<T>[]) => void;
  preventCloseOnClick?: boolean;
}

export function SearchDropDown<T>({
  id,
  placeholder,
  label,
  disabled,
  options,
  pluralSelectionText,
  info,
  multiple,
  selectedOptions = [],
  onChange,
  className,
  displayMenuOverlay,
  menuItemClassName,
  menuItemStyle,
  overlayTopOffset,
  color = 'primary',
  bgColor = 'white',
  isFullWidth = true,
  preventCloseOnClick,
}: SearchDropDownProps<T>) {
  const [selectedLabel, setSelectedLabel] = useState('');
  const [touched, setTouched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isOptionSelected = (option: SearchDropDownOption<T>) => {
    const isInSelectedItems = selectedOptions.some((selectedOption) => {
      return selectedOption.id === option.id;
    });

    return isInSelectedItems;
  };

  const updateSelectedLabel = (
    currentSelectedIds: SearchDropDownOption<T>[],
    options: SearchDropDownOption<T>[]
  ) => {
    if (currentSelectedIds.length > 1) {
      setSelectedLabel(
        `${currentSelectedIds.length} ${pluralSelectionText || 'Selected'}`
      );
    } else if (currentSelectedIds.length === 1) {
      let label = selectedLabel;
      if (currentSelectedIds.length > 0) {
        const selectedOption = options.find(
          (option) => option.id === currentSelectedIds[0].id
        );
        label = selectedOption?.label || placeholder || '';
      }
      setSelectedLabel(label);
    } else {
      setSelectedLabel(placeholder || '');
    }
  };

  const optionClicked = (
    event: React.MouseEvent,
    option: SearchDropDownOption<T>
  ) => {
    event.stopPropagation();
    if (option.disabled) return;

    if (!touched) {
      setTouched(true);
    }

    const optionSelected = isOptionSelected(option);
    const newSelection = multiple
      ? handleMutlipleItemSelection(option, optionSelected)
      : handleSingleItemSelection(option, optionSelected);
    onChange && onChange(newSelection);
  };

  const handleMutlipleItemSelection = (
    option: SearchDropDownOption<T>,
    selected: boolean
  ): SearchDropDownOption<T>[] => {
    const newSelectedOptions = [...selectedOptions];

    if (selected) {
      const indexOf = newSelectedOptions.findIndex((x) => x.id === option.id);
      newSelectedOptions.splice(indexOf, 1);
    } else {
      newSelectedOptions.push(option);
    }

    updateSelectedLabel(newSelectedOptions, options);
    return newSelectedOptions;
  };

  const handleSingleItemSelection = (
    option: SearchDropDownOption<T>,
    selected: boolean
  ): SearchDropDownOption<T>[] => {
    if (selected) {
      setSelectedLabel('');
      return [];
    }

    setSelectedLabel(option.label);
    return [option];
  };

  const hasSelectedValue = () => {
    return selectedOptions.length > 0;
  };

  useEffect(() => {
    if (selectedOptions.length > 0) {
      setTouched(true);
    }

    updateSelectedLabel(selectedOptions, options);
  }, [options, selectedOptions]);

  return (
    <div className={className}>
      {label && <label className={styles.label}>{label}</label>}
      <Menu as="div" className={isFullWidth ? 'w-full' : ''}>
        {({ open }) => (
          <>
            <Menu.Button
              id={id}
              className={classNames(
                className,
                styles.getButtonStyles(
                  color,
                  bgColor,
                  open,
                  hasSelectedValue(),
                  touched
                )
              )}
              disabled={disabled}
              onClick={() =>
                isOpen === false ? setIsOpen(true) : setIsOpen(false)
              }
            >
              <Typography
                type={'help'}
                color={
                  open || !hasSelectedValue() || !touched
                    ? 'textLight'
                    : 'white'
                }
                text={selectedLabel || placeholder || ''}
              />
              {renderIcon(
                !open ? 'ChevronDownIcon' : 'ChevronUpIcon',
                styles.getButtonIcon('primary', open, hasSelectedValue())
              )}
            </Menu.Button>

            <Transition
              show={preventCloseOnClick ? isOpen : open}
              as={Fragment}
              enter={styles.enter}
              enterFrom={styles.enterFrom}
              enterTo={styles.enterTo}
              leave={styles.leave}
              leaveFrom={styles.leaveFrom}
              leaveTo={styles.leaveTo}
            >
              <div
                className={
                  displayMenuOverlay ? styles.overlay(overlayTopOffset) : ''
                }
                onClick={
                  preventCloseOnClick
                    ? (prevState) => setIsOpen(!prevState)
                    : undefined
                }
              >
                <Menu.Items
                  className={classNames(
                    styles.menuItems,
                    menuItemClassName,
                    displayMenuOverlay ? 'absolute' : ''
                  )}
                  style={{ ...menuItemStyle }}
                >
                  {info && (
                    <div className={styles.infoWrapper}>
                      {info.name && (
                        <Typography
                          type="body"
                          color={'textDark'}
                          text={info.name}
                        />
                      )}
                      {info.hint && (
                        <Typography
                          type="help"
                          color={'textMid'}
                          text={info.hint || ''}
                        />
                      )}
                    </div>
                  )}
                  {options &&
                    options.map(
                      (item: SearchDropDownOption<T>, index: number) => {
                        const optionSelected = isOptionSelected(item);
                        return (
                          <Menu.Item
                            key={`drop-down-menu-item-${index}`}
                            as="div"
                            onClick={(event: React.MouseEvent) =>
                              optionClicked(event, item)
                            }
                          >
                            <div className={styles.menuItem}>
                              {renderIcon(
                                'CheckCircleIcon',
                                styles.getDropDownIcon(color, optionSelected)
                              )}
                              <Typography
                                type={'body'}
                                text={item.label}
                                color={optionSelected ? 'textDark' : 'textMid'}
                              />
                            </div>
                          </Menu.Item>
                        );
                      }
                    )}
                </Menu.Items>
              </div>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
export default SearchDropDown;
