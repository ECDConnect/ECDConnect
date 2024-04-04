import { useState } from 'react';
import { Icolumn, Irow } from 'react-tailwind-table';
import { sub } from 'date-fns';
import { useHistory } from 'react-router';
import ROUTES from '../../routes/app.routes-constants';
import { formatTextToSlug } from '@ecdlink/core';
import { Table } from '@ecdlink/ui';

export const Referrals = () => {
  const today = new Date();
  const initialBefore30Days = sub(today, {
    days: 30,
  });

  const [dateRange, setDateRange] = useState([initialBefore30Days, today]);
  const [startDate, endDate] = dateRange;

  const [search, setSearch] = useState<string>('');

  const history = useHistory();

  // TODO: replace with real data
  const columns: Icolumn[] = [
    {
      field: 'type',
      use: 'Referral type',
    },
    {
      field: 'referralsMade',
      use: '# referrals made',
    },
    {
      field: 'backReferralsMade',
      use: '# back-referrals made',
    },
  ];

  // TODO: replace with real data
  const rows: Irow[] = [
    {
      type: 'Early identification of pregnancy',
      referralsMade: 12,
      backReferralsMade: 8,
    },
    {
      type: 'Child support grant',
      referralsMade: 7,
      backReferralsMade: 2,
    },
  ];

  return (
    <div className="bg-adminPortalBg h-full rounded-2xl p-4">
      <div className="rounded-xl bg-white p-12">
        <Table
          rows={rows}
          columns={columns}
          search={{
            value: search,
            placeholder: 'Search by referral type...',
            onChange: (e) => setSearch(e.target.value),
          }}
          filters={[
            {
              className: 'mt-1',
              type: 'search-dropdown',
              placeholder: 'Clinic',
              options: [],
            },
            {
              className: 'w-64 h-11',
              colour: 'secondary',
              textColour: 'white',
              showChevronIcon: true,
              hideCalendarIcon: true,
              isFullWidth: false,
              type: 'date-picker',
              selectsRange: true,
              startDate,
              endDate,
              maxDate: today,
              onChange: (date) => setDateRange(date),
            },
          ]}
          onClickRow={(row) =>
            history.push(
              ROUTES.REFERRALS.VIEW_REFERRAL_DETAIL.ROOT.replace(
                ':referralType',
                formatTextToSlug(row.type)
              )
            )
          }
        />
      </div>
    </div>
  );
};
