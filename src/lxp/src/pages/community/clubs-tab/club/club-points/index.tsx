import {
  BannerWrapper,
  Button,
  MenuListDataItem,
  ScoreCard,
  StackedList,
  StackedListType,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { ClubsRouteState } from '../../index.types';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { format } from 'date-fns';
import familyIcon from '@/assets/icon/family.svg';
import inclusiveIcon from '@/assets/icon/inclusive.svg';
import paintPaletteIcon from '@/assets/icon/paint-palette.svg';
import partnershipIcon from '@/assets/icon/partnership.svg';
import { isCurrentPointsAtLeast80PercentOfTotal } from '../individual-club-view';
import ROUTES from '@/routes/routes';
import { LeagueType } from '@/constants/club';

export const ClubPoints: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));

  const isPurpleLeague = club?.league?.leagueType?.name === LeagueType.Purple;

  const history = useHistory();

  // TODO: replace mockedPoint with actual points
  const mockedPoint = '0';

  const activities: MenuListDataItem[] = [
    {
      title: 'Meet regularly',
      menuIconUrl: partnershipIcon,
      subItem: mockedPoint,
      route: ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.ROOT.replace(
        ':clubId',
        clubId
      ),
    },
    ...(!isPurpleLeague
      ? [
          {
            title: 'Be creative',
            menuIconUrl: paintPaletteIcon,
            subItem: mockedPoint,
            route: ROUTES.COMMUNITY.CLUB.POINTS.BE_CREATIVE.replace(
              ':clubId',
              clubId
            ),
          },
        ]
      : []),
    ...(isPurpleLeague
      ? [
          {
            title: 'Capture child attendance',
            menuIcon: 'ClipboardCheckIcon',
            subItem: mockedPoint,
            route:
              ROUTES.COMMUNITY.CLUB.POINTS.CAPTURE_CHILD_ATTENDANCE.replace(
                ':clubId',
                clubId
              ),
          },
        ]
      : []),
    {
      title: 'Host family days',
      menuIconUrl: familyIcon,
      subItem: mockedPoint,
      route: ROUTES.COMMUNITY.CLUB.POINTS.HOST_FAMILY_EVENT.replace(
        ':clubId',
        clubId
      ),
    },
    ...(isPurpleLeague
      ? [
          {
            title: 'Complete child progress reports',
            menuIcon: 'DocumentReportIcon',
            subItem: mockedPoint,
            route:
              ROUTES.COMMUNITY.CLUB.POINTS.COMPLETE_CHILD_PROGRESS_REPORTS.replace(
                ':clubId',
                clubId
              ),
          },
        ]
      : []),
    {
      title: 'Leave no one behind',
      menuIconUrl: inclusiveIcon,
      subItem: mockedPoint,
      route: ROUTES.COMMUNITY.CLUB.POINTS.LEAVE_NO_ONE_BEHIND.replace(
        ':clubId',
        clubId
      ),
    },
  ].map((item) => ({
    ...item,
    ...(item.menuIconUrl && { menuIconUrl: item.menuIconUrl }),
    ...(item.menuIcon && { menuIcon: item.menuIcon }),
    titleStyle: 'text-textDark whitespace-normal',
    iconBackgroundColor: 'tertiary',
    showIcon: true,
    subItem: item.subItem,
    onActionClick: () => history.push(item.route),
  }));

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6 "
      size="small"
      title="Points"
      subTitle={club?.name ?? ''}
      onBack={() => history.goBack()}
    >
      <Typography type="h2" text={club?.name ?? ''} />
      <Typography
        type="h4"
        color="textMid"
        text={format(new Date(), 'MMMM yyyy')}
      />
      <ScoreCard
        mainText={String(club?.totalClubPoints || 0)}
        hint="points"
        currentPoints={club?.totalClubPoints ?? 0}
        maxPoints={club?.maxClubPoints ?? 0}
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
      <div className="mt-7 mb-5">
        <Typography className="mb-2" type="h3" text="Activities:" />
        <StackedList
          className="flex flex-col gap-2"
          type={'MenuList' as StackedListType}
          listItems={activities}
        />
      </div>
      <Button
        className="mt-auto"
        icon="ArrowCircleLeftIcon"
        type="outlined"
        textColor="primary"
        color="primary"
        text="Back to club"
        onClick={() => history.goBack()}
      />
    </BannerWrapper>
  );
};
