import { useQuery } from '@apollo/client';
import {
  DocumentDto,
  PermissionEnum,
  usePanel,
  WorkflowStatusDto,
} from '@ecdlink/core';
import { GetAllWorkflowStatus, PersonalRecordsList } from '@ecdlink/graphql';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../components/content-loader/content-loader';
import UiTable from '../../components/ui-table';
import { useUser } from '../../hooks/useUser';
import DocumentPanel from './components/document-panel/document-panel';

export default function Documents() {
  const { hasPermission } = useUser();
  const { data: workflowStatuses } = useQuery(GetAllWorkflowStatus, {
    fetchPolicy: 'cache-and-network',
  });
  const { data: newData, refetch } = useQuery(PersonalRecordsList, {
    variables: {
      showOnlyTypes: ['MaternalCaseRecord', 'RoadToHealthBook'],
      order: [{ updatedDate: 'DESC' }],
      pagingInput: null,
      // TODO: Use date filter and pagination:
      // {
      //   filterBy: [
      //     {
      //       fieldName: "insertedDate",
      //       filterType: "LESS_THAN_OR_EQUAL",
      //       value: "2023-06-06T00:00:00.000+02:00"
      //     },
      //     {
      //       fieldName: "insertedDate",
      //       filterType: "GREATER_THAN_OR_EQUAL",
      //       value: "2023-06-04T00:00:00.000+02:00"
      //     }
      //   ]
      // }
    },
    fetchPolicy: 'cache-and-network',
  });

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (newData && newData?.allClientRecords) {
      const copyItems = newData?.allClientRecords?.map((item: DocumentDto) => {
        console.log(item);
        return {
          ...item,
          fullName: item.user
            ? `${item.user?.firstName} ${item.user?.surname}`
            : 'System',
          type: item.documentType?.name,
          status: item.workflowStatus?.description,
          createdByName: item?.createdByName,
          clientName: item?.clientName,
          createdDate:
            item.insertedDate !== null
              ? new Date(item.insertedDate).toISOString()
              : '',
          _view: undefined,
          _edit: undefined,
          _url: undefined,
        };
      });
      setTableData(copyItems);
    }
  }, [newData]);

  const panel = usePanel();
  const displayPanel = (item: DocumentDto) => {
    const filteredStatuses = workflowStatuses.GetAllWorkflowStatus.filter(
      (x: WorkflowStatusDto) =>
        x.workflowStatusType.id === item.workflowStatus?.workflowStatusTypeId
    );
    panel({
      noPadding: true,
      title: 'View document',
      render: (onSubmit: any) => (
        <DocumentPanel
          item={item}
          workflowStatus={filteredStatuses}
          closeDialog={(result: boolean) => {
            if (result) {
              refetch();
            }

            onSubmit();
          }}
        />
      ),
    });
  };

  const displayDocument = (document: DocumentDto) => {
    window.open(document.reference, '_blank');
  };
  console.log({ tableData });
  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'fullName', use: 'Client' },
                    { field: 'createdByName', use: 'CHW' },
                    { field: 'type', use: 'type' },
                    { field: 'insertedDate', use: 'Date added' },
                    { field: 'status', use: 'Client status' },
                  ]}
                  rows={tableData}
                  editRow={
                    hasPermission(PermissionEnum.update_documents) &&
                    displayDocument
                  }
                  viewRow={
                    hasPermission(PermissionEnum.view_documents) && displayPanel
                  }
                  component={'cms'}
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
