import { useState, Fragment, useEffect, useMemo, useCallback } from 'react';
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
  isAdminPortalInput?: boolean;
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
  isAdminPortalInput,
}: DropdownProps<T>) {
  const [selectedItem, setSelectedItem] = useState<DropDownOption<T>>();
  const [touched, setTouched] = useState(false);
  const [search, setSearch] = useState('');
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const lowerSearch = search.toLowerCase();

  const filteredList = useMemo(
    () =>
      list.filter((item) => item?.label?.toLowerCase().includes(lowerSearch)),
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
          onBlur={() => {
            // Delay closing the menu to allow time for the click event to trigger on the menu item
            setTimeout(() => setIsOpenMenu(false), 100);
            onToggleMenu;
          }}
          type="text"
          placeholder={selectedItem?.label ? selectedItem.label : placeholder}
          className={classNames(
            styles.title,
            styles.getDropDownFill(fillType, fillColor)
          )}
          onChange={(event) => setSearch(event.target.value)}
          onFocus={onToggleMenu}
          disabled={disabled}
        />
        {renderIcon(
          !isOpenMenu ? 'ChevronDownIcon' : 'ChevronUpIcon',
          classNames(
            styles.getDropDownIcon(
              fillType,
              touched ? 'textDark' : 'textLight'
            ),
            'absolute top-3 right-0'
          )
        )}
      </div>
    ),
    [
      search,
      selectedItem?.label,
      placeholder,
      fillType,
      fillColor,
      disabled,
      isOpenMenu,
      touched,
    ]
  );

  const renderMenuButton = useCallback(
    (open: boolean) => (
      <Menu.Button
        className={classNames(styles.getDropDownFill(fillType, fillColor))}
        disabled={disabled}
      >
        <Typography
          type={'body'}
          color={labelColor ? labelColor : touched ? 'textDark' : 'textMid'}
          text={selectedItem?.label ? selectedItem.label : placeholder}
          className={styles.title}
        />
        {renderIcon(
          !open ? 'ChevronDownIcon' : 'ChevronUpIcon',
          styles.getDropDownIcon(
            fillType,
            labelColor ? labelColor : touched ? 'textDark' : 'textMid'
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

  const handleMenuItemClick = (item: DropDownOption<T>) => {
    handler(item);
    if (showSearch) {
      setIsOpenMenu(false);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label
          className={
            isAdminPortalInput ? styles.adminPortalLabel : styles.label
          }
        >
          {label}
        </label>
      )}
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
                          {({ active }) => (
                            <div
                              className={
                                item.value === selectedItem?.value
                                  ? styles.menuItemSelected
                                  : styles.menuItem
                              }
                              onClick={() => handleMenuItemClick(item)}
                            >
                              <div
                                className={`text-md flex flex-row gap-2.5 text-${
                                  item.value === selectedItem?.value
                                    ? 'dark font-medium'
                                    : 'textDark font-normal'
                                }`}
                              >
                                <CheckCircleIcon
                                  className={`h-6 w-6 cursor-pointer text-${
                                    item.value === selectedItem?.value
                                      ? 'secondary '
                                      : 'secondary'
                                  }`}
                                />
                                <p>{item.label}</p>
                              </div>
                            </div>
                          )}
                        </Menu.Item>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-textDark flex items-center justify-center">
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
