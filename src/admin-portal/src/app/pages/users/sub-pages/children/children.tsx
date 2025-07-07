import { useQuery } from '@apollo/client';
import { ChildDto, WorkflowStatusDto } from '@ecdlink/core';
import { GetAllChild, WorkflowStatusEnum } from '@ecdlink/graphql';
import { Dropdown, DropDownOption } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/old-ui-table';

export default function Children() {
  const { data } = useQuery(GetAllChild, { fetchPolicy: 'cache-and-network' });
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>();
  useEffect(() => {
    if (data && data.GetAllChild) {
      const copyItems = data.GetAllChild.map(mapChildTableItem);
      setTableData(copyItems);
    }
  }, [data]);

  useEffect(() => {
    if (!data?.GetAllChild) return;

    let allChildren: ChildDto[] = [...data.GetAllChild];

    if (selectedStatusFilter !== undefined) {
      allChildren = allChildren.filter(
        (child) => child.workflowStatus?.id === selectedStatusFilter
      );
    }

    setTableData(allChildren.map(mapChildTableItem));
  }, [selectedStatusFilter]);

  const getStatusOptions = (children: ChildDto[]) => {
    if (!children) return [];

    return children.reduce(
      (acc, curr) => {
        const status = curr.workflowStatus;
        if (!status) return acc;
        if (!acc.some((ac) => ac.value === status.id)) {
          return [...acc, { label: status.description, value: status.id }];
        }

        return acc;
      },
      [
        {
          label: 'All',
          value: undefined,
        },
      ] as DropDownOption<string>[]
    );
  };

  const mapChildTableItem = (child: ChildDto) => {
    return {
      ...child,
      fullName: `${child.user?.firstName} ${child.user?.surname}`,
      language: child.language?.description,
      statusChip: [
        {
          statusValue: child.workflowStatus?.description,
          statusColor: getStatusColor(child.workflowStatus),
        },
      ],
      _view: undefined,
      _edit: undefined,
      _url: undefined,
    };
  };

  const getStatusColor = (childStatus?: WorkflowStatusDto) => {
    let status = '';
    if (childStatus) {
      switch (childStatus?.enumId) {
        case WorkflowStatusEnum.ChildActive:
          status = 'bg-successMain';
          break;
        case WorkflowStatusEnum.ChildPending:
          status = 'bg-alertMain';
          break;
        default:
          status = 'bg-errorMain';
          break;
      }
    }

    return status;
  };

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <span className="text-lg font-medium leading-6 text-gray-900">
              <Dropdown
                className="mr-2"
                fillType="clear"
                placeholder="Filter status"
                selectedValue={selectedStatusFilter}
                list={getStatusOptions(data?.GetAllChild)}
                onChange={(item) => {
                  setSelectedStatusFilter(item);
                }}
              />
            </span>
          </div>

          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'fullName', use: 'name' },
                    { field: 'language', use: 'language' },
                    {
                      field: 'statusChip',
                      use: 'status',
                      type: 'workflowStatus',
                    },
                  ]}
                  rows={tableData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
