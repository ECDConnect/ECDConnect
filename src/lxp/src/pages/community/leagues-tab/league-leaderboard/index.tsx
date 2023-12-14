import { Tag } from '@/components/tag';
import ROUTES from '@/routes/routes';
import { BannerWrapper, PointsDetailsCard, Typography } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { LeagueRouteState } from '../index.types';
import { useSelector } from 'react-redux';
import { CommunityRouteState } from '../../community.types';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { clubSelectors } from '@/store/club';

export const LeagueLeaderBoard: React.FC = () => {
  const history = useHistory();
  const { leagueId } = useParams<LeagueRouteState>();

  const league = useSelector(clubSelectors.getLeagueForCoachSelector(leagueId));

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
          title={String(league?.clubs?.length ?? 0)}
          subTitle="clubs"
          color="successMain"
        />
        <Tag title={league?.leagueTypeName ?? ''} color="infoMain" />
      </div>
      {league?.clubs.map((club, index) => (
        <div key={club.clubId}>
          <PointsDetailsCard
            pointsEarned={club.pointsTotal}
            activityCount={club.leagueRank}
            title={club.clubName}
            description={club.coachName}
            size="medium"
            className="mb-1"
            colour={club.leagueRank <= 3 ? 'successBg' : 'uiBg'}
            badgeImage={
              <Badge
                className="absolute z-0 h-full w-full"
                fill={index < 3 ? 'var(--successMain)' : 'var(--primary)'}
              />
            }
          />
        </div>
      ))}
    </BannerWrapper>
  );
};
