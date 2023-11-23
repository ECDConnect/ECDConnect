import {
  BannerWrapper,
  Button,
  Divider,
  EmptyPage,
  ScoreCard,
} from '@ecdlink/ui';
import { useHistory, useLocation, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubSelectors, clubThunkActions } from '@/store/club';
import { ClubsRouteState } from '../../../../index.types';
import ROUTES from '@/routes/routes';
import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { AlertCard, Item } from '../0-components/alert-card';
import { Header } from '../0-components/header';
import familyIcon from '@/assets/icon/family.svg';
import { formatStringWithFirstLetterCapitalized } from '@ecdlink/core';
import { HostFamilyDaysRouteState } from './index.types';
import { userSelectors } from '@/store/user';
import { getScoreBarColor } from '@/pages/community/clubs-tab/index.filters';
import { ClubActivitiesPointsPerLeague, LeagueType } from '@/constants/club';
import { useEffect, useMemo } from 'react';
import { useAppDispatch } from '@/store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ActivityHostFamilyDaysDetail } from '@ecdlink/graphql';
import { getAlertType } from '../0-components/alert-card/utils';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';
import { UserTypeEnum } from '@/models/auth/user/UserContext';

export const HostFamilyDays: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const user = useSelector(userSelectors.getUser);
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const details = useSelector(
    clubSelectors.getActivityHostFamilyDetailsSelector(clubId)
  );

  const history = useHistory();
  const location = useLocation<HostFamilyDaysRouteState>();

  const appDispatch = useAppDispatch();

  const { isOnline } = useOnlineStatus();

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ACTIVITY_HOST_FAMILY_DETAILS
  );

  const isClubInNewStarts =
    club?.league?.leagueTypeName === LeagueType.NewStars;
  const isClubInRisingStars =
    club?.league?.leagueTypeName === LeagueType.RisingStars;

  const isFromAddFamilyDayEvent = location?.state?.isFromAddFamilyDayEvent;
  const isCoach = user?.roles?.some(
    (item) => item?.name === UserTypeEnum.Coach
  );

  const isLeader = club?.clubLeader?.userId === user?.id;
  const isSupportRole = club?.clubSupport?.userId === user?.id;

  const isToShowFamilyDayEventButton =
    isFromAddFamilyDayEvent || isLeader || isSupportRole;

  const activityId = 'host-family-days';

  const pointsConfig = useMemo(() => {
    if (isClubInNewStarts) {
      return ClubActivitiesPointsPerLeague.HostFamilyDays.NewStars;
    }

    if (isClubInRisingStars) {
      return ClubActivitiesPointsPerLeague.HostFamilyDays.RisingStars;
    }

    // TODO: handle other use cases (purple league for example)
    return { max: 0, green: 0, amber: 0, red: 0 };
  }, [isClubInNewStarts, isClubInRisingStars]);

  const formatTerm = (term: ActivityHostFamilyDaysDetail): Item => ({
    title: term.termName ?? '',
    subTitle: term.eventName ?? '',
    ...(term?.description
      ? {
          descriptionLabel: 'Description',
          description: term.description ?? '',
        }
      : {}),
    rightChip: `+ ${term.points}`,
    alert: {
      title: term.documentStatus ?? '',
      type: getAlertType(term.documentStatusColor ?? ''),
    },
  });

  useEffect(() => {
    if (isOnline) {
      appDispatch(clubThunkActions.getActivityHostFamilyDetails({ clubId }));
    }
  }, [appDispatch, clubId, isOnline]);

  return (
    <BannerWrapper
      isLoading={isLoading}
      displayOffline={!isOnline}
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={formatStringWithFirstLetterCapitalized(activityId)}
      subTitle={club?.name ?? ''}
      onBack={() =>
        isFromAddFamilyDayEvent
          ? history.push(ROUTES.PRACTITIONER.COMMUNITY.ROOT)
          : history.goBack()
      }
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
        imageUrl={familyIcon}
        title={formatStringWithFirstLetterCapitalized(activityId)}
      />
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
      {!!details?.terms?.length ? (
        <div className="mt-5">
          {details?.terms?.map((item, index) => (
            <>
              {index !== 0 && <Divider dividerType="dashed" className="mb-4" />}
              <AlertCard item={formatTerm(item!)} />
            </>
          ))}
        </div>
      ) : (
        <EmptyPage
          image={AlienImage}
          title="This club has not submitted any family days yet this year!"
          subTitle=""
        />
      )}
      {isToShowFamilyDayEventButton && (
        <Button
          className="mt-auto mb-4"
          icon="PlusCircleIcon"
          type="filled"
          textColor="white"
          color="primary"
          text="Add an event"
          onClick={() =>
            history.push(
              ROUTES.PRACTITIONER.COMMUNITY.CLUB.FAMILY_DAY_EVENT.ADD_EVENT
            )
          }
        />
      )}
      <Button
        className={isToShowFamilyDayEventButton ? '' : 'mt-auto'}
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
