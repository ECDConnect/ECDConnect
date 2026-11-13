import { gql, useQuery } from '@apollo/client';
import { camelCaseToSentanceCase, ContentValueDto } from '@ecdlink/core';
import { Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import Pagination from '../pagination/pagination';

export interface DynamicStaticSelectorProps {
  contentValue?: ContentValueDto;
  title?: string;
  entityName: string;
  isReview: boolean;
  setSelectedItems?: (value: string) => void;
}

const DynamicStaticSelector: React.FC<DynamicStaticSelectorProps> = ({
  contentValue,
  title,
  entityName,
  isReview,
  setSelectedItems,
}) => {
  const getAllCall = `GetAll${entityName}`;

  const [tempData, setTempData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  const [currentIds, setCurrentIds] = useState<string[]>();

  const query = gql` {
      ${getAllCall} {
        id
        description
      }
    }
  `;

  const { data: contentData } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
  });

  const [displayFields] = useState<string[]>(['description']);

  useEffect(() => {
    if (contentValue) {
      const ids = contentValue?.value?.split(',');
      setCurrentIds(ids);
    }
  }, [contentValue]);

  useEffect(() => {
    if (contentData && contentData[getAllCall]) {
      if (isReview) {
        const data = contentData[getAllCall].filter((x) =>
          currentIds?.some((z) => z === x.id.toString())
        );
        setTempData(data);
      } else {
        setTempData(contentData[getAllCall]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentData, isReview, currentIds]);

  const selectItem = (id: string) => {
    id = id.toString();
    const copy = Object.assign([], currentIds);

    const currentIndex = currentIds?.findIndex((x) => x === id) ?? -1;
    if (currentIndex > -1) {
      copy.splice(currentIndex, 1);
    } else {
      copy.push(id);
    }

    setCurrentIds(copy);

    if (copy && setSelectedItems) {
      const returnString = copy.join(',') ?? '';

      setSelectedItems(returnString);
    }
  };

  if (tempData && displayFields)
    return (
      <div>
        <Typography
          type={'body'}
          weight={'bold'}
          color={'textMid'}
          text={camelCaseToSentanceCase(title ?? '')}
        />

        <div className="mt-4">
          <table className="min-w-full">
            <thead className="bg-adminPortalBg border-quatenary border-b-2">
              <tr>
                <th
                  scope="col"
                  className="text-textMid px-6 py-3 text-left text-sm font-semibold normal-case"
                >
                  Name
                </th>

                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-uiLight z-10 divide-y bg-white">
              {tableData &&
                tableData.map((item: any) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-2 py-4">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-textMid text-sm font-medium">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-textMid text-sm font-medium">
                          <input
                            disabled={isReview}
                            defaultChecked={currentIds?.some(
                              (x) => x === item.id.toString()
                            )}
                            type="checkbox"
                            className="focus:ring-primary text-primary h-4 w-4 rounded border-gray-300"
                            onChange={() => selectItem(item.id)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <Pagination
            recordsPerPage={8}
            items={tempData}
            responseData={setTableData}
          />
        </div>
      </div>
    );
  else {
    return <div>...loading</div>;
  }
};

export default DynamicStaticSelector;
