import {
  Button,
  LoadingSpinner,
  MenuListDataItem,
  ScoreCard,
  StackedList,
  StackedListType,
  StatusChip,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { useEffect, useMemo } from 'react';

import { useHistory, useLocation } from 'react-router';
import ROUTES from '@/routes/routes';
import { CommunityRouteState } from '../community.types';
import { useWindowSize } from '@reach/window-size';
import { getCommunityQuarterDescription } from '@/utils/community/community-quartes.utils';
import { useAppDispatch } from '@/store';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { useSelector } from 'react-redux';
import { healthCareWorkerSelectors } from '@/store/healthCareWorker';
import { CommunityActions } from '@/store/community/community.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import {
  calculateClinicLeaguePositionPercentiles,
  calculateTierPercentages,
  getLeaguePointsColours,
  getTierDetails,
} from '@/utils/community/league-position';
import { LeagueType } from '@/constants/Community';

import { NoCommunityFound } from '../0-components/no-community-found';
import { useSnackbar } from '@ecdlink/core';
import { TeamTabState } from './types';

export const TeamTab: React.FC = () => {
  const hcw = useSelector(healthCareWorkerSelectors.getHealthCareWorker);
  const clinicDetails = useSelector(communitySelectors.getClinicSelector);
  const league = useSelector(communitySelectors.getLeagueSelector);

  const history = useHistory();

  const { height } = useWindowSize();

  const appDispatch = useAppDispatch();

  const { showMessage } = useSnackbar();

  const { state } = useLocation<TeamTabState>();

  const {
    isLoading: isLoadingClinic,
    wasLoading: wasLoadingClinic,
    isRejected: isRejectedClinic,
    error: errorClinic,
  } = useThunkFetchCall('community', CommunityActions.GET_CLINIC_BY_ID);
  const {
    isLoading: isLoadingLeague,
    wasLoading: wasLoadingLeague,
    isRejected: isRejectedLeague,
    error: errorLeague,
  } = useThunkFetchCall('community', CommunityActions.GET_LEAGUE_BY_ID);

  const isLoading = isLoadingClinic || (!league && isLoadingLeague);
  const wasLoading = wasLoadingLeague || wasLoadingClinic;
  const isRejected = isRejectedLeague || isRejectedClinic;
  const error = errorLeague || errorClinic;

  useEffect(() => {
    if (wasLoading && !isLoading && isRejected) {
      showMessage({
        message: error,
        type: 'error',
      });
    }
  }, [error, isLoading, isRejected, showMessage, wasLoading]);

  const memberCount = clinicDetails?.clinicMembers?.length ?? 0;

  const { isTop25PercentInTheLeague, isMiddle50PercentInTheLeague } =
    calculateClinicLeaguePositionPercentiles(
      league?.clinics ?? [],
      clinicDetails?.points?.leagueRanking ?? 0
    );

  const headerHeight = 122;

  const today = new Date();

  const { quarterDescription } = getCommunityQuarterDescription(today);

  const { tierName, tierColor } = getTierDetails(
    (clinicDetails?.league?.leagueTypeName as LeagueType) ?? LeagueType.League,
    clinicDetails?.points?.pointsTotal ?? 0
  );
  const { bronzePercentage, silverPercentage, goldPercentage } =
    calculateTierPercentages(
      (clinicDetails?.league?.leagueTypeName as LeagueType) ?? LeagueType.League
    );

  const leaguePointsColours = getLeaguePointsColours(
    isTop25PercentInTheLeague,
    isMiddle50PercentInTheLeague
  );

  useEffect(() => {
    appDispatch(
      communityThunkActions.getClinicById({
        clinicId: hcw?.clinicId ?? '',
        forceReload: state?.forceReload ?? true,
      })
    );

    // trigger only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leaders: UserAlertListDataItem[] =
    clinicDetails?.teamLeads?.map((leader) => ({
      title: `${leader.firstName ?? ''} ${leader.surname ?? ''}`,
      titleStyle: 'text-textDark',
      profileDataUrl: '',
      profileText: `${leader.firstName.charAt(0)}${leader.surname.charAt(0)}`,
      avatarColor: 'var(--primaryAccent2)',
      alertSeverity: 'none',
      hideAlertSeverity: true,
      onActionClick: () =>
        history.push(
          ROUTES.COMMUNITY.TEAM.MEMBERS.LEADER_PROFILE.replace(
            ':leaderId',
            leader.id
          ),
          { isFromTeamTab: true } as TeamTabState
        ),
    })) ?? [];

  const leagueCard: MenuListDataItem = useMemo(
    () => ({
      title: `in the league ${isTop25PercentInTheLeague ? '🥳' : ''}`,
      titleStyle: 'text-textDark',
      onActionClick: () => {
        history.push(ROUTES.COMMUNITY.ROOT, {
          activeTabIndex: 1,
        } as CommunityRouteState);
      },
      customIcon: (
        <div className="relative mr-4 flex h-11 w-11 items-center justify-center">
          <Badge
            className="absolute z-0 h-auto w-auto"
            fill={`var(--${leaguePointsColours.mainColour})`}
          />
          <Typography
            className="relative z-10"
            color="white"
            type="h1"
            text={String(clinicDetails?.points?.leagueRanking ?? 0)}
          />
        </div>
      ),
      backgroundColor: leaguePointsColours.backgroundColour,
    }),
    [
      clinicDetails?.points?.leagueRanking,
      history,
      isTop25PercentInTheLeague,
      leaguePointsColours,
    ]
  );

  if (isLoading) {
    return (
      <LoadingSpinner
        className="mt-6"
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
      />
    );
  }

  if (!clinicDetails) {
    return <NoCommunityFound />;
  }

  return (
    <div
      className="overflow-auto p-4 pt-6"
      style={{ height: height - headerHeight }}
    >
      <div className="flex h-full flex-col">
        <Typography type="h2" text={clinicDetails?.name} />
        <Typography type="h4" color="textMid" text={quarterDescription} />
        <div className="mt-4 flex items-center justify-start gap-2">
          <StatusChip
            className="h-7"
            backgroundColour="successMain"
            borderColour="successMain"
            textColour="white"
            text={`${memberCount} ${memberCount === 1 ? 'member' : 'members'}`}
            iconPosition="start"
          />
          <StatusChip
            className="h-7"
            backgroundColour={tierColor}
            borderColour={tierColor}
            textColour="white"
            text={tierName}
            iconPosition="start"
            icon="StarIcon"
          />
        </div>
        {!!clinicDetails?.league && (
          <div className="my-7">
            <Typography
              className="mb-5"
              type="h3"
              text="League position & points"
            />
            <StackedList
              isFullHeight={false}
              type={'MenuList' as StackedListType}
              listItems={[leagueCard]}
            />
            <ScoreCard
              className="mt-2"
              mainText={String(clinicDetails?.points?.pointsTotal ?? 0)}
              hint="points"
              currentPoints={clinicDetails?.points?.pointsTotal ?? 0}
              maxPoints={clinicDetails?.points?.maxPointsTotal ?? 0}
              barBgColour="uiLight"
              barColour={tierColor}
              bgColour="uiBg"
              barSize="medium"
              barDivides={[
                { widthPercentage: bronzePercentage },
                { widthPercentage: silverPercentage },
                { widthPercentage: goldPercentage },
              ]}
              barStatusChip={{
                backgroundColour: 'primary',
                borderColour: 'primary',
                textColour: 'white',
                text: tierName,
              }}
              textColour="black"
              onClick={() => history.push(ROUTES.COMMUNITY.TEAM.POINTS.ROOT)}
            />
          </div>
        )}
        {!!leaders.length && (
          <>
            <Typography
              className="mb-5"
              type="h3"
              text={`Team leader${leaders.length > 1 ? 's' : ''}`}
            />
            <div className="mb-4">
              <StackedList
                className="flex flex-col gap-2"
                isFullHeight={false}
                type={'UserAlertList' as StackedListType}
                listItems={leaders}
              />
            </div>
          </>
        )}
        <div className={`mt-auto flex flex-col gap-4`}>
          <Button
            icon="UserGroupIcon"
            type="filled"
            textColor="white"
            color="primary"
            text="See team members"
            onClick={() => history.push(ROUTES.COMMUNITY.TEAM.MEMBERS.ROOT)}
          />
          <Button
            className="mb-4"
            icon="LightBulbIcon"
            type="outlined"
            textColor="primary"
            color="primary"
            text="How to earn points"
            onClick={() =>
              history.push(ROUTES.COMMUNITY.TEAM.INFO_PAGE, {
                isFromTeamTab: true,
              } as TeamTabState)
            }
          />
        </div>
      </div>
    </div>
  );
};
