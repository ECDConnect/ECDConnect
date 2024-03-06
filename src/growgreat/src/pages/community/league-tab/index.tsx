import {
  Alert,
  AlertProps,
  Button,
  LoadingSpinner,
  PointsDetailsCard,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { useAppDispatch } from '@/store';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import {
  CommunityActions,
  getLeagueById,
} from '@/store/community/community.actions';
import { communitySelectors } from '@/store/community';
import { getCommunityQuarterDescription } from '@/utils/community/community-quartes.utils';
import { calculateClinicLeaguePositionPercentiles } from '@/utils/community/league-position';
import { useSnackbar } from '@ecdlink/core';
import { NoCommunityFound } from '../components/no-community-found';

export const LeagueTab: React.FC = () => {
  const [showAbove, setShowAbove] = useState<number>(1);
  const [showBelow, setShowBelow] = useState<number>(1);

  const currentClinic = useSelector(communitySelectors.getClinicSelector);
  const league = useSelector(communitySelectors.getLeagueSelector);

  const appDispatch = useAppDispatch();

  const { showMessage } = useSnackbar();

  const today = new Date();

  const {
    isLoading: isLoadingLeague,
    wasLoading: wasLoadingLeague,
    isRejected: isRejectedLeague,
    error: errorLeague,
  } = useThunkFetchCall('community', CommunityActions.GET_LEAGUE_BY_ID);
  const {
    isLoading: isLoadingClinic,
    wasLoading: wasLoadingClinic,
    isRejected: isRejectedClinic,
    error: errorClinic,
  } = useThunkFetchCall('community', CommunityActions.GET_CLINIC_BY_ID);

  const isLoading = isLoadingLeague || (!currentClinic && isLoadingClinic);
  const wasLoading = wasLoadingLeague || wasLoadingClinic;
  const isRejected = isRejectedLeague || isRejectedClinic;
  const error = errorLeague || errorClinic;

  useEffect(() => {
    if (wasLoading && !isLoading && isRejected) {
      showMessage({
        message: error,
        type: 'error',
      });
    }
  }, [error, isLoading, isRejected, showMessage, wasLoading]);

  const userClinic = league?.clinics.find(
    (clinic) => clinic.clinicId === currentClinic?.id
  );

  // From 1 to 15 October, show the end-of-year league scoreboard instead of the quarterly board.
  const isEndOfTheYear = today.getMonth() === 9 && today.getDate() <= 15;

  const userClinicPosition = isEndOfTheYear
    ? userClinic?.leagueRankingForYear ?? 0
    : userClinic?.leagueRankingForQuarter ?? 0;

  const userClinicBottom =
    userClinicPosition === (league?.clinics.length || 0) - 1;

  const isFirstPlace = userClinicPosition === 1;
  const isSecondPlace = userClinicPosition === 2;
  const isThirdPlace = userClinicPosition === 3;

  const { isTop25PercentInTheLeague, isMiddle50PercentInTheLeague } =
    calculateClinicLeaguePositionPercentiles(
      league?.clinics ?? [],
      userClinicPosition
    );

  const description = isEndOfTheYear
    ? `Oct ${today.getFullYear() - 1} to Sep ${today.getFullYear()}`
    : `Points earned so far in ${getCommunityQuarterDescription(today).replace(
        ': ',
        ' ('
      )})`;

  const alertProps = useMemo((): AlertProps => {
    const message = `You ended the year in position ${userClinicPosition} in the ${league?.name} league.`;
    if (isFirstPlace) {
      return {
        type: 'warning',
        title: `Well done ${currentClinic?.name} team!`,
        message: `You won first place in the ${league?.name} league!`,
        customIcon: <PollyImpressed className="h-14 w-14 self-center" />,
      };
    }

    if (isSecondPlace || isThirdPlace) {
      return {
        type: 'warning',
        title: `Well done ${currentClinic?.name} team!`,
        message: `You ended the year in ${
          isSecondPlace ? 'second' : 'third'
        } place in the ${league?.name} league!`,
        customIcon: <PollyImpressed className="h-14 w-14 self-center" />,
      };
    }

    if (isTop25PercentInTheLeague) {
      return {
        type: 'warning',
        title: `Good job ${currentClinic?.name} team!`,
        message,
        customIcon: <PollyHappy className="h-14 w-14 self-center" />,
      };
    }

    if (isMiddle50PercentInTheLeague) {
      return {
        type: 'warning',
        title: `Not too bad ${currentClinic?.name} team!`,
        message,
        customIcon: <PollyHappy className="h-14 w-14 self-center" />,
      };
    }

    return {
      type: 'warning',
      title: `Keep going, ${currentClinic?.name} team!`,
      message,
      customIcon: <PollyNeutral className="h-14 w-14 self-center" />,
    };
  }, [
    currentClinic?.name,
    isFirstPlace,
    isMiddle50PercentInTheLeague,
    isSecondPlace,
    isThirdPlace,
    isTop25PercentInTheLeague,
    league?.name,
    userClinicPosition,
  ]);

  // Set up which clinics to show
  const handleClinicPosition = useCallback(() => {
    if (!!league?.clinics.length && league?.clinics.length <= 15) {
      setShowAbove(userClinicPosition);
      setShowBelow(league?.clinics.length - userClinicPosition - 1);
    }

    if (userClinicPosition === 0) {
      setShowAbove(0);
      setShowBelow(4);
    }

    if (userClinicPosition <= 5) {
      setShowAbove(userClinicPosition);
      setShowBelow(4 - userClinicPosition);
    }

    if (userClinicBottom) {
      setShowAbove(2);
    }
  }, [league?.clinics.length, userClinicBottom, userClinicPosition]);

  useEffect(() => {
    handleClinicPosition();
  }, [handleClinicPosition]);

  useEffect(() => {
    appDispatch(
      getLeagueById({
        leagueId: currentClinic?.league?.id || '',
        forceReload: true,
      })
    );
  }, [appDispatch, currentClinic?.league?.id]);

  if (isLoading) {
    return (
      <LoadingSpinner
        className="mt-6"
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
      />
    );
  }

  if (!league) {
    return <NoCommunityFound />;
  }

  return (
    <div className="flex flex-col p-4 pt-6">
      <Typography type="h2" text={`${league?.name ?? ''} scoreboard`} />
      <Typography
        type="h4"
        color="textMid"
        text={description}
        className="mb-6"
      />
      {isEndOfTheYear && (
        <Alert
          className="mb-4"
          type="warning"
          title={alertProps.title}
          titleColor="textDark"
          message={alertProps.message}
          messageColor="textMid"
          customIcon={<div>{alertProps.customIcon}</div>}
        />
      )}
      {!!league && !!league.clinics.length && (
        <div>
          {/* Show top clinic if not already included */}
          {!!league && userClinicPosition - showAbove > 0 && (
            <PointsDetailsCard
              pointsEarned={
                isEndOfTheYear
                  ? league?.clinics[0].leagueRankingForYear
                  : league?.clinics[0].leagueRankingForQuarter
              }
              activityCount={
                isEndOfTheYear
                  ? league?.clinics[0].leagueRankingForYear
                  : league?.clinics[0].leagueRankingForQuarter
              }
              title={league?.clinics[0].clinicName}
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
          {!!league && userClinicPosition - showAbove > 0 && (
            <Button
              shape="normal"
              color="primary"
              type="outlined"
              icon="ArrowUpIcon"
              text="See more teams"
              textColor="primary"
              onClick={() => setShowAbove(showAbove + 5)}
              className={'mt-3 mb-4 w-full rounded-2xl'}
            />
          )}

          {/* Show main group around users clinic */}
          {league.clinics
            .slice(
              Math.max(userClinicPosition - showAbove, 0),
              userClinicPosition + showBelow + 1
            )
            .map((clinic) => {
              const leagueRanking = isEndOfTheYear
                ? clinic.leagueRankingForYear
                : clinic.leagueRankingForQuarter;

              return (
                <div key={clinic.clinicId}>
                  <PointsDetailsCard
                    pointsEarned={
                      isEndOfTheYear
                        ? clinic.pointsTotalForYear
                        : clinic.pointsTotalForQuarter
                    }
                    activityCount={leagueRanking}
                    title={clinic.clinicName}
                    size="medium"
                    className={
                      clinic.clinicId === currentClinic?.id
                        ? 'mb-3 mt-2'
                        : 'mb-1'
                    }
                    textColour={
                      clinic.clinicId === currentClinic?.id
                        ? 'white'
                        : 'textMid'
                    }
                    colour={
                      clinic.clinicId === currentClinic?.id
                        ? 'successMain'
                        : leagueRanking <= 3
                        ? 'successBg'
                        : 'uiBg'
                    }
                    badgeTextColour={
                      clinic.clinicId === currentClinic?.id
                        ? 'successMain'
                        : 'white'
                    }
                    badgeImage={
                      <Badge
                        className="absolute z-0 h-full w-full"
                        fill={
                          clinic.clinicId === currentClinic?.id
                            ? '#FFFFFF'
                            : leagueRanking <= 3
                            ? 'var(--successMain)'
                            : 'var(--primary)'
                        }
                      />
                    }
                  />
                </div>
              );
            })}
          {/* Show select more button if we are not already at the bottom */}
          {!!league &&
            userClinicPosition + showBelow < league.clinics.length - 1 && (
              <Button
                shape="normal"
                color="primary"
                type="outlined"
                icon="ArrowDownIcon"
                text="See more teams"
                textColor="primary"
                onClick={() => setShowBelow(showBelow + 5)}
                className={'mt-3 mb-4 w-full rounded-2xl'}
              />
            )}
        </div>
      )}
    </div>
  );
};
