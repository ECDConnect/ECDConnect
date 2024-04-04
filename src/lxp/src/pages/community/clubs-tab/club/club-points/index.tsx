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
import ROUTES from '@/routes/routes';
import { LeagueType, ClubActivities } from '@/constants/club';
import { isCurrentPointsAtLeast80PercentOfTotal } from '../individual-club-view';

export const ClubPoints: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));

  const isPurpleLeague = club?.league?.leagueTypeName === LeagueType.Purple;

  const history = useHistory();

  const activities: MenuListDataItem[] = [
    {
      title: ClubActivities.MeetRegularly,
      menuIconUrl: partnershipIcon,
      subItem: String(
        club?.clubActivities?.find(
          (item) => item?.name === ClubActivities.MeetRegularly
        )?.points ?? 0
      ),
      route: ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.ROOT.replace(
        ':clubId',
        clubId
      ),
    },
    ...(!isPurpleLeague
      ? [
          {
            title: ClubActivities.BeCreative,
            menuIconUrl: paintPaletteIcon,
            subItem: String(
              club?.clubActivities?.find(
                (item) => item?.name === ClubActivities.BeCreative
              )?.points ?? 0
            ),
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
            title: ClubActivities.CaptureChildAttendance,
            menuIcon: 'ClipboardCheckIcon',
            subItem: String(
              club?.clubActivities?.find(
                (item) => item?.name === ClubActivities.CaptureChildAttendance
              )?.points ?? 0
            ),
            route:
              ROUTES.COMMUNITY.CLUB.POINTS.CAPTURE_CHILD_ATTENDANCE.replace(
                ':clubId',
                clubId
              ),
          },
        ]
      : []),
    {
      title: ClubActivities.HostFamilyDays,
      menuIconUrl: familyIcon,
      subItem: String(
        club?.clubActivities?.find(
          (item) => item?.name === ClubActivities.HostFamilyDays
        )?.points ?? 0
      ),
      route: ROUTES.COMMUNITY.CLUB.POINTS.HOST_FAMILY_EVENT.replace(
        ':clubId',
        clubId
      ),
    },
    ...(isPurpleLeague
      ? [
          {
            title: ClubActivities.CompleteChildProgressReports,
            menuIcon: 'DocumentReportIcon',
            subItem: String(
              club?.clubActivities?.find(
                (item) =>
                  item?.name === ClubActivities.CompleteChildProgressReports
              )?.points ?? 0
            ),
            route:
              ROUTES.COMMUNITY.CLUB.POINTS.COMPLETE_CHILD_PROGRESS_REPORTS.replace(
                ':clubId',
                clubId
              ),
          },
        ]
      : []),
    {
      title: ClubActivities.LeaveNoOneBehind,
      menuIconUrl: inclusiveIcon,
      subItem: String(
        club?.clubActivities?.find(
          (item) => item?.name === ClubActivities.LeaveNoOneBehind
        )?.points ?? 0
      ),
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
    iconColor: 'white',
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
        className="mt-5"
        mainText={String(club?.pointsTotal || 0)}
        hint="points"
        currentPoints={club?.pointsTotal ?? 80} // EC-1400: if the club has earned 0 points, show red bar (8px width only)
        maxPoints={club?.maxPointsTotal ?? 0}
        barBgColour="uiLight"
        barColour={
          isCurrentPointsAtLeast80PercentOfTotal(
            club?.pointsTotal || 0,
            club?.maxPointsTotal || 0
          )
            ? 'successMain'
            : 'alertMain'
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
