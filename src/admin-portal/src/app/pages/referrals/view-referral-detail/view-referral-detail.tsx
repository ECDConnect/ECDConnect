import { useState } from 'react';
import { Icolumn, Irow } from 'react-tailwind-table';
import { sub } from 'date-fns';
import { Breadcrumb, BreadcrumbProps, Table, Typography } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { ViewReferralDetailRouteParams } from './types';
import {
  formatStringWithFirstLetterCapitalized,
  formatTextToSlug,
} from '@ecdlink/core';
import ROUTES from '../../../routes/app.routes-constants';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';

export const ViewReferralDetail = () => {
  const today = new Date();
  const initialBefore30Days = sub(today, {
    days: 30,
  });

  const [dateRange, setDateRange] = useState([initialBefore30Days, today]);
  const [startDate, endDate] = dateRange;

  const { referralType } = useParams<ViewReferralDetailRouteParams>();

  const history = useHistory();

  // TODO: replace with real data
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
      field: 'backReferralsMade',
      use: 'Back-referral note',
    },
    {
      field: 'backReferralsMade',
      use: 'Referral date',
    },
  ];

  // TODO: replace with real data
  const rows: Irow[] = [
    {
      client: 'Amahle & Ted Khumalo',
      chw: 'Bulelwa Mahlangu',
      referralsMade: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
      backReferralsMade: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    },
    {
      client: 'Themba & Lidia Sibiya',
      chw: 'Bulelwa Mahlangu',
      referralsMade: <XCircleIcon className="h-6 w-6 text-red-500" />,
      backReferralsMade: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    },
  ];

  const paths: BreadcrumbProps['paths'] = [
    { name: 'Referrals', url: ROUTES.REFERRALS.ROOT },
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
      <div className="rounded-xl bg-white p-12">
        <Table
          rows={rows}
          columns={columns}
          actionButton={{
            className: 'w-64 h-11',
            colour: 'secondary',
            textColour: 'white',
            showChevronIcon: true,
            hideCalendarIcon: true,
            isFullWidth: false,
            actionType: 'date-picker',
            selectsRange: true,
            startDate,
            endDate,
            maxDate: today,
            onChange: (date) => setDateRange(date),
          }}
          onClickRow={(row) =>
            history.push(
              ROUTES.REFERRALS.VIEW_REFERRAL_DETAIL.EDIT_BACK_REFERRAL.replace(
                ':referralType',
                formatTextToSlug(referralType)
              ).replace(':client', formatTextToSlug(row.client))
            )
          }
        />
      </div>
    </div>
  );
};
