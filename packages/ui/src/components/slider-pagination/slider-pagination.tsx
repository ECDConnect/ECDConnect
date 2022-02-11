import { useState } from 'react';
import { useEffect } from 'react';
import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import { classNames } from '../../utils/style-class.utils';
import * as styles from './slider-pagination.styles';

export interface SliderPaginationProps extends ComponentBaseProps {
  totalItems: number;
  activeIndex: number;
}

export const SliderPagination: React.FC<SliderPaginationProps> = ({
  totalItems,
  activeIndex,
  className,
}) => {
  const [paginationItems, setPaginationItems] = useState<number[]>([]);

  const generateArray = (total: number): number[] => {
    const items: number[] = [];
    for (let i = 0; i < total; i++) {
      items.push(i);
    }

    return items;
  };

  useEffect(() => {
    const items = generateArray(totalItems);
    setPaginationItems(items);
  }, [totalItems]);

  return (
    <div className={classNames(styles.wrapper, className)}>
      {paginationItems &&
        paginationItems.map((value, index) => (
          <div
            key={`pagination-item-${index}`}
            data-testid={`pagination-item-${index}`}
            className={
              index === activeIndex
                ? styles.activePaginationItem
                : styles.paginationItem
            }
          ></div>
        ))}
    </div>
  );
};

export default SliderPagination;
