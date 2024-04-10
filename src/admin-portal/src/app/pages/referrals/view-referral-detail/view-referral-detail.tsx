import { useState } from 'react';
import { Icolumn, Irow } from 'react-tailwind-table';
import { format, sub } from 'date-fns';
import { Breadcrumb, BreadcrumbProps, Table, Typography } from '@ecdlink/ui';
import { useHistory, useLocation, useParams } from 'react-router';
import {
  ViewReferralDetailRouteParams,
  ViewReferralDetailsRouteState,
} from './types';
import {
  ReferralDetails,
  formatStringWithFirstLetterCapitalized,
  formatTextToSlug,
} from '@ecdlink/core';
import ROUTES from '../../../routes/app.routes-constants';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';
import { useQuery } from '@apollo/client';
import { GetReferrals } from '@ecdlink/graphql';
import { EditBackReferralRouteState } from '../edit-back-referral/types';

export const ViewReferralDetail = () => {
  const today = new Date();
  const initialBefore30Days = sub(today, {
    days: 30,
  });
  const minDate = sub(today, {
    months: 6,
  });

  const [dateRange, setDateRange] = useState([initialBefore30Days, today]);
  const [startDateRange, endDateRange] = dateRange;
  const startDate = format(startDateRange, 'yyyy-MM-dd');
  const endDate = format(endDateRange ?? startDateRange, 'yyyy-MM-dd');

  const { referralType } = useParams<ViewReferralDetailRouteParams>();

  const { state } = useLocation<ViewReferralDetailsRouteState>();

  const history = useHistory();

  const { data, loading } = useQuery<{ referrals: ReferralDetails[] }>(
    GetReferrals,
    {
      variables: {
        type: formatStringWithFirstLetterCapitalized(referralType),
        startDate,
        endDate,
        clinicIds: state?.clinicIds ?? [],
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  const columns: Icolumn[] = [
    {
      field: 'client',
      use: 'Client',
    },
    {
      field: 'chw',
      use: 'CHW',
    },
    {
      field: 'referralsMade',
      use: 'Referral made?',
    },
    {
      field: 'backReferralsMade',
      use: 'Back-referral made?',
    },
    {
      field: 'backReferralNote',
      use: 'Back-referral note',
    },
    {
      field: 'referralDate',
      use: 'Referral date',
    },
  ];

  const greenIcon = <CheckCircleIcon className="h-6 w-6 text-green-500" />;
  const redIcon = <XCircleIcon className="h-6 w-6 text-red-500" />;

  const rows: Irow[] =
    data?.referrals.map((referral) => ({
      visitBackReferralId: referral?.visitBackReferralId ?? '',
      client: referral?.client ?? '-',
      chw: referral?.healthCareWorker ?? '-',
      referralsMade: referral?.isCompleted ? greenIcon : redIcon,
      backReferralsMade: referral?.isBackReferralCompleted
        ? greenIcon
        : redIcon,
      backReferralNote: referral?.healthCareWorkerBackReferralNote ?? '-',
      referralDate: referral?.createdDate
        ? format(new Date(referral.createdDate), 'dd/MM/yyyy')
        : '-',
    })) ?? [];

  const paths: BreadcrumbProps['paths'] = [
    { name: 'Referrals', url: ROUTES.REFERRALS.ROOT, state },
    { name: 'View referral detail', url: '' },
  ];

  return (
    <div className="bg-adminPortalBg h-full rounded-2xl p-4">
      <Breadcrumb paths={paths} />
      <Typography
        className="mt-9 mb-9"
        type="h1"
        text={formatStringWithFirstLetterCapitalized(referralType)}
        color="textDark"
      />
      <div className="rounded-xl bg-white px-12 pb-12 pt-4">
        <Table
          rows={rows}
          columns={columns}
          noContentText="No referrals were made for this time period."
          loading={{
            isLoading: loading,
            size: 'medium',
            spinnerColor: 'adminPortalBg',
            backgroundColor: 'secondary',
          }}
          actionButton={{
            className: 'w-64 h-11',
            colour: 'secondary',
            textColour: 'white',
            showChevronIcon: true,
            hideCalendarIcon: true,
            isFullWidth: false,
            actionType: 'date-picker',
            selectsRange: true,
            startDate: startDateRange,
            endDate: endDateRange,
            minDate,
            maxDate: today,
            onChange: (date) => setDateRange(date),
          }}
          onClickRow={(row) =>
            history.push(
              ROUTES.REFERRALS.VIEW_REFERRAL_DETAIL.EDIT_BACK_REFERRAL.replace(
                ':referralType',
                formatTextToSlug(referralType)
              )
                // .replace(':visitBackReferralId', formatTextToSlug(row.visitBackReferralId)),
                .replace(':visitBackReferralId', 'to-do'),
              {
                startDate,
                endDate,
                clinicIds: state?.clinicIds,
              } as EditBackReferralRouteState
            )
          }
        />
      </div>
    </div>
  );
};
