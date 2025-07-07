import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { useRef, useState, useEffect } from 'react';
import { getPager } from './pagination.service';

export interface PaginationProps {
  recordsPerPage: number;
  items: any[];
  responseData: (values: any[]) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  recordsPerPage,
  items,
  responseData,
}) => {
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pager, setPager] = useState<any>();
  const currentPageRef = useRef(1);

  const getData = (pageNumber: number) => {
    setCurrentPage(Number(pageNumber));

    const copyItems = Object.assign([], items);
    const filteredArray = copyItems.slice(
      (pageNumber - 1) * recordsPerPage,
      pageNumber * recordsPerPage
    );
    responseData(filteredArray);
    setPagination(items.length, pageNumber, recordsPerPage);
  };

  /*
   * Set pagination data and pager data
   */
  const setPagination = (
    totalCount: number,
    pageNumber: number,
    recordsPerPage: number
  ) => {
    const pData = getPager(totalCount, pageNumber, recordsPerPage);
    setPager({ ...pData });
  };
  /*
   * Component initiated
   */
  useEffect(() => {
    if (items) {
      setTotalCount(items.length);
      getData(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  /*
   * Watch current page
   */
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // /*
  //  * Watch recordsPerPage
  //  */
  useEffect(() => {
    getData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordsPerPage]);

  if (items && pager && pager.pages.length > 1) {
    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <a
            href="#!"
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={(e) => {
              e.preventDefault();
              getData(currentPageRef?.current - 1);
            }}
          >
            Previous
          </a>
          <a
            href="#!"
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={(e) => {
              e.preventDefault();
              getData(currentPageRef?.current + 1);
            }}
          >
            Next
          </a>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{pager.startIndex + 1}</span> to{' '}
              <span className="font-medium">{pager.endIndex + 1}</span> of{' '}
              <span className="font-medium">{totalCount}</span> results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <a
                href="#!"
                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={(e) => {
                  e.preventDefault();
                  getData(currentPageRef.current - 1);
                }}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </a>

              {pager.pages.map((page: number, index: number) => {
                return (
                  <li
                    key={index}
                    className={
                      currentPage === page
                        ? 'bg-uiMidDark border-uiMidDark relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium text-white'
                        : 'relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50'
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      getData(page);
                    }}
                  >
                    <a className="page-link" href="#!">
                      {page}
                    </a>
                  </li>
                );
              })}
              <a
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  getData(currentPageRef.current + 1);
                }}
                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Pagination;
