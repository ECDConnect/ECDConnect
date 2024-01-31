import {
  Alert,
  BannerWrapper,
  Button,
  EmptyPage,
  ScoreCard,
} from '@ecdlink/ui';
import { useHistory, useLocation, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { ClubsRouteState } from '../../../../index.types';
import ROUTES from '@/routes/routes';
import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { AlertCard, Item } from '../0-components/alert-card';
import { Header } from '../0-components/header';
import paintPaletteIcon from '@/assets/icon/paint-palette.svg';
import {
  formatStringWithFirstLetterCapitalized,
  useSnackbar,
} from '@ecdlink/core';
import { BeCreativeRouteState } from './index.types';
import { userSelectors } from '@/store/user';
import { useAppDispatch } from '@/store';
import { useEffect, useState } from 'react';
import {
  ClubActions,
  getActivityBeCreativeDetails,
} from '@/store/club/club.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { getScoreBarColor } from '@/pages/community/clubs-tab/index.filters';
import { getAlertType } from '../0-components/alert-card/utils';
import { ActivityBeCreativeDetail } from '@ecdlink/graphql';
import { UserTypeEnum } from '@/models/auth/user/UserContext';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ClubActivitiesPointsPerLeague } from '@/constants/club';
import { ReactComponent as PositiveEmoticon } from '@/assets/positive-green-emoticon.svg';

