import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  InfantDto,
  MotherDto,
  NOTIFICATION,
  PermissionEnum,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import { HealthCareWorkerDto } from '@ecdlink/core/lib/models/dto/Users/health-care-worker.dto';
import { SendInviteToApplication, GetAllMothers } from '@ecdlink/graphql';
import { DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';

export default function Mothers() {
  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const dialog = useDialog();
  const { data } = useQuery(GetAllMothers, {
    fetchPolicy: 'cache-and-network',
  });
  const [tableData, setTableData] = useState<any[]>([]);
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);

  useEffect(() => {
    if (data && data.GetAllMother) {
      const copyItems = data.GetAllMother.map((item: MotherDto) => ({
        ...item,
        fullName: `${item.user?.firstName} ${item.user?.surname}`,
        isActive: item.user?.isActive,
        idNumber: item.user?.idNumber,
        _view: undefined,
        _edit: undefined,
        _url: undefined,
      }));
      setTableData(copyItems);
    }
  }, [data]);

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'idNumber', use: 'id / Passport' },
                    { field: 'fullName', use: 'name' },
                    { field: 'isActive', use: 'Active' },
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
