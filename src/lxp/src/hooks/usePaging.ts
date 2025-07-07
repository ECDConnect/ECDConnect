import { useEffect, useState } from 'react';

export const usePaging = <T extends {}>(
  items: T[],
  size = 5,
  initPageIndex = 0,
  pagingStyle = 'sectional'
) => {
  const pageCount = Math.ceil(items.length / size);

  const [pageIndex, setPageIndex] = useState(initPageIndex || 0);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);

  const isLastPage = pageIndex + 1 === pageCount;

  const getNextPage = () => {
    if (isLastPage) return;

    setPageIndex(pageIndex + 1);
  };

  const getPreviousePage = () => {
    if (pageIndex === 0) return;

    setPageIndex(pageIndex - 1);
  };

  useEffect(() => {
    if (!items) return;

    if (pagingStyle === 'accummilate') {
      const pageItems = [...items].splice(0, (pageIndex + 1) * size);
      setVisibleItems(pageItems);
    } else {
      const pageItems = [...items].splice(pageIndex * size, size);
      setVisibleItems(pageItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, pageIndex]);

  return {
    getNextPage,
    getPreviousePage,
    visibleItems,
    isLastPage,
  };
};