export const BeCreative: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);

  const { clubId } = useParams<ClubsRouteState>();

  const user = useSelector(userSelectors.getUser);
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const details = useSelector(
    clubSelectors.getActivityBeCreativeDetailsSelector(clubId)
  );

  const descendingMonthlyRecords = [
    ...(details?.monthlyRecords || []),
  ]?.reverse();

  const history = useHistory();

  const location = useLocation<BeCreativeRouteState>();

  const appDispatch = useAppDispatch();
  const { showMessage } = useSnackbar();

  const { isOnline } = useOnlineStatus();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentMonthName = currentDate.toLocaleString('default', {
    month: 'long',
  });

  const pointsConfig = ClubActivitiesPointsPerLeague.BeCreative.All;

  const hasRecordInCurrentMonth = details?.monthlyRecords?.some(
    (record) =>
      record?.monthName?.toLowerCase() === currentMonthName.toLowerCase() &&
      !!record?.documentName
  );

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ACTIVITY_BE_CREATIVE_DETAILS
  );

  const isCoach = user?.roles?.some(
    (item) => item?.name === UserTypeEnum.Coach
  );

  const isLeader = club?.clubLeader?.userId === user?.id;
  const isSupportRole = club?.clubSupport?.userId === user?.id;

  const isLeagueStarts = currentMonth >= 3;
  const isClubInALeague = !!club?.league;
  const isFromAddCollageEvent = location?.state?.isFromAddCollageEvent;
  const isToShowAddImageEventButton =
    (isFromAddCollageEvent || isLeader || isSupportRole) &&
    !hasRecordInCurrentMonth;

  const isToShowPoints = isLeagueStarts && isClubInALeague;
  const isCelebratoryMessage = details?.points === pointsConfig.max;
  const isInfoMessage =
    !details?.monthlyRecords?.some(
      (record) => record?.monthName?.toLocaleLowerCase() === 'november'
    ) &&
    isToShowPoints &&
    !isLeader &&
    !isCoach;
  const isToShowInfoCard =
    isToShowAddImageEventButton &&
    !details?.monthlyRecords?.some(
      (record) =>
        getAlertType(record?.documentStatusColor ?? '') === 'info' ||
        getAlertType(record?.documentStatusColor ?? '') === 'success'
    );

  const activityId = 'be-creative';

  const formatMonthlyRecord = (record: ActivityBeCreativeDetail): Item => ({
    title: record.monthName ?? '',
    description: record.description ?? '',
    rightChip: isToShowPoints ? `+ ${record.points}` : '',
    alert: {
      title: record.documentStatus ?? '',
      type: getAlertType(record.documentStatusColor ?? ''),
    },
  });

  useEffect(() => {
    if (
      wasLoading &&
      !isLoading &&
      isFromAddCollageEvent &&
      hasRecordInCurrentMonth &&
      !showAlert
    ) {
      setShowAlert(true);
      showMessage({
        message: 'You have already added an image this month.',
        type: 'error',
      });
    }
  }, [
    isLoading,
    hasRecordInCurrentMonth,
    showMessage,
    isFromAddCollageEvent,
    showAlert,
    wasLoading,
  ]);

  useEffect(() => {
    if (isOnline) {
      appDispatch(
        getActivityBeCreativeDetails({
          clubId,
        })
      );
    }
  }, [appDispatch, clubId, isOnline]);

  useEffect(() => {
    if (wasLoading && !isLoading && isRejected) {
      showMessage(error);
    }
  }, [error, isRejected, showMessage, isLoading, wasLoading]);

  return (
    <BannerWrapper
      isLoading={isLoading}
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={formatStringWithFirstLetterCapitalized(activityId)}
      subTitle={club?.name ?? ''}
      onBack={() =>
        isFromAddCollageEvent
          ? history.push(ROUTES.PRACTITIONER.COMMUNITY.ROOT)
          : history.goBack()
      }
      displayHelp={isToShowPoints}
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
        imageUrl={paintPaletteIcon}
        title={formatStringWithFirstLetterCapitalized(activityId)}
      />
      {isToShowPoints && (
        <ScoreCard
          className="mt-5"
          mainText={String(details?.points ?? 0)}
          hint="points"
          currentPoints={details?.points || 18}
          maxPoints={pointsConfig.max}
          barBgColour="uiLight"
          barColour={getScoreBarColor(
            details?.points ?? 0,
            pointsConfig.green,
            pointsConfig.amber
          )}
          bgColour="uiBg"
          textColour="black"
        />
      )}
      {isCelebratoryMessage && !isCoach && (
        <Alert
          className="mt-4"
          type="successLight"
          title="Wow, great job!"
          customIcon={<PositiveEmoticon className="w-12" />}
        />
      )}
      {descendingMonthlyRecords?.length ? (
        <div className="mt-5">
          {descendingMonthlyRecords.map((item) => (
            <AlertCard
              key={item?.monthName}
              item={formatMonthlyRecord(item!)}
            />
          ))}
          {isToShowInfoCard && (
            <Alert
              className="my-5"
              title="How can you help your club earn points?"
              list={['Add a “Be creative” image every month.']}
              type="info"
            />
          )}
          {isInfoMessage && (
            <Alert
              className="my-4"
              type="info"
              title="How can you help your club earn points?"
              list={[
                'Ask your club leader to organise a meeting to work on a creative project.',
              ]}
              button={
                <Button
                  text="Contact your club leader"
                  type="filled"
                  color="primary"
                  textColor="white"
                  icon="ChatIcon"
                  onClick={() =>
                    history.push(
                      ROUTES.COMMUNITY.CLUB.USER_PROFILE.LEADER.replace(
                        ':clubId',
                        clubId
                      ).replace(
                        ':leaderId',
                        club?.clubLeader?.practitionerId ?? ''
                      )
                    )
                  }
                />
              }
            />
          )}
        </div>
      ) : (
        <EmptyPage
          image={AlienImage}
          title="This club has not submitted any be creative items yet this year!"
          subTitle=""
        />
      )}
      {isToShowAddImageEventButton && (
        <Button
          className="mt-auto mb-4"
          icon="PlusCircleIcon"
          type="filled"
          textColor="white"
          color="primary"
          text={`Add image for ${currentMonthName}`}
          onClick={() =>
            history.push(
              ROUTES.PRACTITIONER.COMMUNITY.CLUB.COLLAGE_EVENT.ADD_EVENT
            )
          }
        />
      )}
      <Button
        className={
          isFromAddCollageEvent || isToShowAddImageEventButton ? '' : 'mt-auto'
        }
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
