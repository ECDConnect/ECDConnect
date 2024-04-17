import { CheckCircleIcon, ExclamationIcon } from '@heroicons/react/solid';
import { useHistory, useLocation } from 'react-router';

import {
  Alert,
  Button,
  LoadingSpinner,
  MenuListDataItem,
  StackedList,
  StackedListType,
  Typography,
} from '@ecdlink/ui';
import { useQuery } from '@apollo/client';
import { GetLeagueSetup } from '@ecdlink/graphql';
import { LeagueIdEnum, LeagueSetupDto } from '@ecdlink/core';

import ROUTES from '../../../../../routes/app.routes-constants';

import { LeagueSeasonRouteState } from '../types';
import { AddLeaguesRouteState } from './add-leagues/types';

export const LeagueManagement = () => {
  const history = useHistory<AddLeaguesRouteState>();

  const { state } = useLocation<LeagueSeasonRouteState>();

  const { data, loading } = useQuery<{ leagueSetupDetails?: LeagueSetupDto }>(
    GetLeagueSetup,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const currentYear = new Date().getFullYear();

  const unassignedClinics = data?.leagueSetupDetails?.districts?.reduce(
    (acc, item) => {
      return acc + item.unassignedClinics.length;
    },
    0
  );

  const districts: MenuListDataItem[] =
    data?.leagueSetupDetails?.districts?.map((item, index) => {
      const countUnassignedClinics = item?.unassignedClinics?.length;
      return {
        title: item.name,
        subTitle: (
          <div className="flex gap-2">
            <div>
              {!!countUnassignedClinics ? (
                <ExclamationIcon className="text-alertMain h-6 w-6" />
              ) : (
                <CheckCircleIcon className="text-successMain h-6 w-6" />
              )}
            </div>
            <p
              className={`${
                countUnassignedClinics ? 'text-alertMain' : 'text-successMain'
              }`}
            >
              {countUnassignedClinics
                ? `${countUnassignedClinics} clinic${
                    countUnassignedClinics > 1 ? 's' : ''
                  } not`
                : 'All clinics'}{' '}
              assigned to a league
            </p>
          </div>
        ),
        id: item.id,
        backgroundColor: 'white',
        iconBackgroundColor: 'secondary',
        iconColor: 'white',
        showIcon: true,
        className:
          data.leagueSetupDetails.districts.length === index + 1
            ? ''
            : 'border-b border-gray-200',
        titleStyle: 'text-lg text-textMid font-semibold',
        subTitleStyle: 'text-sm text-textLight',
        onActionClick: () =>
          history.push(ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ADD_LEAGUES, {
            ...state,
            districtId: item.id,
            leagueType: LeagueIdEnum.League,
          }),
      };
    });

  return (
    <>
      <Typography
        type="h1"
        text={`${state?.startDate ?? ''} - ${state?.endDate ?? ''} Leagues`}
        color="textMid"
        className="my-8"
      />
      {!!unassignedClinics && (
        <Alert
          className="rounded-lg"
          type="infoDark"
          title={`${unassignedClinics} clinics are not in a league. You must assign all clinics to leagues by 30 September ${currentYear}.`}
          list={[
            'Add a super league, or click a district below to add leagues.',
          ]}
          listColor="white"
        />
      )}
      <Typography
        type="h2"
        text="Super Leagues"
        color="textMid"
        className="mt-9"
      />
      <Typography
        type="help"
        text="Click below to add a super league."
        color="textLight"
        className="mb-4"
      />
      <div className="rounded-2xl bg-white">
        {loading ? (
          <LoadingSpinner
            className="p-7"
            backgroundColor="secondary"
            spinnerColor="adminPortalBg"
            size="medium"
          />
        ) : (
          <div className="p-7">
            <Typography
              type="help"
              text="You haven’t added any super leagues yet."
              color="textLight"
              className="mb-4"
            />
            <Button
              type="filled"
              color="secondary"
              text="Add a super league"
              textColor="white"
              className="rounded-2xl px-16"
              icon="PlusCircleIcon"
              onClick={() =>
                history.push(
                  ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ADD_LEAGUES,
                  {
                    ...state,
                    districtId: undefined,
                    leagueType: LeagueIdEnum.SuperLeague,
                  }
                )
              }
            />
          </div>
        )}
      </div>
      <Typography type="h2" text="Leagues" color="textMid" className="mt-9" />
      <Typography
        type="help"
        text="Click a district below to add leagues."
        color="textLight"
        className="mb-4"
      />
      <div className="overflow-hidden rounded-2xl bg-white">
        {loading ? (
          <LoadingSpinner
            className="p-7"
            backgroundColor="secondary"
            spinnerColor="adminPortalBg"
            size="medium"
          />
        ) : (
          <StackedList
            type={'MenuList' as StackedListType}
            listItems={districts}
          />
        )}
      </div>
    </>
  );
};
