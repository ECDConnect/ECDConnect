import { useState, Fragment, useEffect, useMemo, useCallback } from 'react';
import * as styles from './dropdown.styles';
import { Menu, Transition } from '@headlessui/react';
import { DropDownFillType, DropDownOption } from './models/DropDownOption';
import { CheckCircleIcon } from '@heroicons/react/solid';
import {
  renderIcon,
  Colours,
  ComponentBaseProps,
  Typography,
  classNames,
} from '@ecdlink/ui';

export interface DropdownProps<T> extends ComponentBaseProps {
  placeholder?: string;
  label?: string;
  subLabel?: string;
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
  showSearch?: boolean;
  labelColor?: Colours;
}

export function Dropdown<T>({
  list,
  selectedValue,
  label,
  subLabel,
  onChange,
  placeholder = '',
  disabled = false,
  fillType = 'filled',
  fullWidth = false,
  fillColor = 'uiBg',
  textColor = 'primary',
  className,
  inputRef,
  showSearch,
  labelColor,
}: DropdownProps<T>) {
  const [selectedItem, setSelectedItem] = useState<DropDownOption<T>>();
  const [touched, setTouched] = useState(false);
  const [search, setSearch] = useState('');
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const lowerSearch = search.toLowerCase();

  const filteredList = useMemo(
    () => list.filter((item) => item.label.toLowerCase().includes(lowerSearch)),
    [list, lowerSearch]
  );

  const options = showSearch ? filteredList : list;

  const onToggleMenu = () => setIsOpenMenu((prevState) => !prevState);

  const handler = (item: DropDownOption<T>) => {
    if (item.value === selectedValue) {
      return;
    }

    setSelectedItem(item);
    setSearch('');
    onChange(item.value);
    setTouched(true);
  };

  const renderSearchInput = useMemo(
    () => (
      <div className="relative">
        <input
          id="search-input"
          value={search}
          type="text"
          placeholder={selectedItem?.label ? selectedItem.label : placeholder}
          className={classNames(
            styles.title,
            styles.getDropDownFill(fillType, fillColor)
          )}
          onChange={(event) => setSearch(event.target.value)}
          onFocus={onToggleMenu}
          onBlur={onToggleMenu}
          disabled={disabled}
        />
      </div>
    ),
    [search, selectedItem.label, placeholder, fillType, fillColor, disabled]
  );

  const renderMenuButton = useCallback(
    (open: boolean) => (
      <Menu.Button
        className={classNames(styles.getDropDownFill(fillType, fillColor))}
        disabled={disabled}
      >
        <Typography
          type={'body'}
          color={labelColor ? labelColor : touched ? 'textDark' : 'textLight'}
          text={selectedItem?.label ? selectedItem.label : placeholder}
          className={styles.title}
        />
        {renderIcon(
          !open ? 'ChevronDownIcon' : 'ChevronUpIcon',
          styles.getDropDownIcon(
            fillType,
            labelColor ? labelColor : touched ? 'textDark' : 'textLight'
          )
        )}
      </Menu.Button>
    ),
    [fillType, fillColor, disabled, placeholder, touched, selectedItem]
  );

  useEffect(() => {
    if (selectedValue) {
      const filter = list.find((x) => x.value === selectedValue);
      setSelectedItem(filter);
    } else {
      setSelectedItem(undefined);
      setTouched(false);
    }
  }, [selectedValue, list]);

  return (
    <div className={className}>
      {label && <label className={styles.label}>{label}</label>}
      {subLabel && <label className={styles.subLabel}>{subLabel}</label>}
      <Menu
        as="div"
        className={classNames(styles.menu, fullWidth ? 'w-full' : '')}
      >
        {({ open }) => (
          <>
            {showSearch ? renderSearchInput : renderMenuButton(open)}
            <Transition
              show={showSearch ? isOpenMenu : open}
              as={Fragment}
              enter={styles.enter}
              enterFrom={styles.enterFrom}
              enterTo={styles.enterTo}
              leave={styles.leave}
              leaveFrom={styles.leaveFrom}
              leaveTo={styles.leaveTo}
            >
              <Menu.Items static className={styles.menuItems}>
                {options.length ? (
                  options.map((item: any, index: number) => {
                    return (
                      <div className={styles.menuItemWrapper} key={index}>
                        <Menu.Item>
                          <div
                            className={
                              item.value === selectedItem?.value
                                ? styles.menuItemSelected
                                : styles.menuItem
                            }
                            onClick={() => handler(item)}
                          >
                            <div
                              className={`flex flex-row gap-2.5 text-${
                                item.value === selectedItem?.value
                                  ? 'dark font-medium'
                                  : 'textMid font-normal'
                              }`}
                            >
                              <CheckCircleIcon
                                className={`h-22 w-22 cursor-pointer text-${
                                  item.value === selectedItem?.value
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
                  })
                ) : (
                  <p className="text-textMid flex items-center justify-center">
                    No results
                  </p>
                )}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
export default Dropdown;
