import {
  ActionModal,
  Alert,
  Button,
  DialogPosition,
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
import { useState } from 'react';
import { LeagueDetailsRouteState } from './league-details/types';
import { LeagueSeasonRouteState } from '../types';
import { AssignClinicsToALeague } from './components/assign-clinics-to-a-league';

export const LeaguePerformance = () => {
  const [allowRefetch, setAllowRefetch] = useState(false);
  const [search, setSearch] = useState('');

  const history = useHistory();

  const { state } = useLocation<LeagueSeasonRouteState>();

  const panel = usePanel();

  const dialog = useDialog();

  const apolloClient = useApolloClient();

  const data = apolloClient.readQuery<{ leagues?: PortalLeagueDto[] }>({
    query: GetLeagues,
  });
  const clinics = apolloClient.readQuery<{ allPortalClinics?: Clinic[] }>({
    query: GetAllPortalClinics,
  });

  const { loading: loadingLeagues, refetch: refetchLeagues } = useQuery<{
    leagues?: PortalLeagueDto[];
  }>(GetLeagues, {
    fetchPolicy: 'cache-and-network',
    skip: !!data?.leagues && !allowRefetch,
    onCompleted: () => setAllowRefetch(false),
  });
  const { loading: loadingClinics } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
    skip: !!clinics?.allPortalClinics,
  });

  const loading = loadingLeagues || loadingClinics;

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

  const formattedLeagues: Irow[] =
    data?.leagues
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
        dateAdded: league?.insertedDate
          ? format(new Date(league.insertedDate), 'dd/MM/yyyy')
          : '-',
      })) || [];

  const rows = search
    ? formattedLeagues.filter((league) =>
        league.name.toLowerCase().includes(search.toLowerCase())
      )
    : formattedLeagues;

  const unassignedClinics = clinics?.allPortalClinics
    ?.filter((clinic) => !clinic.leagues?.length)
    // TODO: remove this slice after the tests
    ?.slice(0, 2);

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
          leagues={data?.leagues}
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
      <Typography
        type="h1"
        text={`${state?.startDate ?? ''} to ${state?.endDate ?? ''} Leagues`}
        color="textMid"
        className="my-8"
      />
      {!!unassignedClinics?.length && (
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
              placeholder: 'District',
              // TODO: getLeagues isn't returning district data
              options: [],
            },
          ]}
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
