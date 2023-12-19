import {
  Button,
  LoadingSpinner,
  PointsDetailsCard,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { clubSelectors } from '@/store/club';
import { ClubActions, getLeagueForUser } from '@/store/club/club.actions';
import { userSelectors } from '@/store/user';
import { useAppDispatch } from '@/store';
import React, { useEffect, useState } from 'react';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';

export const PractitionerLeagueView: React.FC = () => {
  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_LEAGUE_FOR_USER
  );

  const user = useSelector(userSelectors.getUser);
  const userClub = useSelector(clubSelectors.getClubForPractitionerSelector);
  const league = useSelector(clubSelectors.getLeagueForPractitionerSelector);

  const userLeaguePosition =
    league?.clubs.findIndex((x) => x.clubId === userClub?.id) || 0;

  const [showAbove, setShowAbove] = useState<number>(1);
  const [showBelow, setShowBelow] = useState<number>(1);

  // Reload league data
  useEffect(() => {
    if (!!user && !!user.id) {
      appDispatch(getLeagueForUser({ userId: user.id }));
    }
  }, [user]);

  const userClubBottom = userLeaguePosition === (league?.clubs.length || 0) - 1;

  // Set up which clubs to show
  useEffect(() => {
    if (!!league?.clubs.length && league?.clubs.length <= 15) {
      setShowAbove(userLeaguePosition);
      setShowBelow(league?.clubs.length - userLeaguePosition - 1);
    }

    if (userLeaguePosition === 0) {
      setShowAbove(0);
      setShowBelow(4);
    }

    if (userLeaguePosition <= 5) {
      setShowAbove(userLeaguePosition);
      setShowBelow(4 - userLeaguePosition);
    }

    if (userClubBottom) {
      setShowAbove(2);
    }
  }, [userLeaguePosition, userClubBottom, league]);

  return (
    <div className="flex flex-col p-4 pt-6">
      {isLoading ? (
        <LoadingSpinner
          className="mt-4"
          size="medium"
          spinnerColor="primary"
          backgroundColor="uiLight"
        />
      ) : (
        <>
          <Typography
            type="h2"
            text={`${league?.name} leaderboard`}
            className="mb-6"
          />

          {!!league && !!league.clubs.length && (
            <div>
              {/* Show top club if not already included */}
              {!!league && userLeaguePosition - showAbove > 0 && (
                <PointsDetailsCard
                  pointsEarned={league?.clubs[0].pointsTotal}
                  activityCount={league?.clubs[0].leagueRank}
                  title={league?.clubs[0].clubName}
                  size="medium"
                  className={'mb-1'}
                  colour={'successBg'}
                  badgeTextColour={'white'}
                  badgeImage={
                    <Badge
                      className="absolute z-0 h-full w-full"
                      fill={'var(--successMain)'}
                    />
                  }
                />
              )}
              {/* Show select more if we are not already at the top */}
              {!!league && userLeaguePosition - showAbove > 0 && (
                <Button
                  shape="normal"
                  color="primary"
                  type="outlined"
                  icon="ArrowUpIcon"
                  onClick={() => setShowAbove(showAbove + 5)}
                  className={'mt-3 mb-4 w-full rounded-2xl'}
                >
                  <Typography type="h6" color="primary" text="Show more" />
                </Button>
              )}

              {/* Show main group around users club */}
              {league.clubs
                .slice(
                  Math.max(userLeaguePosition - showAbove, 0),
                  userLeaguePosition + showBelow + 1
                )
                .map((club) => (
                  <div key={club.clubId}>
                    <PointsDetailsCard
                      pointsEarned={club.pointsTotal}
                      activityCount={club.leagueRank}
                      title={club.clubName}
                      size="medium"
                      className={
                        club.clubId === userClub?.id ? 'mb-3 mt-2' : 'mb-1'
                      }
                      textColour={
                        club.clubId === userClub?.id ? 'white' : 'textMid'
                      }
                      colour={
                        club.clubId === userClub?.id
                          ? 'successMain'
                          : club.leagueRank <= 3
                          ? 'successBg'
                          : 'uiBg'
                      }
                      badgeTextColour={
                        club.clubId === userClub?.id ? 'successMain' : 'white'
                      }
                      badgeImage={
                        <Badge
                          className="absolute z-0 h-full w-full"
                          fill={
                            club.clubId === userClub?.id
                              ? '#FFFFFF'
                              : club.leagueRank <= 3
                              ? 'var(--successMain)'
                              : 'var(--primary)'
                          }
                        />
                      }
                    />
                  </div>
                ))}
              {/* Show select more button if we are not already at the bottom */}
              {!!league &&
                userLeaguePosition + showBelow < league.clubs.length - 1 && (
                  <Button
                    shape="normal"
                    color="primary"
                    type="outlined"
                    icon="ArrowDownIcon"
                    onClick={() => setShowBelow(showBelow + 5)}
                    className={'mt-3 mb-4 w-full rounded-2xl'}
                  >
                    <Typography type="h6" color="primary" text="Show more" />
                  </Button>
                )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
