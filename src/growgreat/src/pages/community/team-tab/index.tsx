import {
  Button,
  Colours,
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

import { useHistory } from 'react-router';
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
  calculateTierPercentages,
  getTierDetails,
} from '@/utils/community/league-position';
import { LeagueType } from '@/constants/Community';

export const TeamTab: React.FC = () => {
  const hcw = useSelector(healthCareWorkerSelectors.getHealthCareWorker);
  const clinicDetails = useSelector(communitySelectors.getClinicSelector);

  const history = useHistory();

  const { height } = useWindowSize();

  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'community',
    CommunityActions.GET_CLINIC_BY_ID
  );

  const memberCount = clinicDetails?.clinicMembers?.length ?? 0;

  // TODO: get the length of the league
  const isTop25PercentInTheLeague = false;
  // TODO: get the length of the league
  const isMiddle50PercentInTheLeague = false;

  const headerHeight = 122;

  const today = new Date();

  const { tierName, tierColor } = getTierDetails(
    (clinicDetails?.league?.leagueTypeName as LeagueType) ?? LeagueType.League,
    clinicDetails?.pointsTotal ?? 0
  );
  const { bronzePercentage, silverPercentage, goldPercentage } =
    calculateTierPercentages(
      (clinicDetails?.league?.leagueTypeName as LeagueType) ?? LeagueType.League
    );

  useEffect(() => {
    appDispatch(
      communityThunkActions.getClinicById({ clinicId: hcw?.clinicId ?? '' })
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
      onActionClick: () => {},
    })) ?? [];

  const leagueCard: MenuListDataItem = useMemo(() => {
    let badgeColor: Colours = 'alertMain';
    let backgroundColor: Colours = 'alertBg';

    if (isTop25PercentInTheLeague) {
      badgeColor = 'successMain';
      backgroundColor = 'successBg';
    }

    if (isMiddle50PercentInTheLeague) {
      badgeColor = 'secondary';
      backgroundColor = 'secondaryAccent2';
    }

    return {
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
            fill={`var(--${badgeColor})`}
          />
          <Typography
            className="relative z-10"
            color="white"
            type="h1"
            text={String(clinicDetails?.leagueRanking ?? 0)}
          />
        </div>
      ),
      backgroundColor,
    };
  }, [
    clinicDetails?.leagueRanking,
    history,
    isMiddle50PercentInTheLeague,
    isTop25PercentInTheLeague,
  ]);

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

  return (
    <div
      className="overflow-auto p-4 pt-6"
      style={{ height: height - headerHeight }}
    >
      <div className="flex h-full flex-col">
        <Typography type="h2" text={clinicDetails?.name} />
        <Typography
          type="h4"
          color="textMid"
          text={getCommunityQuarterDescription(today)}
        />
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
          <div className="mt-7 mb-5">
            <Typography
              className="mb-2"
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
              mainText={String(clinicDetails?.pointsTotal ?? 0)}
              hint="points"
              currentPoints={clinicDetails.pointsTotal ?? 0}
              maxPoints={clinicDetails?.maxPointsTotal ?? 0}
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
        <Typography className="mb-2 mt-6" type="h3" text="Team leader" />
        <div className="mb-4">
          <StackedList
            isFullHeight={false}
            type={'UserAlertList' as StackedListType}
            listItems={leaders}
          />
        </div>
        <div className={`mt-auto flex flex-col gap-4`}>
          <Button
            icon="UserGroupIcon"
            type="filled"
            textColor="white"
            color="primary"
            text="See club members"
            onClick={() => {}}
          />
          <Button
            className="mb-4"
            icon="LightBulbIcon"
            type="outlined"
            textColor="primary"
            color="primary"
            text="How to earn points"
            onClick={() => history.push(ROUTES.COMMUNITY.TEAM.INFO_PAGE)}
          />
        </div>
      </div>
    </div>
  );
};
