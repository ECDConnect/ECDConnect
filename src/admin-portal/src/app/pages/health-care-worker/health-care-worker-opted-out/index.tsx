import { useLazyQuery, useQuery } from '@apollo/client';
import {
  GetHealthCareWorkerByUserId,
  GetHealthCareWorkersOptedOutOfMonthlyMeeting,
  PortalHealthCareWorkerModel,
  PortalHealthCareWorkerModelSortInput,
  QueryHealthCareWorkersOptedOutOfMonthlyMeetingArgs,
} from '@ecdlink/graphql';
import { Alert, Table } from '@ecdlink/ui';
import { format } from 'date-fns';
import { Icolumn } from 'react-tailwind-table';
import { columnColor } from '../../../utils/health-care-worker/components-utils';
import ROUTES from '../../../routes/app.routes-constants';
import { useHistory } from 'react-router';
import { NOTIFICATION, useNotifications } from '@ecdlink/core';

export const HealthCareWorkerOptedOut: React.FC = () => {
  const history = useHistory();

  const { setNotification } = useNotifications();

  // TODO: replace month & year, according to the notification.
  const today = new Date();

  const { data, loading } = useQuery<{
    healthCareWorkersOptedOutOfMonthlyMeeting: PortalHealthCareWorkerModel[];
  }>(GetHealthCareWorkersOptedOutOfMonthlyMeeting, {
    fetchPolicy: 'cache-and-network',
    variables: {
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      order: [
        {
          dateInvited: 'DESC',
        },
      ] as PortalHealthCareWorkerModelSortInput,
    } as QueryHealthCareWorkersOptedOutOfMonthlyMeetingArgs,
  });

  const [getChwById, { loading: loadingChw }] = useLazyQuery(
    GetHealthCareWorkerByUserId,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const columns: Icolumn[] = [
    {
      field: 'id',
      use: 'ID/Passport',
    },
    {
      field: 'name',
      use: 'Name',
    },
    {
      field: 'connectUsageComponent',
      use: 'CHW Connect usage',
    },
    {
      field: 'dateInvited',
      use: 'Date invited',
    },
    {
      field: 'status',
      use: 'Status',
    },
  ];

  const rows = data?.healthCareWorkersOptedOutOfMonthlyMeeting?.map((hcw) => ({
    userId: hcw?.userId,
    key: hcw?.idNumber ?? '-',
    id: hcw?.idNumber ?? '-',
    name: hcw?.name ?? '-',
    connectUsageColor: hcw?.connectUsageColor,
    connectUsage: hcw?.connectUsage,
    connectUsageComponent: hcw?.connectUsage
      ? columnColor(hcw.connectUsage)
      : '-',
    dateInvited: hcw?.dateInvited
      ? format(new Date(hcw.dateInvited), 'dd/MM/yyyy')
      : '-',
    status:
      hcw?.isActive !== undefined ? (
        <p className={hcw?.isActive ? 'text-successMain' : 'text-errorMain'}>
          {hcw?.isActive ? 'Active' : 'Inactive'}
        </p>
      ) : (
        '-'
      ),
  }));

  const viewSelectedRow = (selectedRow: Irow) => {
    getChwById({
      variables: {
        userId: selectedRow?.userId,
      },
    })
      .then((response) => {
        const chw = response?.data?.GetHealthCareWorkerById;

        localStorage.setItem('selectedUser', chw?.user?.id ?? chw?.id);
        history.push({
          pathname: ROUTES.VIEW_USERS,
          state: {
            component: 'chw',
            userId: chw?.user?.id,
            clinicId: chw?.clinicId,
            hcwId: chw?.id,
            isRegistered: chw?.isRegistered,
            connectUsage: selectedRow?.connectUsage,
            connectUsageColor: selectedRow?.connectUsageColor,
          },
        });
      })
      .catch(() => {
        setNotification({
          variant: NOTIFICATION.ERROR,
          title: 'Failed to fetch CHW',
        });
      });
  };

  return (
    <div className="mx-7 my-9 rounded-xl bg-white p-12">
      {!loading && !loadingChw && (
        <Alert
          type="info"
          title={`These CHWs have opted out of GGC in ${format(
            new Date(),
            'MMMM yyyy'
          )}.`}
          className="mb-4 rounded-lg"
        />
      )}
      <Table
        loading={{
          isLoading: loading || loadingChw,
          backgroundColor: 'secondary',
          size: 'medium',
          spinnerColor: 'adminPortalBg',
        }}
        columns={columns}
        rows={rows}
        onClickRow={viewSelectedRow}
      />
    </div>
  );
};
