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

export const LeagueTab: React.FC = () => {
  const [showAbove, setShowAbove] = useState<number>(1);
  const [showBelow, setShowBelow] = useState<number>(1);

  const userClinic = useSelector(communitySelectors.getClinicSelector);
  const league = useSelector(communitySelectors.getLeagueSelector);

  const appDispatch = useAppDispatch();

  const today = new Date();

  const { isLoading: isLoadingLeague } = useThunkFetchCall(
    'community',
    CommunityActions.GET_LEAGUE_BY_ID
  );
  const { isLoading: isLoadingClinic } = useThunkFetchCall(
    'community',
    CommunityActions.GET_CLINIC_BY_ID
  );

  const isLoading = isLoadingLeague || (!userClinic && isLoadingClinic);

  const userQuarterPosition = userClinic?.points?.leagueRanking || 0;
  // TODO: Implement end of year ranking
  const userEndOfYearPosition = /* userClinic?.points?.endOfYearRanking ||  */ 0;

  const userClinicBottom =
    userQuarterPosition === (league?.clinics.length || 0) - 1;

  // TODO: Implement end of year ranking
  ////////////////////////////////////
  const isFirstPlaceEndOfYear = false;
  const isSecondPlaceEndOfYear = false;
  const isThirdPlaceEndOfYear = false;
  const isTop25PercentEndOfYear = false;
  const isMiddle50PercentEndOfYear = false;
  /////////////////////////////////////////////
  // From 1 to 15 October, show the end-of-year league scoreboard instead of the quarterly board.
  const isEndOfTheYear = today.getMonth() === 9 && today.getDate() <= 15;

  const description = isEndOfTheYear
    ? `Oct ${today.getFullYear() - 1} to Sep ${today.getFullYear()}`
    : `Points earned so far in ${getCommunityQuarterDescription(today).replace(
        ': ',
        ' ('
      )})`;

  const alertProps = useMemo((): AlertProps => {
    const message = `You ended the year in position ${userEndOfYearPosition} in the ${league?.name} league.`;
    if (isFirstPlaceEndOfYear) {
      return {
        type: 'warning',
        title: `Well done ${userClinic?.name} team!`,
        message: `You won first place in the ${league?.name} league!`,
        customIcon: <PollyImpressed className="h-14 w-14 self-center" />,
      };
    }

    if (isSecondPlaceEndOfYear || isThirdPlaceEndOfYear) {
      return {
        type: 'warning',
        title: `Well done ${userClinic?.name} team!`,
        message: `You ended the year in ${
          isSecondPlaceEndOfYear ? 'second' : 'third'
        } place in the ${league?.name} league!`,
        customIcon: <PollyImpressed className="h-14 w-14 self-center" />,
      };
    }

    if (isTop25PercentEndOfYear) {
      return {
        type: 'warning',
        title: `Good job ${userClinic?.name} team!`,
        message,
        customIcon: <PollyHappy className="h-14 w-14 self-center" />,
      };
    }

    if (isMiddle50PercentEndOfYear) {
      return {
        type: 'warning',
        title: `Not too bad ${userClinic?.name} team!`,
        message,
        customIcon: <PollyHappy className="h-14 w-14 self-center" />,
      };
    }

    return {
      type: 'warning',
      title: `Keep going, ${userClinic?.name} team!`,
      message,
      customIcon: <PollyNeutral className="h-14 w-14 self-center" />,
    };
  }, [
    isFirstPlaceEndOfYear,
    isMiddle50PercentEndOfYear,
    isSecondPlaceEndOfYear,
    isThirdPlaceEndOfYear,
    isTop25PercentEndOfYear,
    league?.name,
    userClinic?.name,
  ]);

  // Set up which clinics to show
  const handleClinicPosition = useCallback(() => {
    if (!!league?.clinics.length && league?.clinics.length <= 15) {
      setShowAbove(userQuarterPosition);
      setShowBelow(league?.clinics.length - userQuarterPosition - 1);
    }

    if (userQuarterPosition === 0) {
      setShowAbove(0);
      setShowBelow(4);
    }

    if (userQuarterPosition <= 5) {
      setShowAbove(userQuarterPosition);
      setShowBelow(4 - userQuarterPosition);
    }

    if (userClinicBottom) {
      setShowAbove(2);
    }
  }, [league?.clinics.length, userClinicBottom, userQuarterPosition]);

  useEffect(() => {
    handleClinicPosition();
  }, [handleClinicPosition]);

  useEffect(() => {
    appDispatch(
      getLeagueById({
        leagueId: userClinic?.league?.id || '',
        forceReload: true,
      })
    );
  }, [appDispatch, userClinic?.league?.id]);

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
  return (
    <div className="flex flex-col p-4 pt-6">
      <Typography type="h2" text={`${league?.name} scoreboard`} />
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
          {!!league && userQuarterPosition - showAbove > 0 && (
            <PointsDetailsCard
              pointsEarned={league?.clinics[0].pointsTotal}
              activityCount={league?.clinics[0].leagueRanking}
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
          {!!league && userQuarterPosition - showAbove > 0 && (
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
              Math.max(userQuarterPosition - showAbove, 0),
              userQuarterPosition + showBelow + 1
            )
            .map((clinic) => (
              <div key={clinic.clinicId}>
                <PointsDetailsCard
                  pointsEarned={clinic.pointsTotal}
                  activityCount={clinic.leagueRanking}
                  title={clinic.clinicName}
                  size="medium"
                  className={
                    clinic.clinicId === userClinic?.id ? 'mb-3 mt-2' : 'mb-1'
                  }
                  textColour={
                    clinic.clinicId === userClinic?.id ? 'white' : 'textMid'
                  }
                  colour={
                    clinic.clinicId === userClinic?.id
                      ? 'successMain'
                      : clinic.leagueRanking <= 3
                      ? 'successBg'
                      : 'uiBg'
                  }
                  badgeTextColour={
                    clinic.clinicId === userClinic?.id ? 'successMain' : 'white'
                  }
                  badgeImage={
                    <Badge
                      className="absolute z-0 h-full w-full"
                      fill={
                        clinic.clinicId === userClinic?.id
                          ? '#FFFFFF'
                          : clinic.leagueRanking <= 3
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
            userQuarterPosition + showBelow < league.clinics.length - 1 && (
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
