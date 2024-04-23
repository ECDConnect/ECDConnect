import { useLayoutEffect, useMemo, useState } from 'react';
import { Icolumn, Irow } from 'react-tailwind-table';
import { format, sub } from 'date-fns';
import { useHistory, useLocation } from 'react-router';

import { ReferralSummary, formatTextToSlug } from '@ecdlink/core';
import { SearchDropDownOption, Table } from '@ecdlink/ui';
import { useQuery } from '@apollo/client';
import {
  Clinic,
  GetAllPortalClinics,
  GetReferralsSummary,
} from '@ecdlink/graphql';
import { ReferralsRouteState } from '../../referrals/types';
import { ViewReferralDetailsRouteState } from '../../referrals/view-referral-detail/types';
import ROUTES from '../../../routes/app.routes-constants';

export const SeeReports = () => {
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

  const [search, setSearch] = useState<string>('');
  const [selectedClinic, setSelectedClinic] =
    useState<SearchDropDownOption<string>[]>();

  const history = useHistory();

  const { state } = useLocation<ReferralsRouteState>();

  const selectedClinicIds = useMemo(
    () => selectedClinic?.map((clinic) => clinic.value),
    [selectedClinic]
  );

  const { data, loading } = useQuery<{ referralsSummary?: ReferralSummary[] }>(
    GetReferralsSummary,
    {
      variables: {
        startDate,
        endDate,
        clinicIds: selectedClinicIds ?? [],
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  const { data: clinicsData, loading: loadingClinics } = useQuery<{
    allPortalClinics?: Clinic[];
  }>(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });

  const clinicOptions = clinicsData?.allPortalClinics?.map(
    (clinic): SearchDropDownOption<string> => ({
      id: clinic?.id ?? '',
      label: clinic?.name ?? '',
      value: clinic?.id ?? '',
    })
  );

  const columns: Icolumn[] = [
    {
      field: 'type',
      use: 'Referral type',
    },
    {
      field: 'referralsRaised',
      use: '# referrals raised',
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

  const sortedReferralsSummary = [...(data?.referralsSummary ?? [])]?.sort(
    (a, b) => b?.referralsRaised - a?.referralsRaised
  );

  const rows: Irow[] =
    (search
      ? sortedReferralsSummary?.filter((item) =>
          item?.type?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : sortedReferralsSummary) ?? [];

  const onClearFilters = () => {
    setSearch('');
    setSelectedClinic([]);
    setDateRange([initialBefore30Days, today]);
  };

  useLayoutEffect(() => {
    if (state?.clinicIds && clinicsData?.allPortalClinics?.length > 1) {
      setSelectedClinic(
        clinicsData?.allPortalClinics
          ?.filter((clinic) => state?.clinicIds?.includes(clinic?.id))
          ?.map((clinic) => ({
            id: clinic?.id ?? '',
            label: clinic?.name ?? '',
            value: clinic?.id ?? '',
          }))
      );
    }
  }, [clinicsData?.allPortalClinics, state?.clinicIds]);

  return (
    <div className="bg-adminPortalBg min-h-full rounded-2xl p-4">
      <div className="h-auto rounded-xl bg-white p-12">
        <Table
          rows={rows}
          columns={columns}
          loading={{
            isLoading: loading || loadingClinics,
            size: 'medium',
            spinnerColor: 'adminPortalBg',
            backgroundColor: 'secondary',
          }}
          search={{
            value: search,
            placeholder: 'Search by referral type...',
            onChange: (e) => setSearch(e.target.value),
          }}
          filters={[
            {
              hideFilter: clinicsData?.allPortalClinics?.length <= 1,
              menuItemClassName: 'ml-16',
              type: 'search-dropdown',
              placeholder: 'Clinic',
              options: clinicOptions,
              selectedOptions: selectedClinic,
              onChange: setSelectedClinic,
            },
            {
              dateFormat: 'd MMM yyyy',
              className: 'w-64 border-2 mt-1',
              colour: 'secondary',
              textColour: 'white',
              showChevronIcon: true,
              hideCalendarIcon: true,
              isFullWidth: false,
              type: 'date-picker',
              selectsRange: true,
              startDate: startDateRange,
              endDate: endDateRange,
              minDate,
              maxDate: today,
              onChange: (date) => setDateRange(date),
            },
          ]}
          onClearFilters={onClearFilters}
          onClickRow={(row) =>
            history.push(
              ROUTES.REFERRALS.VIEW_REFERRAL_DETAIL.ROOT.replace(
                ':referralType',
                row.typeId
              ),
              {
                clinicIds: selectedClinicIds,
                type: row.type,
              } as ViewReferralDetailsRouteState
            )
          }
        />
      </div>
    </div>
  );
};
