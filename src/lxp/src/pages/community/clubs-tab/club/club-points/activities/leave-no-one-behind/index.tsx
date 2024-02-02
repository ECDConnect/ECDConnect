import {
  Alert,
  BannerWrapper,
  Button,
  Colours,
  Divider,
  EmptyPage,
  ScoreCard,
  StackedList,
  StackedListType,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubSelectors, clubThunkActions } from '@/store/club';
import { ClubsRouteState } from '../../../../index.types';
import ROUTES from '@/routes/routes';
import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { Header } from '../0-components/header';
import inclusiveIcon from '@/assets/icon/inclusive.svg';
import { formatStringWithFirstLetterCapitalized } from '@ecdlink/core';
import { userSelectors } from '@/store/user';
import { getScoreBarColor } from '@/pages/community/clubs-tab/index.filters';
import { useCallback, useEffect, useMemo } from 'react';
import { ClubActivitiesPointsPerLeague, LeagueType } from '@/constants/club';
import { UserTypeEnum } from '@/models/auth/user/UserContext';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';
import { ClubUser } from '@ecdlink/graphql';
import { AlertCard } from '../0-components/alert-card';
import { ReactComponent as PositiveEmoticon } from '@/assets/positive-green-emoticon.svg';
import { PractitionerProfileRouteState } from '@/pages/practitioner/practitioner-profile/practitioner-profile.types';

