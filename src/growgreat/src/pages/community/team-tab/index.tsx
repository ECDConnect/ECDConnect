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
import { useMemo } from 'react';

import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { CommunityRouteState } from '../community.types';
import { useWindowSize } from '@reach/window-size';
import { format, getMonth } from 'date-fns';

export const TeamTab: React.FC = () => {
  const history = useHistory();

  const { isOnline } = useOnlineStatus();

  const { height } = useWindowSize();

  // const { isLoading: isLoadingClub } = useThunkFetchCall(
  //   'clubs',
  //   ClubActions.GET_CLUB_FOR_USER
  // );
  // const { isLoading: isLoadingMeetRegular } = useThunkFetchCall(
  //   'clubs',
  //   ClubActions.GET_ACTIVITY_MEET_REGULAR_DETAILS
  // );
  // const { isLoading: isLoadingHostFamily } = useThunkFetchCall(
  //   'clubs',
  //   ClubActions.GET_ACTIVITY_HOST_FAMILY_DETAILS
  // );

  const isLoading = false;

  const isTop25Percent = true;

  const headerHeight = 122;

  const today = new Date();

  const leader: UserAlertListDataItem = {
    title: `{leaderName}`,
    titleStyle: 'text-textDark',
    profileDataUrl: '',
    profileText: `LN`,
    avatarColor: 'var(--primaryAccent2)',
    alertSeverity: 'none',
    hideAlertSeverity: true,
    onActionClick: () => {},
  };

  const leagueCard: MenuListDataItem = useMemo(
    () => ({
      title: 'in the league 🥳',
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
            fill={`var(--${isTop25Percent ? 'successMain' : 'secondary'})`}
          />
          <Typography
            className="relative z-10"
            color="white"
            type="h1"
            text={String(0)}
          />
        </div>
      ),
      backgroundColor: isTop25Percent ? 'successBg' : 'infoBb',
    }),
    [history, isTop25Percent]
  );

  const getQuarterDescription = (date: Date) => {
    const quarters = [
      { startMonth: 9, endMonth: 11, quarter: 1, name: 'October to December' }, // Q1: Oct, Nov, Dec
      { startMonth: 0, endMonth: 2, quarter: 2, name: 'January to March' }, // Q2: Jan, Feb, Mar
      { startMonth: 3, endMonth: 5, quarter: 3, name: 'April to June' }, // Q3: Apr, May, Jun
      { startMonth: 6, endMonth: 8, quarter: 4, name: 'July to September' }, // Q4: Jul, Aug, Sep
    ];

    const month = getMonth(date);
    let quarterDescription = '';

    quarters.forEach((currentQuarter) => {
      if (
        month >= currentQuarter.startMonth &&
        month <= currentQuarter.endMonth
      ) {
        const year = format(date, 'yyyy');
        quarterDescription = `Quarter ${currentQuarter.quarter}: ${currentQuarter.name} ${year}`;
      }
    });

    return quarterDescription;
  };

  if (isLoading) {
    <LoadingSpinner
      className="mt-10"
      size="medium"
      spinnerColor="primary"
      backgroundColor="uiLight"
    />;
  }

  return (
    <div
      className="overflow-auto p-4 pt-6"
      style={{ height: height - headerHeight }}
    >
      <div className="flex h-full flex-col">
        <Typography type="h2" text={'{clinicName}'} />
        <Typography
          type="h4"
          color="textMid"
          text={getQuarterDescription(today)}
        />
        <div className="mt-4 flex items-center justify-start gap-2">
          <StatusChip
            className="h-7"
            backgroundColour="successMain"
            borderColour="successMain"
            textColour="white"
            text={`{totalMembers} members`}
            iconPosition="start"
          />
          <StatusChip
            className="h-7"
            backgroundColour="primary"
            borderColour="primary"
            textColour="white"
            text={`{tier}`}
            iconPosition="start"
            icon="StarIcon"
          />
        </div>
        <div className="mt-7 mb-5">
          <Typography
            className="mb-2"
            type="h3"
            text="League position & points"
          />
          {isOnline ? (
            <>
              <StackedList
                isFullHeight={false}
                type={'MenuList' as StackedListType}
                listItems={[leagueCard]}
              />
              <ScoreCard
                className="mt-2"
                mainText={String(0)}
                hint="points"
                currentPoints={600}
                maxPoints={1000}
                barBgColour="uiLight"
                barColour="successMain"
                bgColour="uiBg"
                barSize="medium"
                barDivides={[
                  { widthPercentage: 40 },
                  { widthPercentage: 40 },
                  { widthPercentage: 20 },
                ]}
                barStatusChip={{
                  backgroundColour: 'primary',
                  borderColour: 'primary',
                  textColour: 'white',
                  text: '{pointsBadge}',
                }}
                textColour="black"
                onClick={() => {}}
              />
            </>
          ) : (
            <></>
            // <OfflineAlert />
          )}
        </div>
        <Typography className="mb-2 mt-6" type="h3" text="Team leader" />
        <div className="mb-4">
          <StackedList
            isFullHeight={false}
            type={'UserAlertList' as StackedListType}
            listItems={[leader]}
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
