import {
  Alert,
  AlertType,
  BannerWrapper,
  Button,
  Colours,
  EmptyPage,
  ScoreCard,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubActions, clubSelectors } from '@/store/club';
import { ClubsRouteState } from '../../../../index.types';
import ROUTES from '@/routes/routes';
import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { AlertCard, Item } from '../0-components/alert-card';
import { Header } from '../0-components/header';
import {
  formatStringWithFirstLetterCapitalized,
  useSnackbar,
} from '@ecdlink/core';
import { userSelectors } from '@/store/user';
import { Fragment, useCallback, useEffect } from 'react';
import { useAppDispatch } from '@/store';
import {
  ClubActions,
  getActivityChildProgressDetails,
  addCaregiverReportBackMeeting,
} from '@/store/club/club.actions';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { UserTypeEnum } from '@/models/auth/user/UserContext';
import { ActivityChildProgressDetailDto } from '@/models/club/club.dto';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';

export const CompleteChildProgressReports: React.FC = () => {
  const appDispatch = useAppDispatch();
  const { showMessage } = useSnackbar();

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
  }, [appDispatch, clubId, isOnline]);

  const history = useHistory();

  const activityId = 'complete-child-progress-reports';

  const onSubmitCaregiverReportBack = useCallback(() => {
    const input = { clubId: clubId, userId: user?.id! };

    appDispatch(clubActions.addCaregiverReportBackMeeting(input));

    if (isOnline) {
      appDispatch(addCaregiverReportBackMeeting(input));

      showMessage({
        message: `Submitted`,
        type: 'success',
      });
    } else {
      showMessage({
        message: `Saved, remember to sync changes next time you are online`,
        type: 'success',
      });
    }
  }, [appDispatch, clubId, user, isOnline]);

  const month = new Date().getMonth();
  const submitButton =
    !isCoach &&
    !hasLoggedCaregiverMeeting &&
    ((month >= 3 && month <= 7) || month >= 10) ? (
      <Button
        icon="PlusCircleIcon"
        type="filled"
        textColor="white"
        color="primary"
        text="Log caregiver meeting"
        onClick={onSubmitCaregiverReportBack}
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
            ':activityId',
            activityId
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
        currentPoints={points?.points || 0}
        maxPoints={200}
        barBgColour="uiLight"
        barColour={(points?.pointsColor as Colours) || 'errorMain'}
        bgColour="uiBg"
        textColour="black"
      />
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
          {!isCoach && (
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
    </BannerWrapper>
  );
};
