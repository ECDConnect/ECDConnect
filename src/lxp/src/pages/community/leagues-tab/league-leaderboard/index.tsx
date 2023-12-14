import { Tag } from '@/components/tag';
import ROUTES from '@/routes/routes';
import {
  Alert,
  BannerWrapper,
  PointsDetailsCard,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { LeagueRouteState } from '../index.types';
import { useSelector } from 'react-redux';
import { CommunityRouteState } from '../../community.types';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { clubSelectors } from '@/store/club';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';

export const LeagueLeaderBoard: React.FC = () => {
  const history = useHistory();
  const { leagueId } = useParams<LeagueRouteState>();
  const { isOnline } = useOnlineStatus();

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_LEAGUES_FOR_COACH
  );

  const league = useSelector(clubSelectors.getLeagueForCoachSelector(leagueId));

  return (
    <BannerWrapper
      isLoading={isLoading}
      displayOffline={!isOnline}
      showBackground={false}
      className="flex flex-col p-4 pt-6 "
      size="small"
      title={`${!league ? '' : league?.name} league`}
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
      {!!league ? (
        <>
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
        </>
      ) : (
        <Alert type="info" title="League data not found" />
      )}
    </BannerWrapper>
  );
};
