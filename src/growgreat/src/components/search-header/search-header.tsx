import { ReactNode } from 'react';
import { Menu } from '@headlessui/react';
import { SearchIcon } from '@heroicons/react/solid';
import {
  DialogPosition,
  Typography,
  classNames,
  renderIcon,
  StackedList,
  Dialog,
} from '@ecdlink/ui';
import * as styles from './search-header.styles';

export type SearchHeaderAlternativeRenderItem<T> = {
  render: (item: T) => ReactNode;
};

type SearchHeaderProps<T> = {
  searchItems: T[];
  onSearchChange: (value: string) => void;
  onScroll?: (scrollTop: number) => void;
  onSearchButtonClick?: () => void;
  onBack?: () => void;
  alternativeSearchItemRender?: SearchHeaderAlternativeRenderItem<T>;
  isTextSearchActive: boolean;
  heading?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  id?: string;
  onClickItem?: (item: any) => void;
};

export const SearchHeader = <T extends {}>({
  children,
  onSearchChange,
  searchItems,
  onScroll = () => {},
  alternativeSearchItemRender,
  isTextSearchActive,
  onSearchButtonClick,
  className,
  contentClassName,
  heading,
  onBack,
  id,
  onClickItem,
}: SearchHeaderProps<T>) => {
  return (
    <>
      <Menu
        as="div"
        className={classNames(styles.quickSearchWrapper, className)}
      >
        <div
          className={styles.searchIconWrapper}
          onClick={onSearchButtonClick}
          id={id}
        >
          <SearchIcon className={styles.searchIcon} />
        </div>
        {children}
      </Menu>
      <Dialog
        fullScreen
        visible={isTextSearchActive}
        position={DialogPosition.Top}
      >
        <div className={styles.dialogContent}>
          <div className={styles.searchTextWrapper}>
            <div onClick={onBack}>
              {renderIcon('ArrowLeftIcon', styles.iconFill)}
            </div>
            <input
              className={styles.searchInput}
              onChange={(e) => {
                onSearchChange && onSearchChange(e.target.value);
              }}
              placeholder={'Search...'}
            />
          </div>
          <div
            className={`flex h-full flex-1 flex-col overflow-y-auto ${
              alternativeSearchItemRender ? 'px-4 pt-4 pb-24' : ''
            }  `}
          >
            <Typography
              text={heading}
              className={'ml-4'}
              type={'unspecified'}
              weight={'bold'}
              fontSize={'18'}
            />
            {alternativeSearchItemRender &&
              searchItems.length > 0 &&
              searchItems.map((item: T) =>
                alternativeSearchItemRender.render(item)
              )}

            {!alternativeSearchItemRender && searchItems.length > 0 && (
              <StackedList
                className={classNames(
                  styles.dialogContentStackedList,
                  contentClassName
                )}
                listItems={searchItems as any}
                type={'UserAlertList'}
                onScroll={onScroll}
                onClickItem={onClickItem}
              />
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default SearchHeader;
