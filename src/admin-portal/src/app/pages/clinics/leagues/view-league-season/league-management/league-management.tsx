import { CheckCircleIcon, ExclamationIcon } from '@heroicons/react/solid';
import { useHistory, useLocation } from 'react-router';

import {
  ActionModal,
  Alert,
  Button,
  DialogPosition,
  LoadingSpinner,
  MenuListDataItem,
  StackedList,
  StackedListType,
  Typography,
} from '@ecdlink/ui';
import { useQuery } from '@apollo/client';
import { GetLeagueSetup } from '@ecdlink/graphql';
import { LeagueIdEnum, LeagueSetupDto, useDialog } from '@ecdlink/core';

import ROUTES from '../../../../../routes/app.routes-constants';

import { LeagueSeasonRouteState } from '../types';
import { AddLeaguesRouteState } from './add-leagues/types';

export const LeagueManagement = () => {
  const history = useHistory<AddLeaguesRouteState>();

  const { state } = useLocation<LeagueSeasonRouteState>();

  const dialog = useDialog();

  const { data, loading } = useQuery<{ leagueSetupDetails?: LeagueSetupDto }>(
    GetLeagueSetup,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const currentYear = new Date().getFullYear();

  const isEmptyState =
    !data?.leagueSetupDetails?.districts.some(
      (district) => district.unassignedClinics.length > 0
    ) &&
    !data?.leagueSetupDetails?.districts.some(
      (district) => district.leagues.length > 0
    ) &&
    !data?.leagueSetupDetails?.superLeagues.length;

  const superLeaguesLength = data?.leagueSetupDetails?.superLeagues.length;

  const unassignedClinics = data?.leagueSetupDetails?.districts?.reduce(
    (acc, item) => {
      return acc + item.unassignedClinics.length;
    },
    0
  );

  const onActionOptions = (districtId?: string) => {
    dialog({
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => (
        <ActionModal
          icon="QuestionMarkCircleIcon"
          iconColor="infoMain"
          title="What would you like to do?"
          buttonClass="rounded-2xl"
          actionButtons={[
            {
              leadingIcon: 'PlusCircleIcon',
              type: 'outlined',
              colour: 'secondary',
              textColour: 'secondary',
              text: 'Add a league',
              onClick: () => {
                history.push(
                  ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ADD_LEAGUES,
                  {
                    ...state,
                    allowMultipleLeagues: false,
                    districtId,
                    leagueType: districtId
                      ? LeagueIdEnum.League
                      : LeagueIdEnum.SuperLeague,
                  }
                );
                onClose();
              },
            },
            {
              leadingIcon: 'TrashIcon',
              type: 'outlined',
              colour: 'secondary',
              textColour: 'secondary',
              text: 'Remove a league',
              onClick: () => {},
            },
            {
              leadingIcon: 'PencilIcon',
              type: 'outlined',
              colour: 'secondary',
              textColour: 'secondary',
              text: 'Add or remove clinics from a league',
              onClick: () => {},
            },
          ]}
        />
      ),
    });
  };

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
        onActionClick: () => {
          if (item.leagues.length) {
            onActionOptions(item.id);
          } else {
            history.push(
              ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ADD_LEAGUES,
              {
                ...state,
                allowMultipleLeagues: true,
                districtId: item.id,
                leagueType: LeagueIdEnum.League,
              }
            );
          }
        },
      };
    });

  const superLeagues: MenuListDataItem = {
    title: `${superLeaguesLength} super league${
      superLeaguesLength > 1 ? 's' : ''
    } added`,
    subTitle: (
      <div className="flex items-center gap-2">
        <div>
          <CheckCircleIcon className="text-successMain h-6 w-6" />
        </div>
        <Typography
          type="help"
          text={data?.leagueSetupDetails?.superLeagues
            .map(
              (item) =>
                `${item.name} - ${item.clinics?.length} clinic${
                  item.clinics?.length > 1 ? 's' : ''
                }`
            )
            .join('; ')}
          color="successMain"
        />
      </div>
    ),
    id: String(superLeaguesLength),
    backgroundColor: 'white',
    iconBackgroundColor: 'secondary',
    iconColor: 'white',
    showIcon: true,
    titleStyle: 'text-lg text-textMid font-semibold',
    subTitleStyle: 'text-sm text-textLight',
    onActionClick: () => onActionOptions(),
  };

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
      <div className="overflow-hidden rounded-2xl bg-white">
        {loading && (
          <LoadingSpinner
            className="p-7"
            backgroundColor="secondary"
            spinnerColor="adminPortalBg"
            size="medium"
          />
        )}
        {!loading && (
          <div className={superLeaguesLength ? '' : 'p-7'}>
            {isEmptyState && (
              <Typography
                type="help"
                text="There are no clinics on the admin portal yet. Add clinics first."
                color="textLight"
              />
            )}
            {!isEmptyState && (
              <>
                {superLeaguesLength > 0 ? (
                  <StackedList
                    type={'MenuList' as StackedListType}
                    listItems={[superLeagues]}
                  />
                ) : (
                  <>
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
                            allowMultipleLeagues: true,
                            districtId: undefined,
                            leagueType: LeagueIdEnum.SuperLeague,
                          }
                        )
                      }
                    />
                  </>
                )}
              </>
            )}
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
          <>
            {isEmptyState ? (
              <Typography
                type="help"
                text="There are no clinics on the admin portal yet. Add clinics first."
                color="textLight"
              />
            ) : (
              <StackedList
                type={'MenuList' as StackedListType}
                listItems={districts}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};
