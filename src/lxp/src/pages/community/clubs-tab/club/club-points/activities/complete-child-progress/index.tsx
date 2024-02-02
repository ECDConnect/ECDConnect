import {
  Alert,
  AlertType,
  BannerWrapper,
  Button,
  EmptyPage,
  ScoreCard,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { ClubsRouteState } from '../../../../index.types';
import ROUTES from '@/routes/routes';
import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { AlertCard, Item } from '../0-components/alert-card';
import { Header } from '../0-components/header';
import { formatStringWithFirstLetterCapitalized } from '@ecdlink/core';
import { userSelectors } from '@/store/user';
import { Fragment, useEffect, useState } from 'react';
import { useAppDispatch } from '@/store';
import {
  ClubActions,
  getActivityChildProgressDetails,
} from '@/store/club/club.actions';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { UserTypeEnum } from '@/models/auth/user/UserContext';
import { ActivityChildProgressDetailDto } from '@/models/club/club.dto';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { CaregiverMeeting } from '../0-components/caregiver-meeting';
import { ClubActivitiesPointsPerLeague } from '@/constants/club';
import PositiveEmoticon from '@/assets/positive-bonus-emoticon.png';
import { getScoreBarColor } from '@/pages/community/clubs-tab/index.filters';

export const CompleteChildProgressReports: React.FC = () => {
  const [isLogCaregiverMeeting, setIsLogCaregiverMeeting] = useState(false);

  const appDispatch = useAppDispatch();

  const { isOnline } = useOnlineStatus();

  const { clubId } = useParams<ClubsRouteState>();

  const user = useSelector(userSelectors.getUser);
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const points = useSelector(
    clubSelectors.getActivityChildProgressReportsSelector(clubId)
  );
  const lastReportBack = useSelector(
    clubSelectors.getLastCaregiverReportBackDateForPractitioner
  );

  const date = new Date();
  const hasLoggedCaregiverMeeting =
    !!lastReportBack &&
    lastReportBack.year === date.getFullYear() &&
    ((lastReportBack.month === 6 && date.getMonth() < 7) ||
      (lastReportBack.month === 11 && date.getMonth() > 6));

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ACTIVITY_CHILD_PROGRESS_DETAILS
  );

  const isCoach = user?.roles?.some(
    (item) => item?.name === UserTypeEnum.Coach
  );

  useEffect(() => {
    if (isOnline) {
      appDispatch(
        getActivityChildProgressDetails({
          clubId,
        })
      );
    }
  }, [clubId, isOnline]);

  const history = useHistory();

  const activityId = 'complete-child-progress-reports';

  const month = new Date().getMonth();
  const isAfterJuly = month > 6;

  const pointsConfig =
    ClubActivitiesPointsPerLeague.CompleteChildProgressReports.All;

  const monthlyRecords = points?.monthlyRecords?.find((record) =>
    record.monthName.includes(isAfterJuly ? 'November' : 'June')
  );

  const isToShowWellDoneMessage =
    monthlyRecords?.caregiverPerc === 100 &&
    monthlyRecords?.progressPerc === 100;
  const isToShowCaregiverMeetingButton =
    monthlyRecords?.caregiverPerc !== 0 || monthlyRecords?.progressPerc !== 0;

  const isCelebratoryMessage = points?.points === pointsConfig.max;

  const submitButton =
    !isCoach &&
    !hasLoggedCaregiverMeeting &&
    isToShowCaregiverMeetingButton &&
    ((month >= 3 && month <= 7) || month >= 10) ? (
      <Button
        icon="PlusCircleIcon"
        type="filled"
        textColor="white"
        color="primary"
        text="Log caregiver meeting"
        onClick={() => setIsLogCaregiverMeeting(true)}
      />
    ) : (
      <></>
    );

  const mapProgressCard = (
    monthRecord: ActivityChildProgressDetailDto
  ): Item => {
    return {
      title: '',
      leftChip: `${monthRecord.progressPerc}%`,
      rightChip: `+ ${monthRecord.progressPoints}`,
      alert: {
        title: 'club members created progress reports for all children',
        type: monthRecord.progressPointsColor.toLowerCase() as AlertType,
      },
    };
  };

  const mapCaregiverCard = (
    monthRecord: ActivityChildProgressDetailDto
  ): Item => {
    return {
      title: '',
      leftChip: `${monthRecord.caregiverPerc}%`,
      rightChip: `+ ${monthRecord.caregiverPoints}`,
      alert: {
        title: 'club members met with caregivers to discuss child progress',
        type: monthRecord.caregiverPointsColor.toLowerCase() as AlertType,
      },
    };
  };

  return (
    <BannerWrapper
      isLoading={isLoading}
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="medium"
      renderBorder={true}
      color={'primary'}
      title={formatStringWithFirstLetterCapitalized(activityId)}
      subTitle={club?.name ?? ''}
      onBack={() => history.goBack()}
      displayOffline={!isOnline}
      displayHelp
      onHelp={() =>
        history.push(
          ROUTES.COMMUNITY.CLUB.POINTS.HELP.replace(':clubId', clubId).replace(
            ':helpSection',
            'Complete Child Progress'
          )
        )
      }
    >
      <Header
        date={new Date()}
        icon="DocumentReportIcon"
        title={formatStringWithFirstLetterCapitalized(activityId)}
      />
      <ScoreCard
        className="mt-5 mb-5"
        mainText={`${points?.points || 0}`}
        hint="points"
        currentPoints={points?.points || 8}
        maxPoints={
          ClubActivitiesPointsPerLeague.CompleteChildProgressReports.All.max
        }
        barBgColour="uiLight"
        barColour={getScoreBarColor(
          points?.points ?? 0,
          pointsConfig.green,
          pointsConfig.amber
        )}
        bgColour="uiBg"
        textColour="black"
      />
      {isCelebratoryMessage && !isCoach && (
        <Alert
          className="mb-4"
          type="successLight"
          title={
            hasLoggedCaregiverMeeting
              ? `Great job ${user?.firstName}!`
              : 'Wow, great job!'
          }
          message={
            hasLoggedCaregiverMeeting
              ? 'You completed all child progress reports and met with caregivers.'
              : ''
          }
          messageColor="textDark"
          customIcon={
            <div className="h-12 w-14">
              <img src={PositiveEmoticon} alt="positive emoticon" />
            </div>
          }
        />
      )}
      {!points || !points.monthlyRecords || !points.monthlyRecords.length ? (
        <EmptyPage
          image={AlienImage}
          title="Points will become available from 1 August."
          subTitle=""
        />
      ) : (
        <>
          {points.monthlyRecords.map((record) => {
            return (
              <Fragment key={record.monthName}>
                <Typography
                  className="mb-3"
                  type="h1"
                  text={record.monthName}
                />
                <AlertCard className="mb-1" item={mapProgressCard(record)} />
                <AlertCard className="mb-1" item={mapCaregiverCard(record)} />
              </Fragment>
            );
          })}
          {!isCoach && !isCelebratoryMessage && (
            <Alert
              type={'info'}
              title={'How can you help your club earn points?'}
              list={[
                'Make sure you create progress reports for all children in your class & meet with caregivers.',
                'Encourage all club members to create progress reports & discuss them with caregivers in June & November.',
              ]}
              className="mt-4 mb-4"
              button={submitButton}
            />
          )}
        </>
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
      {isLogCaregiverMeeting && (
        <CaregiverMeeting
          isToShowWellDoneMessage={isToShowWellDoneMessage}
          onClose={() => setIsLogCaregiverMeeting(false)}
        />
      )}
    </BannerWrapper>
  );
};
