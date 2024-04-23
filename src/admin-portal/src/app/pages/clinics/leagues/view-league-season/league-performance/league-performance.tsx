import {
  ActionModal,
  Alert,
  Breadcrumb,
  BreadcrumbProps,
  Button,
  DialogPosition,
  SearchDropDownOption,
  Table,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { Icolumn, Irow } from 'react-tailwind-table';
import ROUTES from '../../../../../routes/app.routes-constants';
import { useApolloClient, useQuery } from '@apollo/client';
import { PortalLeagueDto, useDialog, usePanel } from '@ecdlink/core';
import { Clinic, GetAllPortalClinics, GetLeagues } from '@ecdlink/graphql';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { LeagueDetailsRouteState } from './league-details/types';
import { LeagueSeasonRouteState } from '../types';
import { AssignClinicsToALeague } from './components/assign-clinics-to-a-league';
// import { checkIfIsNextSeasonManagement } from '../../utils';

export const LeaguePerformance = () => {
  const [allowRefetch, setAllowRefetch] = useState(false);
  const [districtFilter, setDistrictFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [search, setSearch] = useState('');

  const history = useHistory();

  const { state } = useLocation<LeagueSeasonRouteState>();

  const panel = usePanel();

  const dialog = useDialog();

  const apolloClient = useApolloClient();

  const today = new Date();
  const currentYear = today.getFullYear();
  const lastYear = currentYear - 1;

  // Oct ${lastYear}
  const startDatePreviousSeason = new Date(lastYear, 9, 1)
    .toISOString()
    .replace('Z', '');
  // Sep ${currentYear}
  const endDatePreviousSeason = new Date(currentYear, 8, 30)
    .toISOString()
    .replace('Z', '');

  const isNextSeasonManagement = /* checkIfIsNextSeasonManagement() */ false;

  const clinics = apolloClient.readQuery<{ allPortalClinics?: Clinic[] }>({
    query: GetAllPortalClinics,
  });

  const {
    data: previousSeason,
    loading: loadingPreviousSeason,
    refetch: refetchPreviousSeason,
  } = useQuery<{ leagues?: PortalLeagueDto[] }>(GetLeagues, {
    fetchPolicy: 'cache-and-network',
    variables: {
      startDate: startDatePreviousSeason,
      endDate: endDatePreviousSeason,
    },
    skip: !isNextSeasonManagement && !allowRefetch,
    onCompleted: () => setAllowRefetch(false),
  });

  const {
    data: currentSeason,
    loading: loadingCurrentSeason,
    refetch: refetchCurrentSeason,
  } = useQuery<{ leagues?: PortalLeagueDto[] }>(GetLeagues, {
    fetchPolicy: 'cache-and-network',
    skip: isNextSeasonManagement && !allowRefetch,
    onCompleted: () => setAllowRefetch(false),
  });

  const loadingLeagues = loadingPreviousSeason || loadingCurrentSeason;
  const leaguesData = isNextSeasonManagement ? previousSeason : currentSeason;
  const refetchLeagues = isNextSeasonManagement
    ? refetchPreviousSeason
    : refetchCurrentSeason;

  const { loading: loadingClinics } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
    skip: !!clinics?.allPortalClinics,
  });

  const loading = loadingLeagues || loadingClinics;

  const paths: BreadcrumbProps['paths'] = [
    {
      name: 'Clinics',
      url: ROUTES.CLINICS.ALL_CLINICS,
    },
    {
      name: 'Leagues',
      url: ROUTES.CLINICS.LEAGUES.ROOT,
    },
    {
      name: `${state?.startDate ?? ''} - ${state?.endDate ?? ''} Leagues`,
      url: '',
    },
  ];

  const columns: Icolumn[] = [
    {
      field: 'name',
      use: 'Name',
    },
    {
      field: 'type',
      use: 'Type',
    },
    {
      field: 'clinics',
      use: '# clinics',
    },
    {
      field: 'dateAdded',
      use: 'Date added',
    },
  ];

  const formattedLeagues: Irow[] = useMemo(
    () =>
      leaguesData?.leagues
        ?.slice()
        ?.sort(
          (a, b) =>
            new Date(b.insertedDate).getTime() -
            new Date(a.insertedDate).getTime()
        )
        ?.map((league) => ({
          leagueId: league?.id,
          name: league?.name ?? '-',
          type: league?.leagueTypeName ?? '-',
          clinics: league?.clinics?.length ?? 0,
          districtId: league?.districtId,
          dateAdded: league?.insertedDate
            ? format(new Date(league.insertedDate), 'dd/MM/yyyy')
            : '-',
        })) || [],
    [leaguesData?.leagues]
  );

  const searchedLeagues = formattedLeagues.filter((league) =>
    league.name.toLowerCase().includes(search.toLowerCase())
  );

  const rows = useMemo(() => {
    const leagues = search ? searchedLeagues : formattedLeagues;

    if (!!districtFilter?.length) {
      return leagues.filter((league) =>
        districtFilter.some((filter) => league.districtId === filter.id)
      );
    }

    return leagues;
  }, [districtFilter, formattedLeagues, search, searchedLeagues]);

  const unassignedClinics = clinics?.allPortalClinics?.filter(
    (clinic) =>
      !leaguesData?.leagues?.find((league) =>
        league?.clinics?.some((leagueClinic) => leagueClinic.id === clinic.id)
      ) && !!clinic.isActive
  );
  // TODO: remove this slice after the tests
  // ?.slice(0, 2);

  const districtsFilterOptions = useMemo(() => {
    const seenDistrictIds = new Set();
    return leaguesData?.leagues?.reduce((unique, league) => {
      if (league.districtId && !seenDistrictIds.has(league.districtId)) {
        seenDistrictIds.add(league.districtId);
        unique.push({
          id: league.districtId,
          label: league.districtName,
          value: league.districtId,
        });
      }
      return unique;
    }, []);
  }, [leaguesData?.leagues]);

  const onCancelAssignToLeague = (onClose) => {
    dialog({
      blocking: true,
      color: 'bg-white',
      transitionClassName: 'relative z-50 ',
      position: DialogPosition.Middle,
      render: (onCloseDialog) => (
        <ActionModal
          icon="ExclamationCircleIcon"
          iconColor="alertMain"
          title="Discard unsaved changes?"
          detailText="If you leave now, you will lose all of your changes."
          buttonClass="rounded-2xl"
          actionButtons={[
            {
              leadingIcon: 'PencilIcon',
              text: 'Keep editing',
              type: 'outlined',
              colour: 'secondary',
              textColour: 'secondary',
              onClick: onCloseDialog,
            },
            {
              leadingIcon: 'TrashIcon',
              text: 'Discard changes',
              type: 'filled',
              colour: 'secondary',
              textColour: 'white',
              onClick: () => {
                onCloseDialog();
                onClose();
              },
            },
          ]}
        />
      ),
    });
  };

  const onAssignToLeague = () => {
    panel({
      noPadding: true,
      title: 'Add clinics to a league',
      catchOnCancel: false,
      onCancelCallback: (onClose) => onCancelAssignToLeague(onClose),
      render: (_, onClose) => (
        <AssignClinicsToALeague
          unassignedClinics={unassignedClinics}
          leagues={leaguesData?.leagues}
          onClose={() => {
            setAllowRefetch(true);
            onClose();
            refetchLeagues();
          }}
        />
      ),
    });
  };

  return (
    <>
      <Breadcrumb paths={paths} />
      <Typography
        type="h1"
        text={`${state?.startDate ?? ''} to ${state?.endDate ?? ''} Leagues`}
        color="textMid"
        className="my-8"
      />
      {!!unassignedClinics?.length && !isNextSeasonManagement && (
        <Alert
          className="rounded-lg"
          type="warning"
          title="Some clinics are not assigned to a league!"
          list={[
            `Assign clinic(s) to a league: ${unassignedClinics
              ?.map((clinic) => clinic.name)
              .join(', ')}`,
          ]}
          listColor="textMid"
          button={
            <Button
              className="rounded-2xl px-2"
              type="filled"
              color="secondary"
              textColor="white"
              text="Assign to league"
              icon="PlusCircleIcon"
              onClick={onAssignToLeague}
            />
          }
        />
      )}
      <div className="mt-8 rounded-2xl bg-white p-12">
        <Table
          loading={{
            backgroundColor: 'secondary',
            spinnerColor: 'adminPortalBg',
            size: 'medium',
            isLoading: loading,
          }}
          columns={columns}
          rows={rows}
          search={{
            placeholder: 'Search by league name',
            value: search,
            onChange: (event) => setSearch(event.target.value),
          }}
          filters={[
            {
              type: 'search-dropdown',
              menuItemClassName: 'ml-20 w-11/12',
              placeholder: 'District',
              options: districtsFilterOptions,
              selectedOptions: districtFilter,
              onChange: (selectedOptions) => setDistrictFilter(selectedOptions),
            },
          ]}
          onClearFilters={() => setDistrictFilter([])}
          onClickRow={(row) =>
            history.push(
              ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.LEAGUE_DETAILS.replace(
                ':leagueId',
                row.leagueId
              ),
              {
                ...state,
                leagueName: row.name,
              } as LeagueDetailsRouteState
            )
          }
        />
      </div>
    </>
  );
};
