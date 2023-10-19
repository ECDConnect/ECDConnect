import { Tag } from '@/components/tag';
import ROUTES from '@/routes/routes';
import { BannerWrapper, PointsDetailsCard, Typography } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { LeagueRouteState } from '../index.types';
import { mockedLeagues } from '..';
import { useSelector } from 'react-redux';
import { getAllClubsForCoachSelector } from '@/store/club/club.selectors';
import { CommunityRouteState } from '../../community.types';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';

export const LeagueLeaderBoard: React.FC = () => {
  const history = useHistory();
  const { leagueId } = useParams<LeagueRouteState>();

  const league = mockedLeagues.find((league) => league.id === leagueId);

  // TODO: filter clubs by league id
  const clubs = useSelector(getAllClubsForCoachSelector);

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6 "
      size="small"
      title={`${league?.name} league`}
      onBack={() =>
        history.push(ROUTES.COMMUNITY.ROOT, {
          activeTabIndex: 1,
        } as CommunityRouteState)
      }
      displayHelp
      onHelp={() =>
        history.push(
          ROUTES.COMMUNITY.LEAGUE.HELP.replace(':leagueId', leagueId).replace(
            ':activityId',
            'leagues'
          )
        )
      }
    >
      <Typography type="h2" text={`${league?.name} leaderboard`} />
      <div className="mt-3 mb-5 flex gap-2">
        <Tag
          title={String(clubs?.length ?? 0)}
          subTitle="clubs"
          color="successMain"
        />
        <Tag title={league?.type ?? ''} color="infoMain" />
      </div>
      {clubs?.map((club, index) => (
        <PointsDetailsCard
          pointsEarned={800 - index} // TODO - replace with actual value once available
          activityCount={index + 1} // TODO - replace with actual value once available
          title={club?.name ?? ''}
          description={`Coach: ${club?.coach?.user?.firstName ?? ''} ${
            club?.coach?.user?.surname ?? ''
          }`}
          size="medium"
          className="mb-1"
          colour={index < 3 ? 'successBg' : 'uiBg'}
          badgeImage={
            <Badge
              className="absolute z-0 h-full w-full"
              fill={index < 3 ? 'var(--successMain)' : 'var(--primary)'}
            />
          }
        />
      ))}
    </BannerWrapper>
  );
};
