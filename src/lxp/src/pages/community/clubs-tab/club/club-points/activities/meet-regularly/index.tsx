import {
  BannerWrapper,
  Button,
  ScoreCard,
  StackedList,
  StackedListType,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { isCurrentPointsAtLeast80PercentOfTotal } from '../../../individual-club-view';
import { ClubsRouteState } from '../../../../index.types';
import ROUTES from '@/routes/routes';
import partnershipIcon from '@/assets/icon/partnership.svg';
import { Header } from '../0-components/header';
import { formatStringWithFirstLetterCapitalized } from '@ecdlink/core';
import { userSelectors } from '@/store/user';
import { Roles } from '@/constants/roles';

export const MeetRegularly: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const user = useSelector(userSelectors.getUser);
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));

  const history = useHistory();

  const activityId = 'meet-regularly';
  const isPractitioner = user?.roles?.some(
    (item) => item?.name === Roles.PRACTITIONER
  );

  const mockedPoints = 210;

  const mockedUpcomingMeetings: UserAlertListDataItem[] = [
    {
      title: 'August',
      alertSeverity: 'none',
      alertSeverityNoneIcon: 'CalendarIcon',
      alertSeverityNoneColor: 'primary',
      subTitle: 'Scheduled: 14 August 2022',
      avatarColor: '',
      hideAvatar: true,
      onActionClick: () =>
        history.push(
          ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.MEETING_DETAILS.replace(
            ':clubId',
            clubId
          )
        ),
    },
  ];

  const mockedPastMeetings: UserAlertListDataItem[] = (
    [
      {
        title: 'July',
        subItem: '+ 50',
        alertSeverity: 'error',
        subTitle: '50% attendance',
      },
      {
        title: 'June',
        subItem: '+ 60',
        alertSeverity: 'warning',
        subTitle: '60% attendance',
      },
      {
        title: 'May',
        subItem: '+ 100',
        alertSeverity: 'success',
        subTitle: '100% attendance',
      },
      {
        title: 'April',
        subItem: '+ 0',
        alertSeverity: 'error',
        subTitle: 'No register submitted',
      },
    ] as UserAlertListDataItem[]
  ).map((item) => ({
    ...item,
    alertSeverity: item.alertSeverity,
    titleStyle: 'text-textDark',
    avatarColor: '',
    hideAvatar: true,
    onActionClick: () =>
      history.push(
        ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.MEETING_DETAILS.replace(
          ':clubId',
          clubId
        )
      ),
  }));

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={formatStringWithFirstLetterCapitalized(activityId)}
      subTitle={club?.name ?? ''}
      onBack={() => history.goBack()}
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
        imageUrl={partnershipIcon}
        title={formatStringWithFirstLetterCapitalized(activityId)}
        // TODO: change to activity date
        date={new Date()}
      />
      <ScoreCard
        className="mt-5"
        mainText={String(mockedPoints)}
        hint="points"
        currentPoints={mockedPoints}
        maxPoints={800}
        barBgColour="uiLight"
        barColour={
          isCurrentPointsAtLeast80PercentOfTotal(
            club?.totalClubPoints || 0,
            club?.maxClubPoints || 0
          )
            ? 'successMain'
            : 'secondary'
        }
        bgColour="uiBg"
        textColour="black"
      />
      <div className="mt-7">
        <Typography className="mb-5" type="h3" text="Upcoming meetings:" />
        <StackedList
          className="flex flex-col gap-2"
          type={'UserAlertList' as StackedListType}
          listItems={mockedUpcomingMeetings}
        />
      </div>
      <div className="mt-7 mb-5">
        <Typography className="mb-5" type="h3" text="Past meetings:" />
        <StackedList
          className="flex flex-col gap-2"
          type={'UserAlertList' as StackedListType}
          listItems={mockedPastMeetings}
        />
      </div>
      <Button
        className="mt-auto"
        icon="ArrowCircleLeftIcon"
        type="outlined"
        textColor="primary"
        color="primary"
        text="Back to club"
        onClick={() =>
          history.push(
            isPractitioner
              ? ROUTES.PRACTITIONER.COMMUNITY.ROOT
              : ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId)
          )
        }
      />
    </BannerWrapper>
  );
};
