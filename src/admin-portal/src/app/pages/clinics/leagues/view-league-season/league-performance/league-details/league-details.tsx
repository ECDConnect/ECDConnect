import {
  Breadcrumb,
  BreadcrumbProps,
  DatePicker,
  PointsDetailsCard,
  StatusChip,
} from '@ecdlink/ui';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';

import ROUTES from '../../../../../../routes/app.routes-constants';
import { getCommunityQuarterDescription } from '@ecdlink/core';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useState } from 'react';

export const LeagueDetails = () => {
  const today = new Date();
  const { quarter } = getCommunityQuarterDescription(today);

  const startQuarter = startOfMonth(
    new Date(new Date().getFullYear(), quarter.startMonth - 1)
  );
  const endQuarter = endOfMonth(
    new Date(new Date().getFullYear(), quarter.endMonth - 1)
  );

  const [startDate, setStartDate] = useState(startQuarter);
  const [endDate, setEndDate] = useState(endQuarter);

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
      name: '{startDate} - {endDate} Leagues',
      url: ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ROOT,
    },
    {
      name: '{leagueName}',
      url: '',
    },
  ];

  // TODO: fetch clinics
  const clinics = [1, 2, 3, 4, 5, 6];

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <>
      <Breadcrumb paths={paths} />
      <div className="my-8 flex items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          <StatusChip
            className="h-7"
            backgroundColour="primary"
            borderColour="primary"
            textColour="white"
            text={`{leagueType}`}
            iconPosition="start"
          />
          <StatusChip
            className="h-7"
            backgroundColour="successMain"
            borderColour="successMain"
            textColour="white"
            text={`{districtName}`}
          />
        </div>
        <DatePicker
          selectsRange
          selected={startDate}
          startDate={startDate}
          endDate={endDate}
          onChange={onChange}
          colour="secondary"
          showChevronIcon
          hideCalendarIcon
          textColour="white"
          className="w-60 rounded-xl"
          isFullWidth={false}
          dateFormat={'d MMM yyyy'}
        />
      </div>
      {clinics.map((clinic, index) => (
        <PointsDetailsCard
          key={index}
          pointsEarned={0}
          activityCount={0}
          title={'{ClinicName}'}
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
      ))}
    </>
  );
};