export const LeaveNoOneBehind: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const user = useSelector(userSelectors.getUser);
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const details = useSelector(
    clubSelectors.getActivityLeaveNoOneBehindDetailsSelector(clubId)
  );

  const history = useHistory();

  const appDispatch = useAppDispatch();

  const { isOnline } = useOnlineStatus();

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ACTIVITY_LEAVE_NO_ONE_BEHIND_DETAILS
  );

  const isCoach = user?.roles?.some(
    (item) => item?.name === UserTypeEnum.Coach
  );

  const isPurpleLeague = club?.league?.leagueTypeName === LeagueType.Purple;

  const activityId = 'leave-no-one-behind';

  const pointsConfig = ClubActivitiesPointsPerLeague.LeaveNoOneBehind.All;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  const isDecember = currentMonth === 11;
  const isLeagueStarts = currentMonth >= 3;

  const isClubInALeague = !!club?.league;
  const isToShowPoints = isLeagueStarts && isClubInALeague;

  const mapMembers = useCallback(
    (members: ClubUser[]): UserAlertListDataItem[] =>
      members?.map((member) => {
        const currentClubMember = club?.clubMembers.find(
          (clubMember) => clubMember.userId === member.userId
        );
        return {
          title: `${member.firstName || ''} ${member.surname || ''}`,
          profileText: `${member?.firstName?.charAt(
            0
          )}${member?.surname?.charAt(0)}`,
          titleStyle: 'text-textDark',
          avatarColor: 'var(--primaryAccent2)',
          alertSeverity: 'none',
          subTitle: currentClubMember?.welcomeMessage || '',
          subTitleStyle: 'text-infoDark',
          profileDataUrl: member.profileImageUrl || '',
          hideAlertSeverity: true,
          onActionClick: () =>
            history.push(
              ROUTES.COMMUNITY.CLUB.USER_PROFILE.MEMBER.replace(
                ':clubId',
                clubId
              ).replace(
                ':practitionerId',
                currentClubMember?.practitionerId ?? ''
              )
            ),
        };
      }),
    [club?.clubMembers, clubId, history]
  );

  const membersWithGreenPqa = details?.greenUsers;
  const membersWithOrangePqa = details?.orangeUsers;
  const membersWithRedPqa = details?.redUsers;
  const membersWithPqaComingUp = details?.blueUsers;

  const getMembers = useCallback(
    (item: string) => {
      let members = undefined;
      let color: Colours = 'textDark';

      switch (item) {
        case 'green':
          members = membersWithGreenPqa;
          color = 'successDark';
          break;
        case 'orange':
          members = membersWithOrangePqa;
          color = 'alertDark';
          break;
        case 'red':
          members = membersWithRedPqa;
          color = 'errorDark';
          break;
        default:
          members = membersWithPqaComingUp;
          break;
      }

      return {
        members: members ? mapMembers(members as ClubUser[]) : undefined,
        color,
      };
    },
    [
      mapMembers,
      membersWithGreenPqa,
      membersWithOrangePqa,
      membersWithPqaComingUp,
      membersWithRedPqa,
    ]
  );

  const hasItems =
    !!membersWithGreenPqa?.length ||
    !!membersWithOrangePqa?.length ||
    (!!membersWithPqaComingUp?.length && !isDecember) ||
    !!membersWithRedPqa?.length;

  const renderContent = useMemo(() => {
    if (!hasItems) {
      return (
        <EmptyPage
          image={AlienImage}
          title={`No SmartStarters in this club have a ${
            isCoach ? 'First PQA/re-accreditation' : 're-accreditation'
          }  visit deadline this year`}
          subTitle=""
        />
      );
    }

    if (isCoach) {
      return (
        <div className="mb-5">
          {['green', 'orange', 'red', 'comingUp'].map((item, index) => {
            const { members, color } = getMembers(item);

            if (!members || (members && !members?.length)) return <></>;

            return (
              <>
                {index !== 0 && (
                  <Divider dividerType="dashed" className="my-4" />
                )}
                <p className="text-18 text-textDark mb-3 font-semibold">
                  SmartStarters with{' '}
                  {item.includes('coming') ? (
                    'PQAs/re-accreditations coming up later this year'
                  ) : (
                    <>
                      <span className={`text-${color}`}>{item}</span> PQA
                      re-accreditation
                    </>
                  )}
                  :
                </p>
                <StackedList
                  className="flex flex-col gap-2"
                  isFullHeight={false}
                  type={'UserAlertList' as StackedListType}
                  listItems={members}
                />
              </>
            );
          })}
        </div>
      );
    }

    return (
      <div className="mb-5">
        {!!membersWithGreenPqa?.length && (
          <AlertCard
            className="mb-1"
            item={{
              title: '',
              alert: { title: details?.greenText ?? '', type: 'successLight' },
              leftChip: `${details?.greenPerc}%`,
            }}
          />
        )}
        {!!membersWithOrangePqa?.length && (
          <AlertCard
            className="mb-1"
            item={{
              title: '',
              alert: { title: details?.orangeText ?? '', type: 'warning' },
              leftChip: `${details?.orangePerc}%`,
            }}
          />
        )}
        {!!membersWithRedPqa?.length && (
          <AlertCard
            className="mb-1"
            item={{
              title: '',
              alert: { title: details?.redText ?? '', type: 'error' },
              leftChip: `${details?.redPerc}%`,
            }}
          />
        )}
        {!!membersWithPqaComingUp?.length && !isDecember && (
          <AlertCard
            className="mb-1"
            item={{
              title: '',
              alert: { title: details?.blueText ?? '', type: 'info' },
              leftChip: `${details?.bluePerc}%`,
            }}
          />
        )}
      </div>
    );
  }, [
    isDecember,
    hasItems,
    details,
    getMembers,
    isCoach,
    membersWithGreenPqa?.length,
    membersWithOrangePqa?.length,
    membersWithPqaComingUp?.length,
    membersWithRedPqa?.length,
  ]);

  useEffect(() => {
    if (isOnline) {
      appDispatch(
        clubThunkActions.getActivityLeaveNoOneBehindDetails({ clubId })
      );
    }
  }, [clubId, isOnline]);

  return (
    <BannerWrapper
      displayOffline={!isOnline}
      isLoading={isLoading}
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={formatStringWithFirstLetterCapitalized(activityId)}
      subTitle={club?.name ?? ''}
      onBack={() => history.goBack()}
      displayHelp={isToShowPoints}
      onHelp={() =>
        history.push(
          ROUTES.COMMUNITY.CLUB.POINTS.HELP[
            isPurpleLeague ? 'LEAGUE_TYPE' : 'ROOT'
          ]
            .replace(':clubId', clubId)
            .replace(':activityId', activityId)
            .replace(
              ':leagueType',
              isPurpleLeague ? club?.league?.leagueTypeName?.toLowerCase() : ''
            )
        )
      }
    >
      <Header
        date={new Date()}
        imageUrl={inclusiveIcon}
        title={formatStringWithFirstLetterCapitalized(activityId)}
        className="mb-5"
      />
      {isToShowPoints && hasItems && (
        <ScoreCard
          className="mb-5"
          mainText={String(details?.points ?? 0)}
          hint="points"
          currentPoints={details?.points || 2}
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
      {details?.greenPerc === 100 && (
        <Alert
          type="successLight"
          title="Wow, great job!"
          customIcon={<PositiveEmoticon className="w-12" />}
        />
      )}
      {renderContent}
      {!isCoach && hasItems && isToShowPoints && (
        <Alert
          className="mb-5"
          type="info"
          title="How can you help your club earn points?"
          list={[
            'Run a high-quality programme to get a green PQA.',
            'Encourage your club members and help them to improve!',
            'Complete online training together in your club, and help each other grow!',
          ]}
          button={
            <Button
              icon="MapIcon"
              type="filled"
              color="primary"
              textColor="white"
              text="See journey"
              onClick={() =>
                history.push(ROUTES.PRACTITIONER.PROFILE.ROOT, {
                  tabIndex: 1,
                } as PractitionerProfileRouteState)
              }
            />
          }
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
