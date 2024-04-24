import {
  Breadcrumb,
  BreadcrumbProps,
  DatePicker,
  LoadingSpinner,
  PointsDetailsCard,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';

import ROUTES from '../../../../../../routes/app.routes-constants';
import { PortalLeagueDto, getCommunityQuarterDescription } from '@ecdlink/core';
import { endOfMonth, startOfMonth, sub } from 'date-fns';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GetLeague, QueryLeagueArgs } from '@ecdlink/graphql';
import { useLocation, useParams } from 'react-router';
import { LeagueDetailsRouteParams, LeagueDetailsRouteState } from './types';

export const LeagueDetails = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const lastYear = currentYear - 1;

  const { quarter } = getCommunityQuarterDescription(today);

  const startSeason = startOfMonth(new Date(lastYear, 9));
  const startQuarter = startOfMonth(
    new Date(currentYear, quarter.startMonth - 1)
  );
  const endQuarter = endOfMonth(new Date(currentYear, quarter.endMonth - 1));

  const [startDate, setStartDate] = useState(startQuarter);
  const [endDate, setEndDate] = useState(endQuarter);

  const { leagueId } = useParams<LeagueDetailsRouteParams>();
  const { state } = useLocation<LeagueDetailsRouteState>();

  const { data, loading } = useQuery<{ league?: PortalLeagueDto }>(GetLeague, {
    fetchPolicy: 'cache-and-network',
    variables: {
      startDate,
      endDate: sub(endOfMonth(endDate), { days: 1 }),
      leagueId,
    } as QueryLeagueArgs,
    skip: !startDate || !endDate,
  });

  const hideActivityCount =
    data?.league?.clinics.length > 1 &&
    data?.league?.clinics?.every((clinic) => clinic.leagueRanking === 1);

  const paths: BreadcrumbProps['paths'] = [
    {
      name: 'Clinics',
      url: ROUTES.CLINICS.ALL_CLINICS,
    },
    {
      name: 'Leagues',
      url: ROUTES.CLINICS.LEAGUES.ROOT,
    },
    {
      name: `${state?.startDate ?? ''} - ${state?.endDate ?? ''} Leagues`,
      url: ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ROOT,
      state,
    },
    {
      name: state?.leagueName ?? data?.league?.name ?? 'League',
      url: '',
    },
  ];

  const onChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <>
      <Breadcrumb paths={paths} />
      <div className="my-8 flex items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          {!!data?.league && !loading && (
            <>
              <StatusChip
                className="h-7"
                backgroundColour="primary"
                borderColour="primary"
                textColour="white"
                text={data?.league?.leagueTypeName ?? ''}
                iconPosition="start"
              />
              {!!data?.league?.districtName && (
                <StatusChip
                  className="h-7"
                  backgroundColour="successMain"
                  borderColour="successMain"
                  textColour="white"
                  text={data.league.districtName}
                />
              )}
            </>
          )}
        </div>
        <DatePicker
          showMonthYearPicker
          selectsRange
          selected={startDate}
          startDate={startDate}
          endDate={endDate}
          onChange={onChange}
          minDate={startSeason}
          maxDate={endQuarter}
          colour="secondary"
          showChevronIcon
          hideCalendarIcon
          textColour="white"
          className="z-10 w-60 rounded-xl"
          isFullWidth={false}
          dateFormat={'MMM yyyy'}
        />
      </div>

      {loading || !startDate || !endDate ? (
        <LoadingSpinner
          backgroundColor="secondary"
          spinnerColor="adminPortalBg"
          size="medium"
        />
      ) : (
        data?.league?.clinics?.map((clinic) => (
          <PointsDetailsCard
            key={clinic.id}
            hideActivityCount={hideActivityCount}
            pointsEarned={clinic?.pointsTotal ?? 0}
            activityCount={clinic.leagueRanking ?? 0}
            title={clinic.name}
            description={`Team Lead(s): ${
              clinic.teamLeads
                ?.map(
                  (lead) => `${lead?.firstName ?? ''} ${lead?.surname ?? ''}`
                )
                ?.join(', ') || 'None'
            }`}
            size="medium"
            className="mb-1 rounded-2xl"
            textColour="textMid"
            colour="white"
            badgeTextColour="white"
            badgeImage={
              <Badge
                className="absolute z-0 h-full w-full"
                fill={'var(--primary)'}
              />
            }
          />
        ))
      )}
      {!loading && !data && !!startDate && !!endDate && (
        <Typography type="h2" text="No clinics found" color="textMid" />
      )}
    </>
  );
};
