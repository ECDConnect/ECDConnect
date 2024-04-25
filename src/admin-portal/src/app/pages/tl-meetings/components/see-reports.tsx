import { useLayoutEffect, useMemo, useState } from 'react';
import { Icolumn, Irow } from 'react-tailwind-table';
import { useHistory, useLocation } from 'react-router';
import { MeetingDto } from '@ecdlink/core';
import { SearchDropDownOption, Table } from '@ecdlink/ui';
import { useQuery } from '@apollo/client';
import {
  Clinic,
  GetAllClinicMeetings,
  GetAllPortalClinics,
  GetAllTeamLead,
} from '@ecdlink/graphql';
import { ReferralsRouteState } from '../../referrals/types';
import ROUTES from '../../../routes/app.routes-constants';
import { format } from 'date-fns';

export const SeeReports = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedClinic, setSelectedClinic] =
    useState<SearchDropDownOption<string>[]>();
  const [selectedTeamLead, setSelectedTeamLead] =
    useState<SearchDropDownOption<string>[]>();
  const filteredClinics = useMemo(
    () => selectedClinic?.map((item) => item?.id),
    [selectedClinic]
  );
  const filteredTeamLeads = useMemo(
    () => selectedTeamLead?.map((item) => item?.id),
    [selectedTeamLead]
  );

  const history = useHistory();

  const { state } = useLocation<ReferralsRouteState>();

  const { data: clinicsData, loading: loadingClinics } = useQuery<{
    allPortalClinics?: Clinic[];
  }>(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: reportsData, loading: loadingReports } = useQuery<{
    allClinicMeetings?: MeetingDto[];
  }>(GetAllClinicMeetings, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: teamLeadtData, loading: loadingTeamLeads } = useQuery(
    GetAllTeamLead,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        search: '',
        clinicSearch: [],
        provinceSearch: [],
        subDistrictSearch: [],
        visitSearch: [],
        connectUsageSearch: [],
        pagingInput: {
          pageNumber: 1,
          pageSize: null,
        },
        order: [
          {
            insertedDate: 'DESC',
          },
        ],
      },
    }
  );

  const clinicOptions = clinicsData?.allPortalClinics?.map(
    (clinic): SearchDropDownOption<string> => ({
      id: clinic?.id ?? '',
      label: clinic?.name ?? '',
      value: clinic?.id ?? '',
    })
  );

  const teamLeadOptions = teamLeadtData?.allTeamLeads?.map(
    (teamLead): SearchDropDownOption<string> => ({
      id: teamLead?.id ?? '',
      label: teamLead?.user?.fullName ?? '',
      value: teamLead?.id ?? '',
    })
  );

  const columns: Icolumn[] = [
    {
      field: 'clinicName',
      use: 'Clinic',
    },
    {
      field: 'month',
      use: 'Month',
    },
    {
      field: 'meetingTopicTitle',
      use: 'Topic',
    },
    {
      field: 'dateSubmitted',
      use: 'Date submitted',
    },
  ];

  const sortedReports = [...(reportsData?.allClinicMeetings ?? [])]?.sort(
    (a, b) => Number(b?.dateSubmitted) - Number(a?.dateSubmitted)
  );

  const clinicsResult = sortedReports?.filter((report) =>
    filteredClinics?.includes(report?.clinicId)
  );
  const teamLeadsResult = sortedReports?.filter((report) =>
    filteredTeamLeads?.includes(report?.teamLeadId)
  );

  const filteredData = useMemo(() => {
    if (filteredClinics?.length > 0 && filteredTeamLeads?.length > 0) {
      const result = teamLeadsResult.filter((elem) => {
        return clinicsResult.some((x) => elem.clinicId.includes(x?.clinicId));
      });

      return result;
    }

    if (filteredTeamLeads?.length > 0) {
      return teamLeadsResult;
    }

    if (filteredClinics?.length > 0) {
      return clinicsResult;
    }

    return sortedReports;
  }, [
    clinicsResult,
    filteredClinics,
    filteredTeamLeads,
    sortedReports,
    teamLeadsResult,
  ]);

  const rows: Irow[] =
    (search
      ? filteredData?.filter((item) =>
          item?.clinicName
            ?.toLocaleLowerCase()
            .includes(search.toLocaleLowerCase())
        )
      : filteredData.map((item) => ({
          ...item,
          meetingTopicTitle: item?.meetingTopic?.topicTitle,
          dateSubmitted: format(new Date(item?.dateSubmitted), 'dd/MM/yyyy'),
          month: item?.meetingTopic?.title,
        }))) ?? [];

  const onClearFilters = () => {
    setSearch('');
    setSelectedClinic([]);
    setSelectedTeamLead([]);
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
            isLoading: loadingReports || loadingClinics || loadingTeamLeads,
            size: 'medium',
            spinnerColor: 'adminPortalBg',
            backgroundColor: 'secondary',
          }}
          search={{
            value: search,
            placeholder: 'Search by clinic, topic or month...',
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
              multiple: true,
            },
            {
              hideFilter: teamLeadtData?.allTeamLeads?.length <= 1,
              menuItemClassName: 'ml-16',
              type: 'search-dropdown',
              placeholder: 'Team Lead',
              options: teamLeadOptions,
              selectedOptions: selectedTeamLead,
              onChange: setSelectedTeamLead,
              multiple: true,
            },
          ]}
          onClearFilters={onClearFilters}
          onClickRow={(row) =>
            history.push(ROUTES.TL_MEETINGS.REPORTS.VIEW_REPORT, {
              report: {
                ...row,
                dateSubmitted: reportsData?.allClinicMeetings?.find(
                  (item) => item?.id === row?.id
                )?.dateSubmitted,
              },
            })
          }
        />
      </div>
    </div>
  );
};
