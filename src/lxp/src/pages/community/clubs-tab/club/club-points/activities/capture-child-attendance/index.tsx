import { BannerWrapper, Button, EmptyPage, ScoreCard } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubSelectors, clubThunkActions } from '@/store/club';
import { ClubsRouteState } from '../../../../index.types';
import ROUTES from '@/routes/routes';
import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { AlertCard, Item } from '../0-components/alert-card';
import { Header } from '../0-components/header';
import { formatStringWithFirstLetterCapitalized } from '@ecdlink/core';
import { userSelectors } from '@/store/user';
import { getAlertType } from '../0-components/alert-card/utils';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ActivityChildAttendanceDetail } from '@ecdlink/graphql';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { UserTypeEnum } from '@/models/auth/user/UserContext';
import { ClubActivitiesPointsPerLeague } from '@/constants/club';
import { getScoreBarColor } from '@/pages/community/clubs-tab/index.filters';
import { addMonths, format } from 'date-fns';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';

export const CaptureChildAttendance: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const user = useSelector(userSelectors.getUser);
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const details = useSelector(
    clubSelectors.getActivityChildAttendanceDetailsSelector(clubId)
  );

  const history = useHistory();

  const appDispatch = useAppDispatch();

  const { isOnline } = useOnlineStatus();

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ACTIVITY_CHILD_ATTENDANCE_DETAILS
  );

  const isCoach = user?.roles?.some(
    (item) => item?.name === UserTypeEnum.Coach
  );

  const activityId = 'capture-child-attendance';

  const currentDate = new Date();
  const currentMonth = format(currentDate, 'MMMM');
  const nextMonthDate = addMonths(currentDate, 1);
  const nextMonth = format(nextMonthDate, 'MMMM');

  const formatMonthlyRecord = (
    record: ActivityChildAttendanceDetail
  ): Item => ({
    title: record.monthName ?? '',
    leftChip:
      record.percentageMembersSubmittedAllRegisters >= 0
        ? `${record.percentageMembersSubmittedAllRegisters}%`
        : undefined,
    rightChip: `+ ${record.points}`,
    alert: {
      title: 'club members submitted all registers',
      type: getAlertType(record.pointsColor ?? ''),
    },
  });

  useEffect(() => {
    if (isOnline) {
      appDispatch(
        clubThunkActions.getActivityChildAttendanceDetails({ clubId })
      );
    }
  }, [appDispatch, clubId, isOnline]);

  return (
    <BannerWrapper
      isLoading={isLoading}
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={formatStringWithFirstLetterCapitalized(activityId)}
      subTitle={club?.name ?? ''}
      onBack={() => history.goBack()}
      displayHelp
      onHelp={() =>
        history.push(
          ROUTES.COMMUNITY.CLUB.POINTS.HELP.ROOT.replace(
            ':clubId',
            clubId
          ).replace(':activityId', activityId)
        )
      }
    >
      <Header
        date={new Date()}
        icon="ClipboardCheckIcon"
        title={formatStringWithFirstLetterCapitalized(activityId)}
      />
      <ScoreCard
        className="mt-5"
        mainText={String(details?.points ?? 0)}
        hint="points"
        currentPoints={details?.points || 18}
        maxPoints={ClubActivitiesPointsPerLeague.ChildAttendance.All.max}
        barBgColour="uiLight"
        barColour={getScoreBarColor(
          details?.points ?? 0,
          ClubActivitiesPointsPerLeague.ChildAttendance.All.green,
          ClubActivitiesPointsPerLeague.ChildAttendance.All.amber
        )}
        bgColour="uiBg"
        textColour="black"
      />
      {details?.monthlyRecords?.length ? (
        <div className="mt-5">
          {details?.monthlyRecords?.map((item) => (
            <AlertCard
              key={item?.monthName}
              item={formatMonthlyRecord(item!)}
            />
          ))}
        </div>
      ) : (
        <EmptyPage
          image={AlienImage}
          title="No attendance items to show yet this year."
          subTitle={`You will be able to see the ${currentMonth} summary by 1 ${nextMonth}.`}
        />
      )}
      <Button
        className="mt-auto"
        icon="ArrowCircleLeftIcon"
        type="outlined"
        textColor="primary"
        color="primary"
        text="Back to club"
        onClick={() =>
          history.push(
            isCoach
              ? ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId)
              : ROUTES.PRACTITIONER.COMMUNITY.ROOT
          )
        }
      />
    </BannerWrapper>
  );
};
